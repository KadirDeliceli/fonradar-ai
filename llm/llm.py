from __future__ import annotations

from langchain_core.messages import HumanMessage, SystemMessage

from llm import config


def get_llm(temperature: float = 0.2):
    """
    config.LLM_PROVIDER'a göre dogru sohbet modelini kurup dondurur.
    "groq"   -> ChatGroq (varsayilan)
    "gemini" -> ChatGoogleGenerativeAI

    Saglayici paketleri BILEREK fonksiyon icinde (lazy) import edilir: yalnizca
    o an kullanilan saglayicinin paketi kurulu olmasi yeterli, digeri kurulu
    olmasa bile modul cokmez.

    Sagayici degistirmek icin .env'de:
        LLM_PROVIDER=groq   + LLM_API_KEY=<groq anahtari>  (+ istersen LLM_MODEL)
        LLM_PROVIDER=gemini + LLM_API_KEY=<gemini anahtari> (+ istersen LLM_MODEL)
    Kod tarafinda baska hicbir sey degismez.
    """
    if config.LLM_PROVIDER == "gemini":
        from langchain_google_genai import ChatGoogleGenerativeAI

        return ChatGoogleGenerativeAI(
            model=config.LLM_MODEL,
            google_api_key=config.LLM_API_KEY,
            temperature=temperature,
            max_retries=3,
        )

    # varsayilan: groq
    from langchain_groq import ChatGroq

    return ChatGroq(
        model=config.LLM_MODEL,
        api_key=config.LLM_API_KEY,
        temperature=temperature,      # daha kararlı cevap için düşük değer verildi
        max_retries=3,                # hata durumunda otomatik yeniden deneme için
    )


def llm_call(prompt: str, system: str | None = None) -> str:
    """
    AI'a bir mesaj gönderir, dönen düz metni verir.
    (Aktif LLM_PROVIDER'a göre Groq ya da Gemini kullanır.)
    """
    messages = []
    if system:
        messages.append(SystemMessage(content=system))
    messages.append(HumanMessage(content=prompt))
    yanit = get_llm().invoke(messages)
    return (yanit.content or "").strip()