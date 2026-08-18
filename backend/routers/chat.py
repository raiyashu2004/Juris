"""
routers/chat.py — High-concurrency chat router with rate limiting and secure proxying.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional
import uuid
import logging
import asyncio

from services.langchain_chat import session_manager
from utils.auth import get_current_user
from utils.security import rate_limit_dependency

logger = logging.getLogger("juris.chat")
router = APIRouter()


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=4000)
    session_id: Optional[str] = Field(None, max_length=100)
    domain: Optional[str] = Field("all", max_length=50)
    stream: bool = False


class GenericChatRequest(BaseModel):
    system_prompt: str = Field(..., min_length=1, max_length=20000)
    user_message: str = Field(..., min_length=1, max_length=8000)
    history: Optional[list[dict]] = None


class ChatResponse(BaseModel):
    answer: str
    session_id: str
    turn_count: int


@router.post(
    "/generic-stream",
    dependencies=[Depends(rate_limit_dependency(max_requests=100, window_seconds=60))]
)
async def generic_stream(req: GenericChatRequest):
    """
    LangChain-powered streaming proxy for frontend UI with timeout safety and error handling.
    """
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
    import os

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is missing on the server.")

    llm = ChatGoogleGenerativeAI(
        model="gemini-3.1-flash-lite",
        google_api_key=api_key,
        temperature=0.1,
        streaming=True,
    )

    messages = [SystemMessage(content=req.system_prompt)]
    if req.history:
        for msg in req.history[-10:]:  # Keep last 10 turns for memory efficiency
            if msg.get("role") == "user":
                messages.append(HumanMessage(content=str(msg.get("text", ""))[:4000]))
            elif msg.get("role") == "ai":
                messages.append(AIMessage(content=str(msg.get("text", ""))[:4000]))
    messages.append(HumanMessage(content=req.user_message))

    async def generate():
        try:
            async for chunk in llm.astream(messages):
                chunk_text = str(chunk.content).replace('\n', '\\n')
                yield f"data: {chunk_text}\n\n"
        except asyncio.CancelledError:
            logger.info("Client disconnected from generic-stream.")
        except Exception as e:
            logger.error(f"Error during stream generation: {e}", exc_info=True)
            yield f"data: [Error: Unable to complete response from legal model.]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@router.post(
    "/generic",
    dependencies=[Depends(rate_limit_dependency(max_requests=100, window_seconds=60))]
)
async def generic_call(req: GenericChatRequest):
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
        import os

        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return {"text": "GEMINI_API_KEY is missing on the server."}

        llm = ChatGoogleGenerativeAI(
            model="gemini-3.1-flash-lite",
            google_api_key=api_key,
            temperature=0.1,
        )

        messages = [SystemMessage(content=req.system_prompt)]
        if req.history:
            for msg in req.history[-10:]:
                if msg.get("role") == "user":
                    messages.append(HumanMessage(content=str(msg.get("text", ""))[:4000]))
                elif msg.get("role") == "ai":
                    messages.append(AIMessage(content=str(msg.get("text", ""))[:4000]))
        messages.append(HumanMessage(content=req.user_message))

        response = await asyncio.wait_for(llm.ainvoke(messages), timeout=45.0)
        return {"text": response.content}
    except asyncio.TimeoutError:
        logger.error("Timeout during generic LLM call.")
        return {"text": "Error: Request timed out while consulting the legal database. Please retry."}
    except Exception as e:
        logger.error(f"Error during generic LLM call: {e}", exc_info=True)
        return {"text": "Error: An error occurred while generating legal response. Please try again."}


@router.post(
    "/ask",
    response_model=ChatResponse,
    dependencies=[Depends(rate_limit_dependency(max_requests=80, window_seconds=60))]
)
async def ask(req: ChatRequest, user=Depends(get_current_user)):
    session_id = req.session_id or str(uuid.uuid4())
    chain = session_manager.get_or_create(session_id, req.domain or "all")

    try:
        answer = await asyncio.wait_for(chain.chat(req.question), timeout=45.0)
    except asyncio.TimeoutError:
        raise HTTPException(status_code=504, detail="Request timed out while generating response.")
    except Exception as e:
        logger.error(f"LLM Error in /ask: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate answer from legal model.")

    history = chain.get_history()

    return ChatResponse(
        answer=answer,
        session_id=session_id,
        turn_count=len([m for m in history if m["role"] == "user"]),
    )


@router.post("/clear")
async def clear_session(session_id: str, user=Depends(get_current_user)):
    session_manager.clear_session(session_id)
    return {"message": "Session memory cleared.", "session_id": session_id}


@router.get("/history/{session_id}")
async def get_history(session_id: str, user=Depends(get_current_user)):
    if session_id not in session_manager._sessions:
        raise HTTPException(status_code=404, detail="Session not found.")
    chain = session_manager._sessions[session_id]
    return {"session_id": session_id, "history": chain.get_history()}


@router.get("/domains")
async def get_domains():
    return {"domains": [
        {"id": "all",            "label": "All Domains"},
        {"id": "constitutional", "label": "Constitutional Law"},
        {"id": "criminal",       "label": "Criminal Law (IPC/BNS)"},
        {"id": "civil",          "label": "Civil Law (CPC)"},
        {"id": "family",         "label": "Family Law"},
        {"id": "property",       "label": "Property Law"},
        {"id": "labor",          "label": "Labour Law"},
    ]}
