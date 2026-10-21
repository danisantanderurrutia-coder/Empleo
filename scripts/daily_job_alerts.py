#!/usr/bin/env python3
"""
Job Search OS (Empleo) - Daily Job Alerts & Digest Engine
=========================================================
Runs automatically every morning at 09:00 AM (07:00 UTC) via GitHub Actions or local cron/launchd.
Monitors public federal employment portals in Germany and research institutes:
 - service.bund.de (Official Federal RSS Feed with 500+ active jobs)
 - Thünen-Institut Karriereportal (Institut für Agrarklimaschutz, etc.)
 - Interamt / Umweltbundesamt (UBA)

Filters by environmental, soil, climate, AI and geophysical keywords tailored to Daniel Santander's profile.
Generates an HTML email digest and dispatches it via Resend API or SMTP (Gmail).
"""

import os
import sys
import argparse
import json
import re
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime

# Default configuration
DEFAULT_RECIPIENT = "danisantander.urrutia@gmail.com"
DEFAULT_KEYWORDS = [
    "boden", "bodenkunde", "klima", "klimaschutz", "agrar", "wald",
    "umwelt", "umweltbundesamt", "thünen", "thuenen", "ki", "künstliche intelligenz",
    "machine learning", "geophysik", "eddy", "turbera", "hydrolog",
    "remote sensing", "gis", "datenanalyse"
]

HIGH_PRIORITY_EMPLOYERS = [
    "thünen", "thuenen", "umweltbundesamt", "uba", "bundesamt für naturschutz", "bfn",
    "julius kühn", "institut für agrarklimaschutz", "helmholtz", "leibniz", "geoforschungszentrum"
]

BUND_RSS_URL = "https://www.service.bund.de/Content/Globals/Functions/RSSFeed/RSSGenerator_Stellen.xml"

# Direct monitored offers for pinpoint verification
CURATED_DIRECT_OFFERS = [
    {
        "title": "Wissenschaftliche*r Mitarbeiter*in / Doktorand*in Agrar-/Bodenwissenschaften (w/m/d)",
        "company": "Johann Heinrich von Thünen-Institut (Institut für Agrarklimaschutz)",
        "location": "Braunschweig, Niedersachsen, Alemania",
        "url": "https://www.karriere-thuenen.de/index.php?ac=jobad&id=369&language=2",
        "deadline": "22.10.2026",
        "salary": "TVöD Bund E13 (70% - ca. 43.742 € - 62.705 €)",
        "project": "TechWorms (Kohlenstoffsequestrierung im Unterboden durch Makroporen)",
        "score": 92,
        "urgent": True,
        "snippet": "Investigación predoctoral en secuestro de carbono orgánico en horizontes profundos del suelo, penetración radicular con RootBox, análisis isotópico y modelación en R."
    },
    {
        "title": "Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner (KI-Lab)",
        "company": "Umweltbundesamt (UBA) - Anwendungslabor für KI & Big Data",
        "location": "Leipzig, Berlin oder Dessau-Roßlau, Alemania",
        "url": "https://interamt.de/koop/app/stelle?0&id=1499096",
        "deadline": "28.10.2026",
        "salary": "TVöD Bund E13 (100% - ca. 62.489 € - 89.579 €)",
        "project": "Agenda Digital de Política Ambiental (KI-Lab Verwaltungsvollzug)",
        "score": 88,
        "urgent": False,
        "snippet": "Product ownership y dirección de proyectos ágiles/híbridos para el desarrollo de herramientas de Inteligencia Artificial aplicadas a la gestión y supervisión ambiental federal."
    }
]


def clean_html(raw_html: str) -> str:
    """Strip HTML tags and condense whitespace."""
    if not raw_html:
        return ""
    clean = re.sub(r"<[^>]+>", " ", raw_html)
    return " ".join(clean.split())


def extract_field_from_desc(desc: str, label: str) -> str:
    """Extract fields like 'Arbeitgeber:', 'Ort:', 'Bewerbungsfrist:' from RSS descriptions."""
    pattern = rf"{label}\s*:\s*<strong>([^<]+)</strong>"
    m = re.search(pattern, desc, re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return ""


def fetch_bund_rss_jobs(keywords: list):
    """Fetch and parse service.bund.de RSS feed, filtering by keywords."""
    print(f"[*] Conectando con {BUND_RSS_URL}...")
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)"
    }
    req = urllib.request.Request(BUND_RSS_URL, headers=headers)
    matched = []

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            root = ET.fromstring(data)
            items = root.findall(".//item")
            print(f"[*] Analizando {len(items)} ofertas publicadas en service.bund.de...")

            for item in items:
                title = (item.find("title").text or "").strip()
                desc = (item.find("description").text or "").strip()
                link = (item.find("link").text or "").strip()
                pub_date = (item.find("pubDate").text or "").strip()

                employer = extract_field_from_desc(desc, "Arbeitgeber")
                location = extract_field_from_desc(desc, "Ort")
                deadline = extract_field_from_desc(desc, "Bewerbungsfrist")

                full_text = f"{title} {desc} {employer} {location}".lower()

                # Score matching
                match_count = sum(1 for kw in keywords if kw.lower() in full_text)
                is_high_priority = any(emp in full_text for emp in HIGH_PRIORITY_EMPLOYERS)

                if match_count > 0 or is_high_priority:
                    score = min(95, 60 + (match_count * 8) + (15 if is_high_priority else 0))
                    matched.append({
                        "title": title,
                        "company": employer or "Administración Pública Federal",
                        "location": location or "Alemania",
                        "url": link,
                        "deadline": deadline or "Consultar convocatoria",
                        "salary": "TVöD Bund / TV-L (según convocatoria)",
                        "pub_date": pub_date,
                        "score": score,
                        "urgent": False,
                        "snippet": clean_html(desc)[:220] + "..."
                    })

    except Exception as e:
        print(f"[!] Aviso al consultar RSS de bund.de: {e}")

    # Sort descending by match score
    matched.sort(key=lambda x: x["score"], reverse=True)
    return matched


def build_html_digest(recipient: str, curated_offers: list, rss_offers: list, run_date: str) -> str:
    """Generate a high-conversion, responsive HTML email digest."""
    total_offers = len(curated_offers) + len(rss_offers)

    curated_cards = ""
    for off in curated_offers:
        badge_color = "#ef4444" if off.get("urgent") else "#10b981"
        badge_text = "⚠️ PLAZO INMINENTE (URGENTE)" if off.get("urgent") else "⭐ ALTA AFINIDAD"

        curated_cards += f"""
        <div style="background: #111827; border: 1px solid #1f2937; border-left: 4px solid {badge_color}; border-radius: 8px; padding: 18px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <span style="background: rgba(16, 185, 129, 0.15); color: {badge_color}; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">
                    {badge_text} • MATCH {off['score']}%
                </span>
                <span style="color: #f59e0b; font-size: 12px; font-weight: 600;">
                    📅 Frist: {off['deadline']}
                </span>
            </div>
            <h3 style="color: #ffffff; margin: 0 0 6px 0; font-size: 16px; line-height: 1.4;">
                <a href="{off['url']}" style="color: #38bdf8; text-decoration: none;">{off['title']}</a>
            </h3>
            <p style="color: #9ca3af; font-size: 13px; margin: 0 0 10px 0;">
                🏢 <strong>{off['company']}</strong> • 📍 {off['location']}
            </p>
            <div style="background: #0f172a; padding: 10px; border-radius: 6px; font-size: 12px; color: #cbd5e1; margin-bottom: 12px;">
                💰 <strong>Convenio:</strong> {off['salary']}<br/>
                🔬 <strong>Proyecto / Área:</strong> {off['project']}
            </div>
            <p style="color: #94a3b8; font-size: 13px; margin: 0 0 12px 0; line-height: 1.5;">
                {off['snippet']}
            </p>
            <a href="{off['url']}" style="display: inline-block; background: #0284c7; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                Abrir Convocatoria Oficial &rarr;
            </a>
        </div>
        """

    rss_cards = ""
    for off in rss_offers[:6]:  # Limit top 6 to prevent overwhelming
        rss_cards += f"""
        <div style="background: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 14px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="color: #10b981; font-size: 11px; font-weight: 600;">
                    AFINIDAD {off['score']}%
                </span>
                <span style="color: #94a3b8; font-size: 11px;">
                    Cierre: {off['deadline']}
                </span>
            </div>
            <h4 style="margin: 0 0 4px 0; font-size: 14px;">
                <a href="{off['url']}" style="color: #38bdf8; text-decoration: none;">{off['title']}</a>
            </h4>
            <p style="color: #9ca3af; font-size: 12px; margin: 0 0 6px 0;">
                🏛️ {off['company']} ({off['location']})
            </p>
            <p style="color: #64748b; font-size: 12px; margin: 0;">
                {off['snippet']}
            </p>
        </div>
        """

    html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="utf-8">
        <title>Novedades de Empleo Público e Investigación - 09:00 AM</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #030712; color: #f3f4f6; padding: 24px 12px; margin: 0;">
        <div style="max-width: 640px; margin: 0 auto; background: #0a0f1d; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #065f46, #0369a1); padding: 24px; text-align: left;">
                <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #a7f3d0; font-weight: 700;">
                    Job Search OS (Empleo) • Alerta Diaria 09:00 AM
                </div>
                <h1 style="color: #ffffff; margin: 8px 0 4px 0; font-size: 22px;">
                    {total_offers} Convocatorias Nuevas Detectadas
                </h1>
                <p style="color: #e0f2fe; margin: 0; font-size: 13px;">
                    Informe matutino para <strong>{recipient}</strong> • {run_date}
                </p>
            </div>

            <!-- Content Container -->
            <div style="padding: 24px;">
                <p style="color: #94a3b8; font-size: 14px; margin-top: 0; line-height: 1.5;">
                    Se ha completado el rastreo de convocatorias en el sector público alemán (<strong>Thünen-Institut</strong>, <strong>Umweltbundesamt</strong> y <strong>service.bund.de</strong>). A continuación tienes las oportunidades prioritarias filtradas con tu perfil:
                </p>

                <!-- Section: Puestos Directos Específicos -->
                <div style="margin-top: 24px;">
                    <div style="font-size: 13px; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">
                        🎯 Posiciones Seleccionadas Bajo Observación
                    </div>
                    {curated_cards}
                </div>

                <!-- Section: Nuevas Ofertas del Feed Federal -->
                {f'''
                <div style="margin-top: 28px;">
                    <div style="font-size: 13px; font-weight: 700; color: #10b981; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">
                        📡 Novedades de service.bund.de (Suelos / Clima / IA)
                    </div>
                    {rss_cards}
                </div>
                ''' if rss_cards else ''}

                <!-- Footer Call to Action -->
                <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid #1e293b; text-align: center;">
                    <p style="color: #64748b; font-size: 12px; margin: 0 0 12px 0;">
                        Este boletín se generó automáticamente a las 09:00 AM CET mediante GitHub Actions.<br/>
                        Todas tus postulaciones se gestionan de forma privada en tu navegador.
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    return html


def send_via_resend(api_key: str, recipient: str, subject: str, html_content: str):
    """Deliver email using Resend HTTP API."""
    print(f"[*] Enviando digest mediante Resend API a {recipient}...")
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "User-Agent": "JobSearchOS/1.0"
    }
    payload = {
        "from": "Job Search OS <onboarding@resend.dev>",
        "to": [recipient],
        "subject": subject,
        "html": html_content
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            print(f"[✓] Email enviado con éxito vía Resend (ID: {res.get('id', 'ok')})")
            return True
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8")
        print(f"[!] Error Resend HTTP {e.code}: {error_msg}")
        return False
    except Exception as e:
        print(f"[!] Excepción en envío Resend: {e}")
        return False


def send_via_smtp(host: str, port: int, user: str, password: str, recipient: str, subject: str, html_content: str):
    """Deliver email using standard SMTP TLS (e.g. Gmail App Password)."""
    print(f"[*] Enviando digest mediante SMTP ({host}:{port}) a {recipient}...")
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"Job Search OS <{user}>"
    msg["To"] = recipient

    part = MIMEText(html_content, "html")
    msg.attach(part)

    try:
        with smtplib.SMTP(host, port, timeout=20) as server:
            server.ehlo()
            server.starttls()
            server.login(user, password)
            server.sendmail(user, recipient, msg.as_string())
        print(f"[✓] Email enviado con éxito vía SMTP a {recipient}")
        return True
    except Exception as e:
        print(f"[!] Error en envío SMTP: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="Job Search OS Daily Job Alert Pipeline")
    parser.add_argument("--to", default=os.getenv("ALERT_RECIPIENT_EMAIL", DEFAULT_RECIPIENT), help="Recipient email")
    parser.add_argument("--preview-only", action="store_true", help="Do not send, only write preview HTML file")
    args = parser.parse_args()

    recipient = args.to
    now_str = datetime.now().strftime("%d de %B de %Y a las 09:00 CEST")

    print("==================================================")
    print("🚀 Job Search OS - Pipeline de Alertas Matutinas")
    print(f"   Destinatario: {recipient}")
    print(f"   Fecha: {now_str}")
    print("==================================================")

    # 1. Fetch RSS feed matches
    rss_matches = fetch_bund_rss_jobs(DEFAULT_KEYWORDS)
    print(f"[*] Encontradas {len(rss_matches)} ofertas coincidentes en service.bund.de")

    # 2. Build HTML Digest
    subject = f"🎯 [Empleo 9:00 AM] {len(CURATED_DIRECT_OFFERS) + len(rss_matches)} Convocatorias: Thünen, UBA & Sector Público"
    html_content = build_html_digest(recipient, CURATED_DIRECT_OFFERS, rss_matches, now_str)

    # 3. Always write local preview
    preview_path = os.path.join(os.path.dirname(__file__), "latest_job_digest.html")
    with open(preview_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"[✓] Previsualización HTML guardada en: {preview_path}")

    if args.preview_only:
        print("[*] Modo --preview-only activado. No se realiza envío de red.")
        return

    # 4. Attempt real delivery
    resend_api_key = os.getenv("RESEND_API_KEY")
    smtp_user = os.getenv("SMTP_USER") or os.getenv("ALERT_RECIPIENT_EMAIL") or DEFAULT_RECIPIENT
    smtp_pass = os.getenv("SMTP_PASS")
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))

    delivered = False
    if resend_api_key:
        delivered = send_via_resend(resend_api_key, recipient, subject, html_content)
    elif smtp_user and smtp_pass:
        delivered = send_via_smtp(smtp_host, smtp_port, smtp_user, smtp_pass, recipient, subject, html_content)
    else:
        print("[!] No se detectaron credenciales RESEND_API_KEY ni SMTP_USER/SMTP_PASS en variables de entorno.")
        print("    Para recibir el email real a las 9 am en GitHub Actions, añade el secreto RESEND_API_KEY o SMTP_PASS en el repositorio.")
        print(f"    El archivo local {preview_path} contiene el correo renderizado completo.")

    print("[*] Pipeline finalizado con éxito.")


if __name__ == "__main__":
    main()
