import os
from fastapi import FastAPI
from dotenv import load_dotenv

# .env dosyasındaki API anahtarlarını yüklüyoruz
load_dotenv()

app = FastAPI(title="Fonradar AI Backend")

@app.get("/")
def home():
    return {
        "status": "online",
        "message": "Fonradar AI Backend Servisi Çalışıyor!",
        "has_gemini_key": bool(os.getenv("GEMINI_API_KEY")),
        "has_groq_key": bool(os.getenv("GROQ_API_KEY"))
    }