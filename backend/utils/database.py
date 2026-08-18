"""Database connection pool for high-concurrency operations."""

import asyncpg
from typing import Optional
import os
import asyncio

_pool: Optional[asyncpg.Pool] = None
_pool_lock = asyncio.Lock()


async def get_db_pool() -> asyncpg.Pool:
    """Returns or initializes the asyncpg connection pool."""
    global _pool
    if _pool is None:
        async with _pool_lock:
            if _pool is None:
                _pool = await asyncpg.create_pool(
                    dsn=os.getenv("DATABASE_URL", "postgresql://juris:juris_secret@localhost:5432/juris"),
                    min_size=10,
                    max_size=60,
                    command_timeout=15.0,
                    max_inactive_connection_lifetime=300.0,
                    timeout=10.0,
                )
    return _pool


async def close_db():
    """Gracefully closes all database connections in the pool."""
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None


async def init_db():
    pool = await get_db_pool()
    async with pool.acquire(timeout=10.0) as conn:
        await conn.execute("CREATE EXTENSION IF NOT EXISTS vector;")
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS legal_chunks (
                chunk_id TEXT PRIMARY KEY,
                source_type TEXT NOT NULL,
                domain TEXT,
                source_title TEXT NOT NULL,
                citation TEXT NOT NULL,
                court TEXT,
                year INTEGER,
                content TEXT NOT NULL,
                chunk_index INTEGER DEFAULT 0,
                embedding vector(768)
            );
        """)
