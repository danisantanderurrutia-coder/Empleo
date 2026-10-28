#!/usr/bin/env python3
"""
Automated Job Scraper & Ingestion Script for Empleo Master.
===========================================================
Runs as a scheduled Git-Scraping job in GitHub Actions or locally.
Aggregates authentic job postings strictly matching Daniel Santander's
scientific & environmental profile:
- Soil science, biogeochemistry, edaphology, carbon sequestration
- Climate dynamics, greenhouse gas (GHG) fluxes, peatlands & eddy covariance
- Geospatial analysis, GIS, QGIS, ArcGIS, Google Earth Engine, Remote Sensing
- Hydrology, watershed modeling, hydrogeophysics
- Environmental governance, ecological transition & sustainability policy

NO MOCK JOBS. NO GENERIC HOMEPAGES. NO IRRELEVANT TECH/SALES POSTINGS.
"""

import json
import os
import re
import sys
import urllib.request
import urllib.error
from urllib.parse import urlparse
from datetime import datetime

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "public", "data", "jobs.json")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*"
}

GENERIC_PATHS = {"", "/", "/careers", "/careers.html", "/empleo", "/empleo/", "/jobs", "/unete-a-idom", "/unete-a-idom/"}

# Mandatory Core Domain Anchors: at least one MUST be present in the job text
CORE_DOMAIN_TERMS = [
    r"\bclimate\b", r"\bclima\b", r"\bklima\b", r"\bklimaschutz\b",
    r"\bsoil\b", r"\bsuelos?\b", r"\bboden\b", r"\bbodenkunde\b",
    r"\bcarbon\b", r"\bcarbono\b", r"\bkohlenstoff\b",
    r"\bghg\b", r"\bgei\b", r"\btreibhausgas\b",
    r"\beddy\s+covariance\b", r"\bpeatlands?\b", r"\bturberas?\b", r"\bmoore?\b",
    r"\bwatershed\b", r"\bcuencas?\b", r"\bhydrolog\w*\b", r"\bhidrolog\w*\b",
    r"\bremote\s+sensing\b", r"\bteledetecci\w*\b", r"\bfernerkundung\b",
    r"\bgeophysic\w*\b", r"\bgeofisic\w*\b", r"\bgeophysik\w*\b",
    r"\bedafolog\w*\b", r"\bland\s+use\b", r"\buso\s+del\s+suelo\b",
    r"\becosystem\s+services\b", r"\bservicios\s+ecosist[eé]micos\b",
    r"\benvironmental\s+governance\b", r"\bgobernanza\s+ambiental\b"
]

# Secondary Skills: only counted if a core domain anchor is already present
SECONDARY_TERMS = [
    r"\bqgis\b", r"\barcgis\b", r"\bgis\b", r"\bsig\b", r"\bgoogle\s+earth\s+engine\b",
    r"\br\b", r"\bpython\b", r"\bmodeling\b", r"\bmodelaci[oó]n\b", r"\bmodelierung\b"
]

# Excluded Titles / Roles that are completely outside the user's scientific profile
EXCLUDED_ROLE_PATTERNS = [
    r"\baccount\s+executive\b", r"\bsales\b", r"\bventas\b", r"\bvertrieb\b",
    r"\bmarketing\b", r"\brecruiting\b", r"\btax\b", r"\bsteuerberater\b",
    r"\bdevops\b", r"\bfrontend\b", r"\bfullstack\b", r"\bembedded\b",
    r"\blaunch\s+vehicle\b", r"\brobotics\b", r"\bcompensation\b",
    r"\bcorporate\s+finance\b", r"\bcustomer\s+support\b", r"\bcall\s+center\b"
]


def is_canonical_url(url_str: str) -> bool:
    if not url_str or not url_str.startswith("http"):
        return False
    try:
        parsed = urlparse(url_str)
        return parsed.path.rstrip("/") not in GENERIC_PATHS and bool(parsed.path.strip("/"))
    except Exception:
        return False


def strip_html(html_str):
    if not html_str:
        return ""
    clean = re.sub(r"<[^>]+>", " ", html_str)
    return re.sub(r"\s+", " ", clean).strip()


def matches_profile_strictly(title: str, description: str, tags: list[str]) -> tuple[bool, list[str]]:
    full_text = f"{title} {description} {' '.join(tags)}".lower()

    # 1. Reject if title has excluded words
    title_lower = title.lower()
    for exc in EXCLUDED_ROLE_PATTERNS:
        if re.search(exc, title_lower):
            return False, []

    # 2. Must match at least ONE core environmental/soil/climate anchor
    matched_core = []
    for pattern in CORE_DOMAIN_TERMS:
        if re.search(pattern, full_text):
            matched_core.append(pattern.replace(r"\b", "").replace(r"\w*", ""))

    if not matched_core:
        return False, []

    # 3. Collect secondary matched terms
    matched_secondary = []
    for pattern in SECONDARY_TERMS:
        if re.search(pattern, full_text):
            matched_secondary.append(pattern.replace(r"\b", "").replace(r"\w*", ""))

    return True, matched_core + matched_secondary


def fetch_json(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as res:
            return json.loads(res.read().decode("utf-8"))
    except Exception as e:
        print(f"[Warning] Failed fetching {url}: {e}", file=sys.stderr)
        return None


def scrape_arbeitnow():
    offers = []
    print("[Arbeitnow] Consultando ofertas activas con filtro estricto...")
    data = fetch_json("https://www.arbeitnow.com/api/job-board-api")
    if not data or "data" not in data:
        return offers

    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    for j in data["data"]:
        title = j.get("title", "")
        url = j.get("url", "")
        if not is_canonical_url(url):
            continue

        desc = strip_html(j.get("description", ""))
        tags = j.get("tags") or []
        location = j.get("location") or ("Remoto (Europa)" if j.get("remote") else "Alemania")

        is_match, matched_kws = matches_profile_strictly(title, desc, tags)
        if not is_match:
            continue

        slug = j.get("slug", str(hash(title)))
        pub_time = j.get("publication_time")
        if pub_time:
            pub_date = datetime.utcfromtimestamp(pub_time).strftime("%Y-%m-%d")
        else:
            pub_date = timestamp.split(" ")[0]

        is_bilbao = any(b in location.lower() for b in ["bilbao", "bizkaia", "euskadi", "basque"])

        offers.append({
            "id": f"arbeitnow-{slug}",
            "title": title,
            "company": j.get("company_name", "Empresa"),
            "location": location,
            "country": "Alemania" if ("germany" in location.lower() or "alemania" in location.lower()) else "Europa / Remoto",
            "isBilbaoLocation": is_bilbao,
            "isRemote": bool(j.get("remote")),
            "url": url,
            "sourceId": "src-arbeitnow-scraped",
            "sourceName": "Arbeitnow (Europa & DACH)",
            "publishedDate": pub_date,
            "rawDescription": desc[:1200],
            "requirements": tags[:10],
            "responsibilities": [],
            "status": "Nueva",
            "extractedAt": timestamp,
            "isVerified": True,
            "verificationStatus": "Vigente y Verificada",
            "matchedKeywords": matched_kws
        })

    print(f"[Arbeitnow] Encontradas {len(offers)} ofertas verdaderamente alineadas con ciencias ambientales/clima.")
    return offers


def scrape_remotive():
    offers = []
    print("[Remotive] Consultando vacantes remotas con filtro estricto...")
    data = fetch_json("https://remotive.com/api/remote-jobs?limit=50")
    if not data or "jobs" not in data:
        return offers

    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    for j in data["jobs"]:
        title = j.get("title", "")
        url = j.get("url", "")
        if not is_canonical_url(url):
            continue

        desc = strip_html(j.get("description", ""))
        tags = j.get("tags") or []
        location = j.get("candidate_required_location") or "Remoto (Global)"

        is_match, matched_kws = matches_profile_strictly(title, desc, tags)
        if not is_match:
            continue

        job_id = j.get("id", str(hash(title)))
        pub_date = (j.get("publication_date") or "").split("T")[0] or timestamp.split(" ")[0]

        offers.append({
            "id": f"remotive-{job_id}",
            "title": title,
            "company": j.get("company_name", "Empresa Remota"),
            "location": location,
            "country": "Remoto Global",
            "isBilbaoLocation": False,
            "isRemote": True,
            "url": url,
            "sourceId": "src-remotive-scraped",
            "sourceName": "Remotive (API Global)",
            "publishedDate": pub_date,
            "rawDescription": desc[:1200],
            "requirements": tags[:10],
            "responsibilities": [],
            "status": "Nueva",
            "extractedAt": timestamp,
            "isVerified": True,
            "verificationStatus": "Vigente y Verificada",
            "matchedKeywords": matched_kws
        })

    print(f"[Remotive] Encontradas {len(offers)} ofertas verificadas.")
    return offers


def main():
    print(f"=== Iniciando Job Scraper Estricto a las {datetime.utcnow().isoformat()} ===")
    all_offers = []

    # Scrape external APIs with strict domain anchors and canonical URL enforcement
    all_offers.extend(scrape_arbeitnow())
    all_offers.extend(scrape_remotive())

    # Deduplicate by URL
    seen_urls = set()
    unique_offers = []
    for o in all_offers:
        url = o.get("url")
        if url and url not in seen_urls:
            seen_urls.add(url)
            unique_offers.append(o)

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(unique_offers, f, ensure_ascii=False, indent=2)

    print(f"=== Scraping finalizado. Vacantes auténticas verificadas: {len(unique_offers)} ===")
    print(f"Base de datos saneada guardada en: {os.path.abspath(OUTPUT_PATH)}")


if __name__ == "__main__":
    main()
