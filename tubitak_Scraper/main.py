"""
FonRadar AI - API katmani
tubitak_scraper/scraper.py icindeki fonlari_getir()'i FastAPI'ye baglar.
Scraper'in mantigina DOKUNMAZ; sadece cagirir.
"""
import threading

from fastapi import BackgroundTasks, FastAPI

from .scraper import _cache_oku, fonlari_getir, onbellek_taze_mi

app = FastAPI(title="FonRadar AI Backend")

# Ayni anda birden fazla arka plan kazimasi baslamasin diye bayrak + kilit.
# Scraper'in kendi kilidi asil kazimayi zaten koruyor; bu ise "bosuna ikinci arka plan gorevi ekleme" durumunu engeller.
is_scraping_active = False
_durum_kilidi = threading.Lock()


def _kazima_baslat_gerekli_mi() -> bool:
    """
    Atomik kontrol: kazima calismiyorsa bayragi kaldirir ve True doner
    (yani 'sen baslat'); zaten calisiyorsa False doner ('baslatma').
    Kilit sayesinde iki istek ayni anda gelse de yalnizca biri True alir.
    """
    global is_scraping_active
    with _durum_kilidi:
        if is_scraping_active:
            return False
        is_scraping_active = True
        return True


def _arka_plan_kazima_gorevi(force_refresh: bool):
    """Arka planda kazimayi calistirir, bittiginde bayragi indirir."""
    global is_scraping_active
    try:
        fonlari_getir(force_refresh=force_refresh)
    finally:
        with _durum_kilidi:
            is_scraping_active = False


@app.get("/")
def home():
    return {"status": "online", "message": "FonRadar AI calisiyor"}


@app.get("/fetch-grants")
def fetch_grants(background_tasks: BackgroundTasks, force_refresh: bool = False):
    """
    Fonlari dondurur; kullaniciyi BEKLETMEZ.
      - Cache taze ve force_refresh yoksa: guncel veriyi aninda dondurur.
      - Cache eski veya force_refresh=true ise: kazimayi ARKA PLANA atar ve
        eldeki (varsa eski) veriyi 'guncelleniyor' durumuyla hemen dondurur.
        Yeni veri hazir olunca bir sonraki istekte gelir.
    """
    # Cache taze + zorla yenileme yok -> aninda guncel veri
    if onbellek_taze_mi() and not force_refresh:
        kayitlar = _cache_oku()
        return {
            "status": "success",
            "guncelleniyor": False,
            "adet": len(kayitlar),
            "fonlar": kayitlar,
        }

    # Cache eski VEYA force_refresh -> kazimayi arka plana at (zaten yoksa)
    kazima_baslatildi = _kazima_baslat_gerekli_mi()
    if kazima_baslatildi:
        background_tasks.add_task(_arka_plan_kazima_gorevi, force_refresh)

    # Beklemeden, elde ne varsa onu + net durum mesajini dondur
    mevcut = _cache_oku() if onbellek_taze_mi() else []
    if mevcut:
        mesaj = ("Yeni veriler arka planda cekiliyor. Su an mevcut veri gosteriliyor; "
                 "birkac dakika sonra tekrar isteyin, guncellenmis olacak.")
    else:
        mesaj = ("Henuz veri yok, ilk kazima arka planda basladi. "
                 "Lutfen ~1-2 dakika sonra tekrar deneyin.")

    return {
        "status": "updating",
        "guncelleniyor": True,
        "kazima_baslatildi": kazima_baslatildi,  # False ise zaten suren bir kazima vardi
        "mesaj": mesaj,
        "adet": len(mevcut),
        "fonlar": mevcut,
    }