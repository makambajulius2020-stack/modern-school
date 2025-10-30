import traceback
import sys

LOG_FILE = "debug_error.txt"

def log(msg: str):
    print(msg)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(msg + "\n")
    except Exception:
        pass

def log_exc(title: str):
    log(title)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            traceback.print_exc(file=f)
    except Exception:
        traceback.print_exc()

log("[debug] starting debug_import")
try:
    log("[debug] importing app.create_app ...")
    from app import create_app
    log("[debug] calling create_app() ...")
    app = create_app()
    log("[debug] create_app() OK")
except Exception:
    log_exc("[error] Exception during create_app():")
    sys.exit(1)

try:
    log("[debug] importing app.models ...")
    import app.models as models
    log(f"[debug] models imported OK: {dir(models)[:10]} ...")
except Exception:
    log_exc("[error] Exception during importing app.models:")
    sys.exit(1)

log("[debug] All imports OK")
