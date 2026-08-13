from llm import config
from llm.llm import llm_call

print(f"Sağlayıcı : {config.LLM_PROVIDER}")
print(f"Model     : {config.LLM_MODEL}")
print("-" * 40)

while True:
    user_input = input("> ")

    if user_input == "q" or user_input == "Q":
        break

    cevap = llm_call(
        prompt=user_input,
        system="Sen yardımcı bir asistansın. Türkçe yanıt ver.",
    )
    print("AI cevabı:", cevap)
