# backend/brain.py
import os
import chromadb
from sentence_transformers import SentenceTransformer
from pypdf import PdfReader
import ollama
from PIL import Image

# Setup
db_client = chromadb.PersistentClient(path="./cortex_memory")
collection = db_client.get_or_create_collection(name="my_documents")
embed_model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

# --- ฟังก์ชันแปลภาษา (Magic Trick!) ---
def translate_query(thai_query):
    """แปลคำค้นหาไทย -> อังกฤษ เพื่อให้ค้นหาแม่นยำขึ้น"""
    # ถ้าพิมพ์อังกฤษมาอยู่แล้ว ก็ไม่ต้องแปล
    if all(ord(c) < 128 for c in thai_query.replace(" ", "")):
        return thai_query
        
    try:
        res = ollama.chat(model='mistral', messages=[{
            'role': 'user',
            'content': f"Translate this Thai text to English keywords for a search engine. Output ONLY the English translation. Text: '{thai_query}'"
        }])
        english_query = res['message']['content'].strip()
        print(f"🇹🇭 Query: {thai_query} -> 🇬🇧 Translated: {english_query}")
        return english_query
    except:
        return thai_query

# --- ส่วนอ่านไฟล์และรูปภาพ (เหมือนเดิม) ---
def analyze_image(image_path):
    print(f"   👁️ Looking at: {os.path.basename(image_path)}")
    try:
        res = ollama.chat(
            model='llava', 
            messages=[{
                'role': 'user',
                'content': 'Describe this image in detail. Focus on text, numbers, QR codes, and the type of document (e.g., slip, receipt, screen, interface).',
                'images': [image_path]
            }]
        )
        return res['message']['content']
    except Exception as e:
        print(f"      ❌ Image Error: {e}")
        return ""

def read_file_content(file_path):
    ext = file_path.split('.')[-1].lower()
    content = ""
    try:
        if ext == 'pdf':
            reader = PdfReader(file_path)
            for page in reader.pages:
                text = page.extract_text()
                if text: content += text + "\n"
        elif ext in ['txt', 'md', 'csv', 'json']:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        elif ext in ['jpg', 'jpeg', 'png']:
            content = analyze_image(file_path)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return content

def ingest_folder(folder_path):
    count = 0
    print(f"📂 Scanning: {folder_path}")
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith(('.txt', '.md', '.pdf', '.jpg', '.jpeg', '.png')):
                full_path = os.path.join(root, file)
                existing = collection.get(ids=[full_path])
                if existing['ids']: continue # Skip existing

                text = read_file_content(full_path)
                if not text.strip(): continue

                embedding = embed_model.encode(text).tolist()
                collection.add(
                    documents=[text],
                    metadatas=[{"source": full_path, "filename": file}],
                    ids=[full_path],
                    embeddings=[embedding]
                )
                count += 1
                print(f"   ✅ Memorized: {file}")
    return {"status": "success", "files_processed": count}

# --- แก้ส่วนค้นหา (Search) ให้ใช้คำแปลภาษาอังกฤษ ---
def search_documents(query_text, n_results=5):
    english_query = translate_query(query_text)
    query_vec = embed_model.encode(english_query).tolist()
    results = collection.query(query_embeddings=[query_vec], n_results=n_results)
    
    formatted_results = []
    if results['documents']:
        for i in range(len(results['documents'][0])):
            distance = results['distances'][0][i]
            
            # --- สูตรโกงความตาย (Calibration) ---
            # ปรับสูตรให้กระจายตัวมากขึ้น (ไม่กระจุกที่ 99%)
            # สมมติ distance อยู่ช่วง 10-40
            # Distance 10 -> 1 / 1.1 = 0.90 (90%)
            # Distance 30 -> 1 / 1.3 = 0.76 (76%)
            final_score = 1 / (1 + (distance / 100))
            
            formatted_results.append({
                "content": results['documents'][0][i],
                "source": results['metadatas'][0][i]['filename'],
                "path": results['metadatas'][0][i]['source'],
                "score": final_score 
            })
            
    # เรียงลำดับจากคะแนนมากไปน้อย
    formatted_results.sort(key=lambda x: x['score'], reverse=True)
    return formatted_results

# --- แก้ส่วนตอบคำถาม (Prompt Engineering) ---
def generate_answer(query, context_results):
    # กรองเอาเฉพาะข้อมูลที่มีคะแนนเกิน 50% (0.5) ไปให้ AI อ่าน
    high_quality_context = [item for item in context_results if item['score'] > 0.5]
    
    if not high_quality_context and context_results:
        high_quality_context = [context_results[0]]
    
    context_text = ""
    for item in high_quality_context:
        context_text += f"[Source: {item['source']}] Content: {item['content']}\n\n"
    
    prompt = f"""
    Context:
    {context_text}
    
    User Query: "{query}"
    
    Task: Answer the query based ONLY on the provided Context.
    1. Answer in Thai language ONLY. (ตอบเป็นภาษาไทยเท่านั้น)
    2. Keep the answer concise and to the point.
    3. If the context has an image description matching the query, confirm it.
    4. Do not mention "Based on the context" (ไม่ต้องพูดว่า "จากข้อมูล..."), just answer directly.
    """

    try:
        response = ollama.chat(model='mistral', messages=[
            {'role': 'user', 'content': prompt},
        ])
        return response['message']['content']
    except Exception as e:
        return f"AI Error: {str(e)}"