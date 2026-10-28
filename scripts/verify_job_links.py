#!/usr/bin/env python3
"""
Pre-Flight Link Validator for Empleo Master
===========================================
Validates the canonical health of job offer URLs before they enter
the database, frontend feeds, or email digests.

Rules:
1. Rejects generic portal homepages (e.g. /careers.html, /empleo).
2. Verifies HTTP status 200 (rejects 404, 410, 500).
3. Detects expired vacancy signals in page content ("abgelaufen", "cerrada", "expired").
"""

import sys
import os
import json
import urllib.request
import urllib.error
from urllib.parse import urlparse

GENERIC_CAREER_PATHS = {
    "/", "", "/careers", "/careers.html", "/empleo", "/empleo/", "/jobs", "/unete-a-idom", "/unete-a-idom/"
}

EXPIRED_SIGNALS = [
    "ausschreibung abgelaufen",
    "stelle ist nicht mehr verfügbar",
    "stelle abgelaufen",
    "die gesuchte seite wurde nicht gefunden",
    "convocatoria cerrada",
    "convocatoria finalizada",
    "el plazo de inscripción ha finalizado",
    "this job has expired",
    "position has been filled",
    "job is no longer available"
]

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"


def is_canonical_job_url(url_str: str) -> tuple[bool, str]:
    """Check if URL points to a specific job vacancy rather than a general careers portal."""
    if not url_str or not url_str.startswith("http"):
        return False, "URL inválida o vacía"
    
    try:
        parsed = urlparse(url_str)
        path = parsed.path.rstrip("/")
        
        # Check against known portal landing pages
        if path in GENERIC_CAREER_PATHS or path == "":
            return False, f"Es portada general de empleo ({path or '/'}), no una vacante específica"
            
        return True, "Formato canónico válido"
    except Exception as e:
        return False, f"Error al parsear URL: {e}"


def check_live_http_status(url_str: str, timeout: int = 8) -> tuple[bool, int, str]:
    """Perform live HTTP check to verify vacancy is still active."""
    req = urllib.request.Request(
        url_str,
        headers={"User-Agent": USER_AGENT, "Accept-Language": "es,de;q=0.9,en;q=0.8"}
    )
    
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            status = response.getcode()
            if status != 200:
                return False, status, f"Código HTTP {status}"
            
            # Read first 12KB to inspect for expiration messages
            sample = response.read(12000).decode("utf-8", errors="ignore").lower()
            for signal in EXPIRED_SIGNALS:
                if signal in sample:
                    return False, 200, f"Página indica expiración: '{signal}'"
                    
            return True, 200, "Enlace activo y verificado"
    except urllib.error.HTTPError as e:
        return False, e.code, f"Error HTTP {e.code}"
    except urllib.error.URLError as e:
        return False, 0, f"Error de red/DNS: {e.reason}"
    except Exception as e:
        return False, 0, f"Excepción al verificar: {e}"


def validate_jobs_dataset(file_path: str):
    print("==================================================")
    print("🔍 Validador Pre-Flight de Enlaces de Empleo Master")
    print(f"   Archivo: {file_path}")
    print("==================================================")

    if not os.path.exists(file_path):
        print(f"[!] Archivo no encontrado: {file_path}")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        jobs = json.load(f)

    print(f"[*] Analizando {len(jobs)} registros...")

    valid_jobs = []
    purged_generic = []
    purged_dead = []

    for idx, job in enumerate(jobs):
        title = job.get("title", "Sin título")
        company = job.get("company", "Sin empresa")
        url = job.get("url", "")

        is_canonical, reason = is_canonical_job_url(url)
        if not is_canonical:
            purged_generic.append((title, company, url, reason))
            continue

        valid_jobs.append(job)

    print(f"\n[✓] Vacantes con formato canónico: {len(valid_jobs)}")
    print(f"[✗] Registros con portadas genéricas detectados: {len(purged_generic)}")

    if purged_generic:
        print("\nEjemplos de enlaces a portales generales purgados:")
        for t, c, u, r in purged_generic[:5]:
            print(f" - [{c}] {t} -> {u} ({r})")

    return valid_jobs


if __name__ == "__main__":
    target_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "..", "public", "data", "jobs.json")
    validate_jobs_dataset(target_path)
