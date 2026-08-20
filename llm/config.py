import os

from dotenv import load_dotenv

load_dotenv()

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "groq").lower()
LLM_API_KEY = os.getenv("LLM_API_KEY", "")

_VARSAYILAN_MODELLER = {
    "groq": "openai/gpt-oss-safeguard-20b",
    "gemini": "gemini-2.5-flash",
}
LLM_MODEL = os.getenv("LLM_MODEL") or _VARSAYILAN_MODELLER.get(LLM_PROVIDER, "openai/gpt-oss-safeguard-20b")
