"""
Documents Router — Legal Document Analyser endpoints with file signature verification.
"""

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
import uuid
import logging
from datetime import datetime

from services.document_analyser import DocumentAnalyser
from utils.auth import get_current_user
from utils.security import validate_file_signature, sanitize_filename, rate_limit_dependency

logger = logging.getLogger("juris.documents")
router = APIRouter()
analyser = DocumentAnalyser()

ALLOWED_TYPES = {
    "application/pdf", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain", "image/png", "image/jpeg", "image/tiff",
}
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB


class RiskFlagSchema(BaseModel):
    clause_text: str
    risk_level: str
    risk_type: str
    explanation: str
    legal_basis: str
    suggestion: str


class AnalysisResponse(BaseModel):
    document_id: str
    filename: str
    doc_type: str
    summary: str
    parties: list[str]
    key_clauses: list[dict]
    risk_flags: list[RiskFlagSchema]
    relevant_cases: list[dict]
    missing_clauses: list[str]
    jurisdiction: Optional[str]
    word_count: int
    confidence: float
    analysed_at: str


@router.post(
    "/analyse",
    response_model=AnalysisResponse,
    dependencies=[Depends(rate_limit_dependency(max_requests=20, window_seconds=60))]
)
async def analyse_document(
    file: UploadFile = File(...),
    user=Depends(get_current_user),
):
    """
    Upload a legal document (PDF, DOCX, TXT) for analysis.
    Performs deep magic byte validation and safe parsing.
    """
    safe_name = sanitize_filename(file.filename or "uploaded_document")

    # Validate declared MIME type
    if file.content_type and file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported content-type: {file.content_type}. Supported: PDF, DOCX, TXT"
        )

    # Read bytes safely
    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File exceeds maximum allowed size of 20 MB."
        )
    if len(file_bytes) < 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File appears to be empty or corrupted."
        )

    # Magic byte file signature verification
    try:
        validate_file_signature(file_bytes, safe_name)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    # Run analysis
    try:
        result = await analyser.analyse(file_bytes, safe_name)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        logger.error(f"Document analysis failed for {safe_name}: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Document analysis could not be completed. Please ensure the document is not password-protected."
        )

    return AnalysisResponse(
        document_id=str(uuid.uuid4()),
        filename=safe_name,
        doc_type=result.doc_type,
        summary=result.summary,
        parties=result.parties,
        key_clauses=result.key_clauses,
        risk_flags=[
            RiskFlagSchema(
                clause_text=rf.clause_text,
                risk_level=rf.risk_level,
                risk_type=rf.risk_type,
                explanation=rf.explanation,
                legal_basis=rf.legal_basis,
                suggestion=rf.suggestion,
            )
            for rf in result.risk_flags
        ],
        relevant_cases=result.relevant_cases,
        missing_clauses=result.missing_clauses,
        jurisdiction=result.jurisdiction,
        word_count=result.word_count,
        confidence=result.confidence,
        analysed_at=datetime.utcnow().isoformat(),
    )


@router.get("/supported-types")
async def supported_types():
    return {
        "formats": ["PDF", "DOCX", "DOC", "TXT", "PNG", "JPG", "TIFF"],
        "document_types": [
            "Employment Contract", "Sale Deed", "Rental Agreement",
            "Power of Attorney", "Affidavit", "Writ Petition",
            "Bail Application", "Legal Notice", "NDA",
            "Partnership Deed", "FIR", "Any legal document"
        ],
        "max_size_mb": 20,
    }
