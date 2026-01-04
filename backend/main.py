# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import brain 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class FolderRequest(BaseModel):
    path: str

class QueryRequest(BaseModel):
    query: str

@app.get("/")
def read_root():
    return {"status": "Cortex Brain Ready"}

@app.post("/api/scan")
def scan_folder(request: FolderRequest):
    try:
        result = brain.ingest_folder(request.path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/search")
def search(request: QueryRequest):
    # 1. ค้นหาเอกสาร
    results = brain.search_documents(request.query)
    
    # 2. (Optional) ให้ AI สรุปคำตอบจากเอกสารนั้น
    # ถ้าหาไม่เจอเลย ไม่ต้องสรุป
    ai_answer = ""
    if results:
         print("🤔 AI is thinking...")
         ai_answer = brain.generate_answer(request.query, results)

    return {
        "results": results,     # รายการเอกสารอ้างอิง
        "ai_answer": ai_answer  # คำตอบที่ AI สรุปให้
    }