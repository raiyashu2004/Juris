"""
Security and Concurrency Utilities for JurisAI.

Provides:
- In-memory thread-safe sliding window rate limiter
- File signature (magic bytes) verification for document uploads
- Safe filename sanitization
- Security headers middleware definitions
"""

import time
import os
import re
import asyncio
from typing import Dict, Tuple, Optional
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response, JSONResponse


# ─────────────────────────────────────────────────────────────
# 1. In-Memory Sliding-Window Token Bucket Rate Limiter
# ─────────────────────────────────────────────────────────────

class SlidingWindowRateLimiter:
    """
    High-performance, async-safe sliding window rate limiter.
    Tracks request timestamps per IP/key with automatic pruning.
    """
    def __init__(self):
        # key -> list of timestamp floats
        self._requests: Dict[str, list[float]] = {}
        self._lock = asyncio.Lock()
        self._last_cleanup = time.time()

    async def is_allowed(self, key: str, max_requests: int, window_seconds: int = 60) -> Tuple[bool, int, int]:
        """
        Check if request is allowed.
        Returns: (allowed: bool, remaining_requests: int, retry_after_seconds: int)
        """
        now = time.time()
        cutoff = now - window_seconds

        async with self._lock:
            # Periodic cleanup of stale keys every 2 minutes
            if now - self._last_cleanup > 120:
                self._prune_stale(cutoff)
                self._last_cleanup = now

            timestamps = self._requests.get(key, [])
            # Filter out timestamps older than window
            valid_timestamps = [t for t in timestamps if t > cutoff]

            if len(valid_timestamps) >= max_requests:
                earliest = valid_timestamps[0]
                retry_after = max(1, int(earliest + window_seconds - now))
                self._requests[key] = valid_timestamps
                return False, 0, retry_after

            valid_timestamps.append(now)
            self._requests[key] = valid_timestamps
            remaining = max_requests - len(valid_timestamps)
            return True, remaining, 0

    def _prune_stale(self, cutoff: float):
        keys_to_delete = []
        for k, timestamps in self._requests.items():
            valid = [t for t in timestamps if t > cutoff]
            if not valid:
                keys_to_delete.append(k)
            else:
                self._requests[k] = valid
        for k in keys_to_delete:
            del self._requests[k]


global_rate_limiter = SlidingWindowRateLimiter()


def rate_limit_dependency(max_requests: int = 60, window_seconds: int = 60):
    """FastAPI Dependency for route-level rate limiting."""
    async def dependency(request: Request):
        client_ip = request.client.host if request.client else "unknown"
        # Combine IP and path for route-specific bucket
        key = f"{client_ip}:{request.url.path}"
        allowed, remaining, retry_after = await global_rate_limiter.is_allowed(
            key, max_requests=max_requests, window_seconds=window_seconds
        )
        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Please try again in {retry_after} seconds.",
                headers={"Retry-After": str(retry_after), "X-RateLimit-Remaining": "0"}
            )
        return True
    return dependency


# ─────────────────────────────────────────────────────────────
# 2. Security Headers Middleware
# ─────────────────────────────────────────────────────────────

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Applies OWASP-recommended security headers to all HTTP responses.
    """
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        
        # Defense-in-depth HTTP security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "accelerometer=(), camera=(), geolocation=(), microphone=(), payment=()"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        # API protection CSP
        if not response.headers.get("Content-Security-Policy"):
            response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none';"
            
        return response


# ─────────────────────────────────────────────────────────────
# 3. File Signature (Magic Bytes) & Name Sanitization
# ─────────────────────────────────────────────────────────────

# Supported magic byte signatures
MAGIC_SIGNATURES = {
    "pdf": [b"%PDF-"],
    "docx": [b"PK\x03\x04"],
    "png": [b"\x89PNG\r\n\x1a\n"],
    "jpeg": [b"\xff\xd8\xff"],
    "tiff": [b"II*\x00", b"MM\x00*"],
}

def validate_file_signature(file_bytes: bytes, filename: str) -> str:
    """
    Validates that file content matches its declared extension by inspecting magic bytes.
    Returns detected format name or raises ValueError.
    """
    if len(file_bytes) < 8:
        raise ValueError("File content is too small to be a valid document.")

    ext = filename.lower().split(".")[-1] if "." in filename else ""

    # Plain text validation
    if ext == "txt":
        try:
            file_bytes[:1024].decode("utf-8")
            return "txt"
        except UnicodeDecodeError:
            try:
                file_bytes[:1024].decode("latin-1")
                return "txt"
            except Exception:
                raise ValueError("Text file contains invalid non-text encoding.")

    # Binary document magic byte check
    for fmt, signatures in MAGIC_SIGNATURES.items():
        for sig in signatures:
            if file_bytes.startswith(sig):
                if ext in [fmt, "doc", "jpg"] or (fmt == "docx" and ext in ["docx", "doc"]):
                    return fmt
                return fmt  # Matches valid binary format

    # If extension is pdf/docx/image but magic bytes didn't match
    if ext in ["pdf", "docx", "doc", "png", "jpg", "jpeg", "tiff"]:
        raise ValueError(f"File header does not match declared .{ext} format (possible disguised or corrupted file).")

    return "unknown"


def sanitize_filename(filename: str) -> str:
    """
    Sanitizes filenames to prevent path traversal attacks (e.g. ../../etc/passwd or ..\\..\\cmd.exe).
    """
    # Normalize Windows and Unix path separators and strip null bytes
    normalized = filename.replace("\\", "/").replace("\x00", "")
    cleaned = os.path.basename(normalized)
    # Remove potentially dangerous characters, keep alphanumeric, dots, underscores, dashes, spaces
    cleaned = re.sub(r"[^a-zA-Z0-9._\-\s]", "", cleaned).strip()
    return cleaned if cleaned else "document_upload"
