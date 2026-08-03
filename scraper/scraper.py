"""
FonRadar AI - TUBITAK Fon Kazima Modulu
========================================
Tek dosya, ayri ayri fonksiyonlar (senin istedigin yapida):

  1) get_fund_links(list_url)  -> Liste sayfasindan fon (ilan) detay linklerini toplar.
  2) extract_pdf_text(pdf_url) -> Bir PDF linkini indirip icindeki metni cikarir.
  3) scrape_detail(url)        -> Detay sayfasina girer; metni + ek PDF'leri okur,
                                  hepsini tek "full_text" alaninda birlestirir.
  4) main()                    -> Hepsini sirayla calistirip JSON'a yazar.

Kullanilan (hepsi ucretsiz/acik kaynak): requests, beautifulsoup4, pdfplumber
Kurulum:  pip install requests beautifulsoup4 pdfplumber

NOT (robots.txt): Onceki analize gore /tr/destekler yollari serbest, Crawl-delay yok.
Yine de sunucuyu yormamak icin istekler arasi POLITE_DELAY saniye bekliyoruz.
"""

import io
import json
import re
import time
import urllib.robotparser
from urllib.parse import urljoin, urlparse

import pdfplumber
import requests
from bs4 import BeautifulSoup

BASE = "https://tubitak.gov.tr"
LIST_URL = "https://tubitak.gov.tr/tr/destekler/sanayi/ulusal-destek-programlari"
POLITE_DELAY = 3           # istekler arasi bekleme (saniye)
TIMEOUT = 30               # istek zaman asimi
HEADERS = {
    # Kim oldugumuzu durustce belirtmek iyi bir kazima adabidir.
    "User-Agent": "FonRadar-AI-StajProjesi/1.0 (egitim amacli; iletisim: ekip@ornek.com)"
}

session = requests.Session()
session.headers.update(HEADERS)


_robot_parser = None

def robots_izin_var_mi(url: str) -> bool:
    """robots.txt'e gore bu URL cekilebilir mi? (User-agent: *)"""
    global _robot_parser
    if _robot_parser is None:
        _robot_parser = urllib.robotparser.RobotFileParser()
        _robot_parser.set_url(urljoin(BASE, "/robots.txt"))
        try:
            _robot_parser.read()
        except Exception:
            return True  # robots okunamazsa engelleme yapma
    return _robot_parser.can_fetch("*", url)


def nazik_get(url: str) -> requests.Response | None:
    """Bekleme + hata yonetimi ile GET. robots yasakliysa atlar."""
    if not robots_izin_var_mi(url):
        print(f"[ROBOTS] Yasak, atlaniyor: {url}")
        return None
    time.sleep(POLITE_DELAY)
    try:
        r = session.get(url, timeout=TIMEOUT)
        r.raise_for_status()
        return r
    except requests.RequestException as e:
        print(f"[HATA] Alinamadi: {url} -> {e}")
        return None


def get_fund_links(list_url: str = LIST_URL) -> list[str]:
    """
    Liste sayfasindaki fon/ilan detay sayfalarinin linklerini dondurur.

    Filtre mantigi: '/ulusal-destek-programlari/' iceren, ana klasorun kendisi
    olmayan (yani altinda bir slug bulunan) linkleri aliyoruz. Site yapisi
    degisirse asagidaki 'desen' satirini gozden gecir.
    """
    resp = nazik_get(list_url)
    if resp is None:
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    links = set()
    desen = re.compile(r"/destekler/.+/ulusal-destek-programlari/.+")

    for a in soup.find_all("a", href=True):
        href = a["href"]
        tam = urljoin(BASE, href)
        # Ayni domain + desene uyan + PDF olmayan linkler
        if urlparse(tam).netloc.endswith("tubitak.gov.tr") and desen.search(tam):
            if not tam.lower().endswith(".pdf"):
                links.add(tam.split("#")[0])  # kalanti # kismini temizle

    print(f"[LINK] {len(links)} adet fon linki bulundu.")
    return sorted(links)


def extract_pdf_text(pdf_url: str) -> str:
    """
    PDF'i indirir ve metnini cikarir. Taranmis (goruntu) PDF ise pdfplumber
    bos dondurur -> OCR kapsam disi oldugu icin bos gecilir.
    """
    resp = nazik_get(pdf_url)
    if resp is None:
        return ""

    parcalar = []
    try:
        with pdfplumber.open(io.BytesIO(resp.content)) as pdf:
            for sayfa in pdf.pages:
                metin = sayfa.extract_text() or ""
                if metin.strip():
                    parcalar.append(metin)
    except Exception as e:
        print(f"[PDF HATA] Okunamadi: {pdf_url} -> {e}")
        return ""

    tam = "\n".join(parcalar).strip()
    if not tam:
        print(f"[PDF] Metin cikmadi (muhtemelen taranmis/goruntu): {pdf_url}")
    return tam


def scrape_detail(url: str) -> dict:
    """
    Detay sayfasindan basligi, sayfa metnini ve ekli PDF'lerin metnini toplar,
    hepsini birlestirip tek bir sozluk (record) olarak dondurur.
    Bu 'full_text' alani ileride embedding/vektorizasyon icin kullanilacak.
    """
    resp = nazik_get(url)
    if resp is None:
        return {}

    soup = BeautifulSoup(resp.text, "html.parser")

    # --- Baslik ---
    h1 = soup.find("h1")
    baslik = h1.get_text(strip=True) if h1 else ""

    # --- Ana metin --- (Drupal: ana icerik <main> / article icinde)
    ana = soup.find("main") or soup.find("article") or soup.body
    # Menu/footer gurultusunu azaltmak icin nav/header/footer/script'leri at
    for etiket in ana.find_all(["nav", "header", "footer", "script", "style"]):
        etiket.decompose()
    sayfa_metni = ana.get_text(separator="\n", strip=True) if ana else ""

    # --- Ekli PDF linkleri --- (href'i .pdf ile biten tum linkler)
    pdf_linkleri = []
    for a in soup.find_all("a", href=True):
        tam = urljoin(BASE, a["href"])
        if tam.lower().endswith(".pdf") and tam not in pdf_linkleri:
            pdf_linkleri.append(tam)

    # --- PDF metinlerini cek ve birlestir ---
    pdf_metinleri = []
    for pdf_url in pdf_linkleri:
        print(f"    -> PDF isleniyor: {pdf_url}")
        metin = extract_pdf_text(pdf_url)
        if metin:
            pdf_metinleri.append(f"\n\n[PDF: {pdf_url}]\n{metin}")

    full_text = sayfa_metni + "".join(pdf_metinleri)

    return {
        "url": url,
        "baslik": baslik,
        "sayfa_metni": sayfa_metni,
        "pdf_linkleri": pdf_linkleri,
        "full_text": full_text,   # <-- embedding icin kullanilacak alan
    }


def main():
    kayitlar = []
    linkler = get_fund_links(LIST_URL)

    for i, link in enumerate(linkler, 1):
        print(f"[{i}/{len(linkler)}] {link}")
        kayit = scrape_detail(link)
        if kayit:
            kayitlar.append(kayit)

    with open("fonlar.json", "w", encoding="utf-8") as f:
        json.dump(kayitlar, f, ensure_ascii=False, indent=2)

    print(f"\nBitti. {len(kayitlar)} kayit 'fonlar.json' dosyasina yazildi.")


if __name__ == "__main__":
    main()