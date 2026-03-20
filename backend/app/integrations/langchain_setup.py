from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from app.integrations.groq_client import get_chat_groq_client


def build_text_chain(system_prompt: str):
    model = get_chat_groq_client()
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", "{input_text}"),
        ]
    )
    return prompt | model | StrOutputParser()
