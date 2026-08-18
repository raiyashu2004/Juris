"""
JurisAI — Indian Legal AI
FastAPI Application Entrypoint with High-Concurrency & Multi-Layer Security Hardening.
"""

import logging
import asyncio
from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from routers import chat, documents, cases, auth
from services.embeddings import EmbeddingService
from services.llm import close_http_client
from services.langchain_chat import session_manager
from utils.database import init_db, close_db
from utils.security import SecurityHeadersMiddleware

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s",
)
logger = logging.getLogger("juris.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize and teardown services and connection pools."""
    logger.info("🏛️  JurisAI starting up in hardened high-concurrency mode...")
    
    # 1. Database connection pool initialization
    try:
        await init_db()
        logger.info("✅ Database pool connected (10-60 connections)")
    except Exception as e:
        logger.warning(f"⚠️ Database connection failed: {e}. Running in memory/API-fallback mode.")
    
    # 2. Embedding model initialization
    try:
        await EmbeddingService.initialize()
        logger.info("✅ Embedding model ready")
    except Exception as e:
        logger.warning(f"⚠️ Embedding service initialization warning: {e}")

    # 3. Background periodic session cleanup task
    async def periodic_cleanup():
        while True:
            try:
                await asyncio.sleep(300)  # Every 5 minutes
                cleaned = session_manager.cleanup_expired()
                if cleaned > 0:
                    logger.info(f"🧹 Cleaned up {cleaned} expired chat sessions.")
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in periodic session cleanup: {e}")

    cleanup_task = asyncio.create_task(periodic_cleanup())

    logger.info("🚀 JurisAI fully operational & ready for 50+ concurrent users")
    yield

    # Shutdown sequence
    logger.info("👋 JurisAI shutting down — closing connection pools...")
    cleanup_task.cancel()
    try:
        await cleanup_task
    except asyncio.CancelledError:
        pass

    await close_http_client()
    await close_db()
    logger.info("✅ All connections closed cleanly.")


app = FastAPI(
    title="JurisAI API",
    description="Indian Legal AI — Enterprise RAG-powered assistant for Indian law",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url=None,  # Disable ReDoc in production for reduced surface
)

# ─────────────────────────────────────────────────────────────
# 1. Security & Performance Middleware Stack
# ─────────────────────────────────────────────────────────────

# Security Headers (OWASP compliant: CSP, X-Frame-Options, X-Content-Type-Options)
app.add_middleware(SecurityHeadersMiddleware)

# Cross-Origin Resource Sharing (CORS) with strict methods and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:4173",
        "https://juris.in",
        "https://juris.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "X-Requested-With", "Range"],
    max_age=86400,
)

# Compression for large JSON payloads
app.add_middleware(GZipMiddleware, minimum_size=1000)


# ─────────────────────────────────────────────────────────────
# 2. Global Exception Sanitization (No Stack Trace Disclosure)
# ─────────────────────────────────────────────────────────────

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Sanitize validation errors for clean, non-leaking client responses."""
    errors = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        errors.append(f"{field}: {err.get('msg', 'Invalid input')}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation error", "errors": errors},
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catches all unhandled exceptions, logs them securely, and returns a safe response."""
    logger.error(f"Unhandled server exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal error occurred. Please try again later."},
    )


# ─────────────────────────────────────────────────────────────
# 3. Routers
# ─────────────────────────────────────────────────────────────

app.include_router(auth.router,      prefix="/api/auth",      tags=["Auth"])
app.include_router(chat.router,      prefix="/api/chat",      tags=["Legal Chat"])
app.include_router(documents.router, prefix="/api/documents", tags=["Document Analyser"])
app.include_router(cases.router,     prefix="/api/cases",     tags=["Case Finder"])


# ─────────────────────────────────────────────────────────────
# 4. System & Health Check Endpoints
# ─────────────────────────────────────────────────────────────

@app.get("/", tags=["System"])
async def root():
    return {
        "status": "JurisAI Backend is Live",
        "system": "Hardened Enterprise Legal AI Engine",
        "concurrency_capacity": "50+ concurrent sessions",
        "security": "Active rate-limiting, OWASP headers, magic-byte validation",
        "docs": "/docs",
    }


@app.get("/api/health", tags=["System"])
async def health():
    session_stats = session_manager.stats()
    return {
        "status": "ok",
        "service": "JurisAI API",
        "active_sessions": session_stats.get("active_sessions", 0),
    }
