"""
Embedding Service — Google Generative AI Embeddings for Indian legal text.

Why Google Embeddings:
- Understands massive context windows
- Zero RAM overhead (API-based)
- 768-dim embeddings stored in pgvector
"""

import os
from typing import ClassVar, Optional
from langchain_google_genai import GoogleGenerativeAIEmbeddings

class EmbeddingService:
    _model: ClassVar[Optional[GoogleGenerativeAIEmbeddings]] = None
    MODEL_NAME = "models/embedding-001"
    DIMENSION = 768

    @classmethod
    async def initialize(cls):
        """Initialize the Google Embedding client."""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("WARNING: GEMINI_API_KEY not found. Embeddings will fail.")
            
        cls._model = GoogleGenerativeAIEmbeddings(
            model=cls.MODEL_NAME,
            google_api_key=api_key,
        )

    async def embed(self, text: str) -> list[float]:
        """Embed a single query string."""
        if not self._model:
            await self.initialize()
        
        # embed_query automatically formats for search queries
        vector = await self._model.aembed_query(text)
        return vector

    async def embed_batch(self, texts: list[str], is_passage: bool = True) -> list[list[float]]:
        """
        Embed a batch of document chunks for ingestion.
        """
        if not self._model:
            await self.initialize()
            
        if is_passage:
            vectors = await self._model.aembed_documents(texts)
        else:
            # Although rare to batch queries, we support it
            vectors = [await self._model.aembed_query(t) for t in texts]
            
        return vectors
