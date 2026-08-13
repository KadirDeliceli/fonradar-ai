
import os
from datetime import datetime, timedelta



def onbellek_taze_mi() -> bool:
    """CACHE_FILE var mi ve CACHE_TTL_HOURS icinde mi?"""
    if not os.path.exists("C:\\vibecoding\\kuzka-FonRadarAI\\tubitak_Scraper\\fonlar.json"):
        return False
    dosya_zamani = datetime.fromtimestamp(os.path.getmtime("C:\\vibecoding\\kuzka-FonRadarAI\\tubitak_Scraper\\fonlar.json"))
    gecen = datetime.now() - dosya_zamani

    print(gecen)

    return gecen < timedelta(hours=1)

onbellek_taze_mi()