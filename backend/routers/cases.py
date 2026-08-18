"""
Cases Router — Find past judgments relevant to a matter.
Searches both internal pgvector DB and Indian Kanoon API.
"""

from fastapi import APIRouter, Depends, Query, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional
import logging
import re

from services.rag import RAGPipeline
from services.llm import get_http_client
from utils.auth import get_current_user
from utils.config import settings
from utils.security import rate_limit_dependency

logger = logging.getLogger("juris.cases")
router = APIRouter()
rag = RAGPipeline()

INDIANKANOON_BASE = "https://api.indiankanoon.org"


class CaseResult(BaseModel):
    title: str
    citation: str
    court: Optional[str]
    year: Optional[int]
    snippet: str
    relevance_score: float
    url: Optional[str]
    source: str          # "internal_db" | "indian_kanoon"


class CaseSearchResponse(BaseModel):
    query: str
    results: list[CaseResult]
    total: int


@router.get(
    "/search",
    response_model=CaseSearchResponse,
    dependencies=[Depends(rate_limit_dependency(max_requests=60, window_seconds=60))]
)
async def search_cases(
    q: str = Query(..., min_length=3, max_length=1000, description="Case matter or legal issue"),
    court: Optional[str] = Query(None, max_length=50, description="supreme_court | high_court | district_court"),
    year_from: Optional[int] = Query(None, ge=1800, le=2100),
    year_to: Optional[int] = Query(None, ge=1800, le=2100),
    domain: Optional[str] = Query(None, max_length=50),
    limit: int = Query(10, ge=1, le=25),
    user=Depends(get_current_user),
):
    """
    Find past judgments relevant to a legal matter.
    Searches internal vector DB + Indian Kanoon API.
    """
    results = []

    # ── 1. Internal vector DB search ──────────────────────
    try:
        from services.embeddings import EmbeddingService
        embedder = EmbeddingService()
        query_vec = await embedder.embed(q)

        chunks = await rag._retrieve_chunks(
            embedding=query_vec,
            domain=domain,
            top_k=limit,
        )

        for chunk in chunks:
            if chunk.source_type != "judgment":
                continue
            if year_from and chunk.year and chunk.year < year_from:
                continue
            if year_to and chunk.year and chunk.year > year_to:
                continue
            results.append(CaseResult(
                title=chunk.source_title,
                citation=chunk.citation,
                court=chunk.court,
                year=chunk.year,
                snippet=chunk.content[:300] + "..." if len(chunk.content) > 300 else chunk.content,
                relevance_score=round(chunk.similarity * 100, 1),
                url=None,
                source="internal_db",
            ))
    except Exception as e:
        logger.warning(f"Vector search failed in cases: {e}")

    # ── 2. Indian Kanoon API (live search) ─────────────────
    ik_results = await _search_indian_kanoon(q, court, year_from, year_to)
    results.extend(ik_results)

    # Sort by relevance score descending
    results.sort(key=lambda x: x.relevance_score, reverse=True)

    return CaseSearchResponse(
        query=q,
        results=results[:limit],
        total=len(results),
    )


@router.get(
    "/similar",
    dependencies=[Depends(rate_limit_dependency(max_requests=40, window_seconds=60))]
)
async def find_similar_cases(
    case_description: str = Query(..., min_length=10, max_length=5000, description="Describe your case facts"),
    top_k: int = Query(5, ge=1, le=15),
    user=Depends(get_current_user),
):
    """
    Given a case description, find the most similar past judgments.
    """
    try:
        result = await rag.query(
            question=f"Find similar judgments for this case: {case_description}",
            top_k=top_k,
        )

        cases = [
            {
                "citation": s.citation,
                "court": s.court,
                "year": s.year,
                "snippet": s.content[:400],
                "similarity": s.similarity,
            }
            for s in result.sources
            if s.source_type == "judgment"
        ]

        return {
            "case_description": case_description,
            "similar_cases": cases,
            "ai_analysis": result.answer,
        }
    except Exception as e:
        logger.error(f"Similar cases search failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve similar cases at this time."
        )


async def _search_indian_kanoon(
    query: str,
    court: Optional[str],
    year_from: Optional[int],
    year_to: Optional[int],
) -> list[CaseResult]:
    """
    Live search on Indian Kanoon public API using shared HTTP client.
    """
    if not getattr(settings, "indiankanoon_api_key", None):
        return []

    params = {
        "formInput": query,
        "pagenum": 0,
    }
    if court == "supreme_court":
        params["courts"] = "supremecourt"
    if year_from:
        params["fromdate"] = f"1-1-{year_from}"
    if year_to:
        params["todate"] = f"31-12-{year_to}"

    try:
        client = await get_http_client()
        resp = await client.post(
            f"{INDIANKANOON_BASE}/search/",
            data=params,
            headers={"Authorization": f"Token {settings.indiankanoon_api_key}"},
            timeout=8.0,
        )
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        logger.warning(f"Indian Kanoon search failed: {e}")
        return []

    results = []
    for doc in data.get("docs", [])[:8]:
        results.append(CaseResult(
            title=doc.get("title", "Unknown"),
            citation=doc.get("citation", doc.get("title", "")),
            court=doc.get("court", None),
            year=int(doc["publishdate"][:4]) if doc.get("publishdate") else None,
            snippet=_strip_html(doc.get("headline", ""))[:300],
            relevance_score=50.0,
            url=f"https://indiankanoon.org/doc/{doc['tid']}/",
            source="indian_kanoon",
        ))
    return results


def _strip_html(text: str) -> str:
    return re.sub(r"<[^>]+>", "", text).strip()
