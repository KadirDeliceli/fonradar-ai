# FonRadar AI — Adım 1: LLM Bağlantısı

Prompt gönderip AI'dan cevap alan yardımcı fonksiyon (LangChain + Groq).

## Kurulum
```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # sonra .env içine Groq anahtarını yaz
python test_llm.py          # "AI cevabı: ..." görürsen Adım 1 tamam
```

## Dosyalar
- `backend/config.py` — .env okuma
- `backend/llm.py` — `llm_call(prompt, system)` fonksiyonu
- `test_llm.py` — bağlantı testi

Groq anahtarı: https://console.groq.com (ücretsiz)
