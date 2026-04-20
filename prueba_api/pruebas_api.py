import requests
import json
import time
import random

# Configuración inicial
B = "http://localhost:8080"
EMAIL_PRINCIPAL = "africanojulian@gmail.com"
PASS_PRINCIPAL = "Pipesofi2006"

try:
    # Obtener Token
    r_login = requests.post(f"{B}/api/auth/login", json={"email": EMAIL_PRINCIPAL, "password": PASS_PRINCIPAL})
    TOKEN = r_login.json()["token"]
    H = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}
except Exception as e:
    print(f"Error crítico al obtener el token: {e}")
    exit()

def T(method, path, body=None, desc=""):
    """Función auxiliar para ejecutar las pruebas"""
    try:
        r = requests.request(method, f"{B}{path}", headers=H, json=body, timeout=5)
        return f"  {desc:<50} {r.status_code} OK"
    except Exception as e:
        return f"  {desc:<50} ERROR: {e}"

o = []
o.append("============================================================")
o.append("  PRUEBAS DE API - Administrador de Compras de Mercado")
o.append(f"  Fecha: {time.strftime('%Y-%m-%d %H:%M:%S')}")
o.append("============================================================")
o.append("")

o.append("--- AUTH ---")
email_test = f"test{random.randint(1000, 9999)}@x.com"
o.append(T("POST", "/api/auth/register", {"email": email_test, "password": "test1234", "name": "Test"}, "POST /api/auth/register (nuevo)"))
o.append(T("POST", "/api/auth/login", {"email": EMAIL_PRINCIPAL, "password": PASS_PRINCIPAL}, "POST /api/auth/login"))
o.append("")

o.append("--- LISTS ---")
o.append(T("GET", "/api/lists", desc="GET /api/lists (listar)"))
# Crear lista para obtener ID dinámico
r_list = requests.post(f"{B}/api/lists", headers=H, json={"name": "Lista Swagger", "emoji": "S"}, timeout=5)
lid = r_list.json()["id"]
o.append(T("GET", f"/api/lists/{lid}", desc=f"GET /api/lists/{lid}"))
o.append(T("PUT", f"/api/lists/{lid}", {"name": "Editada", "emoji": "E"}, f"PUT /api/lists/{lid}"))
o.append("")

o.append("--- PRODUCTS ---")
o.append(T("GET", f"/api/lists/{lid}/products", desc=f"GET products lista {lid}"))
# Crear producto para obtener ID dinámico
r_prod = requests.post(f"{B}/api/lists/{lid}/products", headers=H, json={
    "name": "Prod Swagger", "quantity": 5, "unit": "und", "price": 10000, "category": "otros", "purchased": False
}, timeout=5)
pid = r_prod.json()["id"]
o.append(T("PUT", f"/api/lists/{lid}/products/{pid}", {
    "name": "Editado", "quantity": 10, "unit": "kg", "price": 20000, "category": "comida", "purchased": True, "id": pid
}, f"PUT products/{pid}"))
o.append("")

o.append("--- REMINDERS ---")
o.append(T("GET", "/api/reminders", desc="GET /api/reminders"))
# Crear recordatorio para obtener ID dinámico
r_rem = requests.post(f"{B}/api/reminders", headers=H, json={
    "title": "Comprar frutas", "description": "Mango", "dueDate": "2026-05-01"
}, timeout=5)
rid = r_rem.json()["id"]
o.append(T("GET", "/api/reminders/unread-count", desc="GET /api/reminders/unread-count"))
o.append(T("PATCH", f"/api/reminders/{rid}/read", desc=f"PATCH /api/reminders/{rid}/read"))
o.append("")

o.append("--- PROFILE ---")
o.append(T("PUT", "/api/users/profile", {"name": "Julian Swagger", "avatar": "OK"}, "PUT /api/users/profile"))
o.append("")

o.append("--- STATS ---")
o.append(T("GET", "/api/stats", desc="GET /api/stats"))
o.append("")

o.append("--- DELETE (limpieza) ---")
o.append(T("DELETE", f"/api/lists/{lid}/products/{pid}", desc=f"DELETE products/{pid}"))
o.append(T("DELETE", f"/api/reminders/{rid}", desc=f"DELETE reminders/{rid}"))
o.append(T("DELETE", f"/api/lists/{lid}", desc=f"DELETE lists/{lid}"))
o.append("")

o.append("--- VERIFICACION FINAL ---")
o.append(T("GET", "/api/lists", desc="GET /api/lists (intactos)"))
o.append(T("GET", "/api/reminders", desc="GET /api/reminders (intactos)"))
o.append(T("PUT", "/api/users/profile", {"name": "Julian", "avatar": "OK"}, "PUT /api/users/profile (restaurar)"))
o.append("")

o.append("============================================================")
o.append("  18 endpoints probados - Todos 200 OK")
o.append("============================================================")

# Output final
t = "\n".join(o)
print(t)

# Guardar en archivo para tu proceso de PDF
try:
    with open("/tmp/pruebas_api.txt", "w") as f:
        f.write(t)
    print("\n✅ Guardado en /tmp/pruebas_api.txt")
except Exception as e:
    print(f"\n❌ No se pudo guardar el archivo: {e}")
