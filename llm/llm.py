from __future__ import annotations

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq

from llm import config

llm = ChatGroq(
    model=config.LLM_MODEL,
    api_key=config.LLM_API_KEY,
    temperature=0.2,      # daha kararlı cevap için düşük değer verildi
    max_retries=3,        # hata durumunda otomatik yeniden deneme için
)


def llm_call(prompt: str, system: str | None = None) -> str:
    """
    AI'a bir mesaj gönderir, dönen düz metni verir.
    """
    messages = []
    if system:
        messages.append(SystemMessage(content=system))
    messages.append(HumanMessage(content=prompt))
    yanit = llm.invoke(messages)
    return (yanit.content or "").strip()


def get_llm(temperature: float = 0.2):
    """Varsayılan sağlayıcı (Groq) için bir sohbet modeli döndürür."""
    return ChatGroq(
        model=config.LLM_MODEL,
        api_key=config.LLM_API_KEY,
        temperature=temperature,
        max_retries=3,
    )


def get_llm_(temperature: float = 0.2):
    """
    Gemini alternatifi. langchain_google_genai import'u BİLEREK fonksiyon
    içinde (lazy): bu paket kurulu olmasa bile llm.py yüklenir/çöker OLMAZ,
    yalnızca bu fonksiyon gerçekten çağrıldığında import denenir.
    NOT: Gemini kullanırsan config.LLM_MODEL'i bir Gemini modeliyle
    (ör. "gemini-2.5-flash") ve anahtarı Gemini anahtarıyla ayarla.
    """
    from langchain_google_genai import ChatGoogleGenerativeAI

    return ChatGoogleGenerativeAI(
        model=config.LLM_MODEL,
        google_api_key=config.LLM_API_KEY,
        temperature=temperature,
        max_retries=3,
    )