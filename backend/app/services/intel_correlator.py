from __future__ import annotations


def correlate(intel: dict) -> dict:
    rep = (intel["virustotal"]["reputation"] + intel["abuseipdb"]["abuse_confidence"]) / 2
    return {"reputation_score": rep, "malware_detection": intel["virustotal"]["malicious"], "details": intel}
