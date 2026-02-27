from __future__ import annotations

from app.services.rag_knowledge_base import KB


def retrieve(query: str) -> list[str]:
    q = query.lower()
    return [entry for entry in KB if any(token in entry.lower() for token in q.split()[:3])] or KB[:2]
