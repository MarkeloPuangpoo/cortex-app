from sentence_transformers import SentenceTransformer

# 1. โหลดโมเดล (ครั้งแรกจะนานหน่อย เพราะมันจะโหลดไฟล์จาก Hugging Face)
print("Downloading Model...")
model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')

# 2. ลองแปลงประโยคไทยเป็นตัวเลข
sentences = ["แมวนอนหลับ", "cat sleeping", "สุนัขวิ่งไล่บอล"]
embeddings = model.encode(sentences)

print("Model Loaded Successfully!")
print(f"แปลงประโยคเป็นเวกเตอร์ขนาด: {embeddings.shape}")
print("พร้อมใช้งานสำหรับระบบค้นหาแล้วครับ!")