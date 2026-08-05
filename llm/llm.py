from __future__ import annotations

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq

from llm import config

llm = ChatGroq(
    model=config.LLM_MODEL,
    api_key=config.LLM_API_KEY,
    temperature=0.2,      # daha kararlı cevap içim düşük değer verildi
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
