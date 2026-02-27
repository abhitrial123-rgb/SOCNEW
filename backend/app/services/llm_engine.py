from __future__ import annotations

from typing import Dict

from app.services.rag_retriever import retrieve


def analyze(event: str, confidence: float) -> Dict[str, object]:
    refs = retrieve(event)
    return {
        "classification": "Threat" if confidence > 0.6 else "Info",
        "confidence": round(confidence * 100, 2),
        "reasoning": f"Analyzed '{event}' against local RAG corpus",
        "mitre_ids": ["T1110"] if "brute" in event.lower() else ["T1071"],
        "references": refs,
        "suggested_mitigation": "Isolate host, rotate secrets, and increase telemetry sampling.",
    }
