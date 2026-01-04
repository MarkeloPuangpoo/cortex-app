
# Cortex: Local-First Multimodal Intelligence Engine

**Turn your chaotic file system into a queryable "Second Brain."**

Cortex is a privacy-focused desktop application that "looks" at your files—images, PDFs, and documents—and understands them. Instead of searching by filename (`IMG_2024.jpg`), just ask:
> *"Find the invoice for the RTX 3090 I bought last year"*
> *"Show me the chart from the Q3 report comparing revenue"*

Everything is processed **locally on your device**. No data leaves your machine.

---

## 🚀 Why This Stands Out in 2026

### 1. Privacy & Edge AI
In 2026, the trend is shifting from cloud dependence to local sovereignty. Cortex proves capability in **privacy engineering** and **model optimization** by running heavy AI pipelines strictly on consumer hardware.

### 2. Multimodal RAG (Retrieval-Augmented Generation)
Most systems only read text. Cortex handles **unstructured data pipelines**:
- **Images**: Recognizes objects (e.g., "messy desk," "coffee mug") via Vision-Language Models.
- **Documents**: Extracts text from PDFs and maps them to semantic vectors.
- **Cross-Language Search**: Seamlessly maps Thai queries to English content using an internal translation layer.

### 3. Hybrid AI Architecture
This isn't just a wrapper around an API. It orchestrates a complex dance between **FastAPI**, **Hugging Face Transformers** (for embeddings), and **Ollama** (for reasoning) behind a polished **Electron** frontend.

---

## 🛠 Tech Stack

| Component | Technology | Why? |
| :--- | :--- | :--- |
| **Frontend** | **Electron** + **Next.js** | Desktop-native feel with **React**. Designed with an **"Organic Bento Glass"** aesthetic—modern, clean, and accessible. |
| **Backend** | **Python (FastAPI)** | Hosts the local inference API. Handles file ingestion and acts as the bridge between UI and AI. |
| **LLM / Vision** | **Ollama (Mistral + Llava)** | Powers the reasoning engine and image analysis without needing internet access. |
| **Vector DB** | **ChromaDB** | Specialized local database to store the "meaning" (embeddings) of your files. |
| **Embeddings** | **Hugging Face** | Uses `paraphrase-multilingual` model for high-accuracy cross-language vector search. |

---

## 🧠 The Architecture

### 1. Ingestion Pipeline
- User selects a target folder.
- **Python Service** scans for supported formats (`.pdf`, `.txt`, `.jpg`, `.png`).

### 2. Multimodal Processing
- **PDFs/Text**: Content is extracted and cleaned using `pypdf`.
- **Images**: Passed to the **Llava** model (via Ollama) to generate detailed visual descriptions (e.g., "A voting system interface with a QR code").

### 3. Vector Indexing
- Descriptions and text are converted into 768-dimensional vectors using **Sentence Transformers**.
- Stored in **ChromaDB** locally.

### 4. Intelligent Retrieval (RAG)
- User query: *"หาสลิปเงิน"* (Find money slip).
- **Query Translation**: System auto-translates query to English keywords for better vector matching.
- **Search**: Finds the most relevant file (even if it's an image).
- **Answer**: The LLM synthesizes a natural language response in Thai.

---

## ⚡️ Impact & Achievements

- **Designed and engineered an end-to-end Multimodal RAG system** capable of indexing and retrieving unstructured data with **high relevance accuracy**.
- **Solved the "Semantic Gap"** between text and images by implementing an auto-captioning pipeline for visual data.
- **Built a privacy-first solution** that eliminates cloud costs and data leakage risks, suitable for sensitive environments.

---

## 📦 Installation & Setup

### Prerequisites
1. **Ollama**: Download from [ollama.com](https://ollama.com).
2. **Pull Models**: Run these commands in your terminal:
   ```bash
   ollama pull mistral
   ollama pull llava
   ```

### Running the App

**Backend (Brain):**

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend (Interface):**

```bash
cd frontend
npm install
npm run dev
```

### Usage:
1. Open the app.
2. Point it to a folder containing images or PDFs.
3. Click "Ingest Memories".
4. Start asking questions in natural language.
