from __future__ import annotations

from app.integrations.abuseipdb_connector import query_abuse
from app.integrations.vt_connector import query_vt


def enrich(ioc: str) -> dict:
    vt = query_vt(ioc)
    abuse = query_abuse(ioc)
    return {"virustotal": vt, "abuseipdb": abuse, "cves": ["CVE-2023-34362"], "threat_actors": ["FIN7"]}
