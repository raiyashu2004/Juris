"""
LLM Service — Google Gemini API wrapper with high-concurrency connection pooling.
"""
import os
import json
import asyncio
import httpx
from typing import AsyncGenerator, Optional

GEMINI_MODEL = "gemini-3.1-flash-lite"
GEMINI_URL   = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}"

# Shared connection pool across all concurrent requests
_http_client: Optional[httpx.AsyncClient] = None
_client_lock = asyncio.Lock()


async def get_http_client() -> httpx.AsyncClient:
    """Returns or initializes the shared httpx.AsyncClient connection pool."""
    global _http_client
    if _http_client is None or _http_client.is_closed:
        async with _client_lock:
            if _http_client is None or _http_client.is_closed:
                _http_client = httpx.AsyncClient(
                    limits=httpx.Limits(max_connections=100, max_keepalive_connections=50),
                    timeout=httpx.Timeout(45.0, connect=10.0),
                    http2=True,
                )
    return _http_client


async def close_http_client():
    """Gracefully closes the shared HTTP connection pool."""
    global _http_client
    if _http_client is not None and not _http_client.is_closed:
        await _http_client.aclose()
        _http_client = None


class LLMService:

    def _get_api_key(self) -> str:
        key = os.getenv("GEMINI_API_KEY")
        if not key:
            raise ValueError("GEMINI_API_KEY is not configured on the server.")
        return key

    async def complete(
        self,
        system: str,
        user: str,
        max_tokens: int = 1500,
        temperature: float = 0.1,
        retries: int = 2,
    ) -> str:
        api_key = self._get_api_key()
        client = await get_http_client()
        
        payload = {
            "system_instruction": {"parts": [{"text": system}]},
            "contents": [{"role": "user", "parts": [{"text": user}]}],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
            },
        }

        last_err = None
        for attempt in range(retries + 1):
            try:
                resp = await client.post(
                    f"{GEMINI_URL}:generateContent?key={api_key}",
                    json=payload,
                )
                resp.raise_for_status()
                data = resp.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
            except httpx.HTTPStatusError as e:
                last_err = e
                # Don't retry on 4xx client errors (except 429)
                if 400 <= e.response.status_code < 500 and e.response.status_code != 429:
                    raise
                if attempt < retries:
                    await asyncio.sleep(0.5 * (2 ** attempt))
            except (httpx.TransportError, asyncio.TimeoutError) as e:
                last_err = e
                if attempt < retries:
                    await asyncio.sleep(0.5 * (2 ** attempt))

        raise RuntimeError(f"LLM request failed after {retries} retries: {str(last_err)}")

    async def stream(
        self,
        system: str,
        user: str,
        max_tokens: int = 1500,
        temperature: float = 0.1,
    ) -> AsyncGenerator[str, None]:
        api_key = self._get_api_key()
        client = await get_http_client()
        
        payload = {
            "system_instruction": {"parts": [{"text": system}]},
            "contents": [{"role": "user", "parts": [{"text": user}]}],
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
            },
        }

        async with client.stream(
            "POST",
            f"{GEMINI_URL}:streamGenerateContent?alt=sse&key={api_key}",
            json=payload,
            timeout=httpx.Timeout(60.0, connect=10.0),
        ) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if not line.startswith("data: "):
                    continue
                try:
                    chunk = json.loads(line[6:])
                    text = chunk["candidates"][0]["content"]["parts"][0]["text"]
                    if text:
                        yield text
                except Exception:
                    continue
