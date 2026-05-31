# MercaList - Administrador de Compras de Mercado

MercaList es una aplicación full-stack diseñada para gestionar listas de compras de mercado de forma eficiente. Permite a los usuarios crear múltiples listas, añadir productos por categorías, llevar un seguimiento de los gastos y visualizar estadísticas detalladas de consumo mensual y por categorías.

## 🚀 Tecnologías

### Frontend
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (Animaciones)
- **Recharts** (Estadísticas y Gráficos)
- **Lucide React** (Iconografía)

### Backend
- **Java 21** (LTS)
- **Spring Boot 3.5.0**
- **Spring Security** (Autenticación JWT)
- **Spring Data JPA** (Hibernate)
- **MySQL** (Base de datos por defecto en desarrollo)
- **H2 Database** (Respaldo en memoria)
- **Maven** (Gestión de dependencias)

---

## 🛠️ Instalación y Configuración

### Requisitos Previos
- **Docker Desktop** corriendo (reemplaza la necesidad de MySQL local)
- **Node.js** (v18 o superior)
- **Java JDK 21**
- **Maven**

### 1. Configuración del Backend (Spring Boot)

El backend maneja la autenticación, persistencia de datos (MariaDB) y lógica de negocio.

**Base de datos con Docker (recomendado):**

```bash
docker compose -f docker-compose.dev.yml up -d
```

Esto levanta MariaDB en el puerto 3307 y crea automáticamente `mercalist_db` y `mercalist_test_db`.

**Configuración de Variables de Entorno (Recomendado):** Para evitar subir contraseñas al código, el proyecto usa variables de entorno en el perfil `dev`. Configura las siguientes variables en tu sistema o IDE para que coincidan con tu MySQL local:

- `DB_NAME`: Nombre de tu base de datos (por defecto: `mercalist_db`).
- `DB_USER`: Tu usuario de MySQL (por defecto: `root`).
- `DB_PASS`: Tu contraseña de MySQL (por defecto: vacía).

> Si prefieres usar H2 (en memoria), cambia `spring.profiles.active=dev` a `default` en `backend/src/main/resources/application.properties`.

**Ejecución:**

1. Navega al directorio del backend:
   ```bash
   cd backend
   ```
2. Ejecuta el proyecto:
   ```bash
   mvn spring-boot:run
   ```
3. El servidor iniciará en: `http://localhost:8080`

---

### 2. Configuración del Frontend (Next.js)

El frontend proporciona una interfaz moderna y fluida con animaciones premium.

1. Navega al directorio del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre tu navegador en: `http://localhost:3000`

---

## 🧪 Cómo Probar la Aplicación

1. **Registro**: En la pantalla inicial, haz clic en "Registrarse" y crea una cuenta nueva.
2. **Login**: Inicia sesión con tus nuevas credenciales. El sistema te otorgará un token JWT que se guardará en tu navegador.
3. **Crear Lista**: Haz clic en el botón "+" para crear tu primera lista de mercado (ej: "Mercado del Mes").
4. **Gestionar Productos**: Entra a una lista y añade productos detallando su precio, cantidad y categoría.
5. **Marcar Compras**: Haz clic en los productos para marcarlos como comprados.
6. **Ver Estadísticas**: Regresa al dashboard y entra en la sección de estadísticas para ver los gráficos reales.

---

## 📂 Estructura del Proyecto

```text
├── backend/                     # API REST con Spring Boot
│   ├── src/main/java/com/market/admin/
│   │   ├── config/              # Configuración de Seguridad y CORS
│   │   ├── controller/          # Endpoints de la API
│   │   ├── dto/                 # Objetos de transferencia de datos
│   │   ├── model/               # Entidades JPA (User, List, Product)
│   │   ├── repository/          # Interfaces de acceso a DB
│   │   └── service/             # Lógica de negocio
│   └── src/test/                # Pruebas unitarias e integración
├── frontend/                    # Cliente web con Next.js
│   ├── components/              # Componentes de UI
│   ├── lib/                     # Contexto y lógica de API
│   └── app/                     # Páginas y layout principal
├── testing/                     # Todo lo relacionado con pruebas
│   ├── evidencias/
│   │   ├── docker/              # Capturas Docker Hub
│   │   ├── jenkins/             # Capturas Jenkins
│   │   ├── jmeter/              # Capturas JMeter
│   │   └── newman/              # Capturas + resultados Newman
│   ├── rendimiento/
│   │   └── planes/              # JMX: 10, 50 y 100 usuarios
│   └── sistema/
│       ├── coleccion/           # Colección Postman/Newman (JSON)
│       └── reporte/             # Reporte HTML + JSON de resultados
├── jenkins-jobs/                # XMLs exportados de los 3 jobs Jenkins
├── Jenkinsfile                  # Pipeline CI/CD
└── docker-compose.dev.yml       # BD MariaDB para desarrollo
```

---

## 🔒 Seguridad y Autenticación (JWT)

Esta aplicación implementa un sistema de seguridad robusto basado en **JSON Web Tokens (JWT)**:

- **Flujo de Autenticación**: Al iniciar sesión, el servidor valida las credenciales contra la base de datos y devuelve un token firmado con una clave secreta.
- **Persistencia del Token**: El frontend almacena este token y lo adjunta automáticamente en el encabezado `Authorization` de cada petición al backend.
- **Protección de Endpoints**: Todos los recursos (Listas, Productos, Estadísticas, Recordatorios) están protegidos por el filtro `JwtRequestFilter`. Solo el usuario dueño de la información puede acceder a ella.
- **Cabecera requerida** en cada petición: `Authorization: Bearer <tu_token_jwt>`
- **Cifrado de contraseñas**: Se utiliza **BCrypt** para cifrar las contraseñas antes de guardarlas. Nunca se almacena la contraseña en texto plano.

---

## 🌐 Links (con todo corriendo)

| Servicio | URL | Descripción |
|----------|-----|-------------|
| App (Swagger UI) | `http://localhost:8080/swagger-ui/index.html` | Todos los endpoints de la API |
| App (API Docs) | `http://localhost:8080/v3/api-docs` | Especificación OpenAPI |
| Jenkins | `http://localhost:8083` | Dashboard CI/CD — `admin` / `admin` |
| Jenkins Freestyle | `http://localhost:8083/job/Freestyle-CRUD/` | Job de despliegue básico |
| Jenkins Pipeline | `http://localhost:8083/job/MercaList-Deploy/` | Pipeline completo con tests + Docker |
| Docker Hub | `https://hub.docker.com/r/p1p2gamer26/market-admin` | Imagen publicada |

---

## 🐳 Docker

### Construir y correr la imagen localmente

```bash
# Construir la imagen
docker build -t market-admin:latest ./backend

# Correr el contenedor (requiere MariaDB corriendo en el host)
docker run -d --name market-admin --network host \
  -e SPRING_PROFILES_ACTIVE=dev \
  -e DB_HOST=127.0.0.1 \
  -e DB_PORT=3307 \
  -e DB_NAME=mercalist_db \
  -e DB_USER=root \
  -e DB_PASS=Pipesofi2006 \
  market-admin:latest
```

La app queda disponible en `http://localhost:8080`.

### Imagen en Docker Hub

```bash
docker pull p1p2gamer26/market-admin:latest
```

### ¿Por qué el Dockerfile tiene dos etapas?

```dockerfile
FROM maven:3.9 AS build     # etapa 1: compila con Maven → genera el JAR
FROM eclipse-temurin:17-jre # etapa 2: solo JRE + el JAR (~157MB en vez de ~800MB)
```

La imagen final no incluye Maven ni el código fuente — solo lo necesario para correr.

---

## ⚙️ CI/CD con Jenkins

### Jobs configurados

| Job | Tipo | Descripción |
|-----|------|-------------|
| `Freestyle-CRUD` | Freestyle | Clona el repo, corre `mvn clean package` y despliega el JAR |
| `Despliegue-CRUD` | Pipeline | Pipeline inline con build + tests + Docker |
| `MercaList-Deploy` | Pipeline | Pipeline desde el `Jenkinsfile` del repo |

### ¿Cómo funciona el Jenkinsfile?

```
pipeline {
  agent any               ← corre en cualquier servidor Jenkins disponible
  stages {
    stage('Build')        ← mvn clean package (con tests)
    stage('Run Tests')    ← mvn test — 86 tests unitarios + integración
    stage('Docker Build') ← docker build -t market-admin:latest
    stage('Docker Run')   ← docker run con la app
  }
  post {
    success { ... }       ← mensaje si todo salió bien
    failure { ... }       ← limpia contenedores si algo falló
    always  { ... }       ← siempre destruye la BD de test temporal
  }
}
```

**¿Por qué Pipeline y no solo Freestyle?**
El Jenkinsfile está versionado en el repo. Si se reinstala Jenkins, el pipeline se recupera con un `git pull`. El Freestyle se configura a clicks y se pierde si se borra el servidor.

**¿Por qué se levanta MariaDB en Docker dentro del pipeline?**
Los tests de integración necesitan BD real. El pipeline levanta su propio contenedor de MariaDB, corre los tests y lo destruye — funciona igual en cualquier máquina.

**¿Qué pasa si un test falla?**
El pipeline se detiene en `Run Tests` y no construye ni despliega la imagen Docker.

### Correr el pipeline

1. Abre `http://localhost:8083`
2. Click en **MercaList-Deploy** → **Construir ahora**
3. El pipeline ejecuta: Build → Run Tests → Docker Build → Docker Run

### Levantar Jenkins (primera vez)

```bash
docker run -d --name jenkins \
  -p 8083:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts
# Abrir http://localhost:8083 | usuario: admin / admin
```

### Importar los jobs en una máquina nueva

Los XMLs de configuración están en `jenkins-jobs/`. Con Jenkins corriendo:

```bash
CREDS="admin:admin"
URL="http://localhost:8083"

curl -X POST "$URL/createItem?name=Freestyle-CRUD" \
  --user "$CREDS" -H "Content-Type: application/xml" \
  -d @jenkins-jobs/Freestyle-CRUD.xml

curl -X POST "$URL/createItem?name=MercaList-Deploy" \
  --user "$CREDS" -H "Content-Type: application/xml" \
  -d @jenkins-jobs/MercaList-Deploy.xml

curl -X POST "$URL/createItem?name=Despliegue-CRUD" \
  --user "$CREDS" -H "Content-Type: application/xml" \
  -d @jenkins-jobs/Despliegue-CRUD.xml
```

---

## 🚀 Arranque desde cero (máquina nueva)

> **Prerequisitos:** Docker Desktop corriendo, JDK 21, Maven, Node.js 18+.

### Linux / macOS

```bash
# 1. Clonar y entrar al repo
git clone https://github.com/caroandres356-eng/Administrador-de-Compras-de-Mercado.git
cd Administrador-de-Compras-de-Mercado
git checkout feature_julian

# 2. Levantar BD (crea mercalist_db Y mercalist_test_db automáticamente)
docker compose -f docker-compose.dev.yml up -d

# 3. Correr tests
cd backend
DB_PORT=3307 SPRING_PROFILES_ACTIVE=dev mvn test
# Resultado esperado: Tests run: 86, Failures: 0, Errors: 0

# 4. Empaquetar y correr el backend
mvn clean package -DskipTests
DB_PORT=3307 SPRING_PROFILES_ACTIVE=dev java -jar target/admin-0.0.1-SNAPSHOT.jar
# http://localhost:8080/swagger-ui/index.html

# 5. Construir imagen Docker
cd ..
docker build -t market-admin:latest ./backend
docker run -d --name market-admin --network host \
  -e SPRING_PROFILES_ACTIVE=dev -e DB_PORT=3307 \
  -e DB_NAME=mercalist_db -e DB_USER=root -e DB_PASS=Pipesofi2006 \
  market-admin:latest

# 6. Levantar Jenkins
docker run -d --name jenkins \
  -p 8083:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
# http://localhost:8083 | contraseña inicial: docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Windows (PowerShell / CMD)

```powershell
# 1. Clonar y entrar al repo
git clone https://github.com/caroandres356-eng/Administrador-de-Compras-de-Mercado.git
cd Administrador-de-Compras-de-Mercado
git checkout feature_julian

# 2. Levantar BD (crea mercalist_db Y mercalist_test_db automáticamente)
docker compose -f docker-compose.dev.yml up -d
docker ps   # esperar hasta que aparezca (healthy)

# 3. Correr tests (CMD)
cd backend
set DB_PORT=3307
set SPRING_PROFILES_ACTIVE=dev
mvn test
# Resultado esperado: Tests run: 86, Failures: 0, Errors: 0

# 4. Empaquetar y correr el backend (CMD)
mvn clean package -DskipTests
java -jar target/admin-0.0.1-SNAPSHOT.jar
# http://localhost:8080/swagger-ui/index.html

# 5. Construir imagen Docker
cd ..
docker build -t market-admin:latest ./backend
docker run -d --name market-admin --network host ^
  -e SPRING_PROFILES_ACTIVE=dev -e DB_PORT=3307 ^
  -e DB_NAME=mercalist_db -e DB_USER=root -e DB_PASS=Pipesofi2006 ^
  market-admin:latest

# 6. Levantar Jenkins
docker run -d --name jenkins ^
  -p 8083:8080 -p 50000:50000 ^
  -v jenkins_home:/var/jenkins_home ^
  jenkins/jenkins:lts
# http://localhost:8083 | contraseña inicial:
# docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Importar jobs en Jenkins (PowerShell, desde raíz del repo)

```powershell
$b64 = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("admin:TU_CONTRASEÑA"))
$crumbResp = Invoke-RestMethod -Uri "http://localhost:8083/crumbIssuer/api/json" `
  -Headers @{Authorization="Basic $b64"} -SessionVariable sess
$crumb = $crumbResp.crumb

foreach ($job in @("MercaList-Deploy","Freestyle-CRUD","Despliegue-CRUD")) {
  $xml = Get-Content "jenkins-jobs\$job.xml" -Raw
  Invoke-RestMethod -Uri "http://localhost:8083/createItem?name=$job" -Method Post `
    -Headers @{Authorization="Basic $b64"; "Jenkins-Crumb"=$crumb} `
    -Body $xml -ContentType "application/xml" -WebSession $sess
}
```

---

## 🧪 Pruebas

El proyecto cubre 4 tipos de pruebas. Todas requieren el backend corriendo (`mvn spring-boot:run`) salvo las unitarias.

---

### Parte 1 — Pruebas Unitarias (JUnit + Mockito)

Prueban cada servicio de forma aislada usando mocks. No necesitan base de datos ni servidor levantado.

```bash
cd backend
mvn test -Dtest="ShoppingListServiceTest,ProductServiceTest,ReminderServiceTest"
```

| Clase | Tests | Qué cubre |
|-------|-------|-----------|
| `ShoppingListServiceTest` | 12 | CRUD de listas, permisos por usuario |
| `ProductServiceTest` | 13 | CRUD de productos, validaciones |
| `ReminderServiceTest` | 16 | Recordatorios, marcar leído, conteos |

Evidencia: `testing/evidencias/` (resultados incluidos en el pipeline de Jenkins)

---

### Parte 2 — Pruebas de Integración (SpringBootTest + MariaDB)

Prueban la interacción real entre servicios y base de datos. Necesitan MariaDB corriendo.

```bash
# 1. Levantar BD de pruebas
docker compose -f docker-compose.dev.yml up -d

# 2. Correr todas las pruebas de integración
cd backend
DB_PORT=3307 SPRING_PROFILES_ACTIVE=dev mvn test \
  -Dtest="AuthServiceIntegrationTest,UserServiceIntegrationTest,ShoppingListServiceIntegrationTest,ProductServiceIntegrationTest,ReminderServiceIntegrationTest,StatsServiceIntegrationTest"
```

| Clase | Tests | Qué cubre |
|-------|-------|-----------|
| `AuthServiceIntegrationTest` | 5 | Registro, login, token JWT |
| `UserServiceIntegrationTest` | 8 | Perfil, actualización de datos |
| `ShoppingListServiceIntegrationTest` | 11 | Listas en BD real |
| `ProductServiceIntegrationTest` | 7 | Productos, categorías |
| `ReminderServiceIntegrationTest` | 8 | Recordatorios persistidos |
| `StatsServiceIntegrationTest` | 6 | Estadísticas calculadas |

**Resultado esperado:** `Tests run: 86, Failures: 0, Errors: 0`

---

### Parte 3 — Pruebas de Sistema (Newman)

Prueban el CRUD completo contra la API real con assertions HTTP. Requieren backend corriendo en `localhost:8080`.

```bash
# Instalar Newman (una sola vez)
npm install -g newman newman-reporter-htmlextra

# Correr la colección
newman run testing/sistema/coleccion/MercaList-Postman-Completa.json \
  --iteration-count 5 \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export testing/sistema/reporte/stress-test-report-print.html
```

Ver el reporte generado:
```bash
xdg-open testing/sistema/reporte/stress-test-report-print.html
```

**Resultado:** 140 requests · 290 assertions · 0 fallos  
Detalle completo en: `testing/evidencias/newman/resultados-newman.txt`

---

### Parte 4 — Pruebas de Rendimiento (JMeter)

Simulan carga concurrente con 10, 50 y 100 usuarios sobre todos los endpoints. Requieren backend corriendo.

**Desde la GUI (para ver resultados en vivo):**
```bash
jmeter -t testing/rendimiento/planes/MercaList-50usuarios.jmx
```
Luego presionar ▶ y ver los Listeners: Resumen de Resultados, Árbol de Resultados, Gráfica de Tiempos.

**Desde terminal (headless):**
```bash
# 10 usuarios
jmeter -n -t testing/rendimiento/planes/MercaList-10usuarios.jmx \
  -l testing/rendimiento/resultados/resultados-10usuarios.jtl

# 50 usuarios
jmeter -n -t testing/rendimiento/planes/MercaList-50usuarios.jmx \
  -l testing/rendimiento/resultados/resultados-50usuarios.jtl

# 100 usuarios
jmeter -n -t testing/rendimiento/planes/MercaList-100usuarios.jmx \
  -l testing/rendimiento/resultados/resultados-100usuarios.jtl
```

**Comparación de resultados:**

| Métrica | 10 usuarios | 50 usuarios | 100 usuarios |
|---------|-------------|-------------|--------------|
| Total requests | 1,703 | 4,108 | 14,847 |
| Error % | 0.06% | 0.41% | 1.04% |
| Avg tiempo respuesta | ~5ms | ~6ms | ~89ms |
| Max tiempo respuesta | 79ms | 96ms | 1,468ms |
| Throughput | ~150 req/s | ~700 req/s | ~374 req/s |

Evidencias en: `testing/evidencias/jmeter/`

---

### Correr todas las pruebas de una vez

```bash
# BD arriba
docker compose -f docker-compose.dev.yml up -d

# Backend arriba
cd backend && DB_PORT=3307 SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run &

# Unitarias + Integración
mvn test
# Resultado esperado: Tests run: 86, Failures: 0, Errors: 0

# Newman (desde raíz del proyecto)
cd ..
newman run testing/sistema/coleccion/MercaList-Postman-Completa.json --iteration-count 5

# JMeter 50 usuarios
jmeter -n -t testing/rendimiento/planes/MercaList-50usuarios.jmx \
  -l testing/rendimiento/resultados/resultados-50usuarios.jtl
```

---

## 📄 Notas adicionales
- Se utiliza **Lombok** en el backend para reducir código repetitivo (Getters, Setters, Builders se generan automáticamente).

---

## 📚 Documentación Técnica (JavaDoc)

El backend cuenta con documentación técnica detallada (JavaDoc) de todas sus clases, métodos y atributos. Para generarla y consultarla, sigue estos pasos:

1. Abre tu terminal y navega hasta el directorio del backend:
   ```bash
   cd backend
   ```
2. Ejecuta el comando de Maven para generar la documentación:
   ```bash
   mvn javadoc:javadoc
   ```
3. Una vez finalizado el proceso, la documentación HTML estará disponible localmente. Puedes acceder a ella abriendo el siguiente archivo en tu navegador web:
   `backend/target/reports/apidocs/index.html` (o `backend/target/site/apidocs/index.html` dependiendo de la versión del plugin).

---

## 🎓 Guía de presentación — Paso a paso

### Vista general

| Parte | Tecnología | Puerto | Comando |
|-------|-----------|--------|---------|
| Base de datos | MariaDB (Docker) | `3307` | `docker compose -f docker-compose.dev.yml up -d` |
| Backend | Spring Boot (Maven) | `8080` | `mvn spring-boot:run` |
| Frontend | Next.js | `3000` | `npm run dev` |

### Matar todo antes de empezar

```bash
kill $(lsof -t -i :3000) $(lsof -t -i :8080) 2>/dev/null
docker compose -f docker-compose.dev.yml down 2>/dev/null
```

### Orden de arranque (3 terminales)

**Terminal 1 — Base de datos:**
```bash
cd /ruta/del/proyecto
sudo systemctl start docker
docker compose -f docker-compose.dev.yml up -d
# Esperar ~10s a que MariaDB esté healthy
```

El servicio `db-init` crea automáticamente `mercalist_test_db` si no existe (ya no hay que hacerlo manual).

**Terminal 2 — Backend:**
```bash
cd /ruta/del/proyecto/backend
mvn spring-boot:run
```
→ `http://localhost:8080/swagger-ui/index.html`

**Terminal 3 — Frontend:**
```bash
cd /ruta/del/proyecto/frontend
npm run dev
```
→ `http://localhost:3000`

### Correr tests

```bash
cd /ruta/del/proyecto/backend
mvn test
```
Resultado esperado: `Tests run: 86, Failures: 0, Errors: 0`

También se pueden correr solo los unitarios (no necesitan DB):
```bash
mvn test -Dtest="ShoppingListServiceTest,ProductServiceTest,ReminderServiceTest"
```

### Jenkins (CI/CD) — opcional

Ya está corriendo en `http://localhost:8083` — usuario: `admin` / contraseña: `admin`

Ahí se ven los pipelines `MercaList-Deploy`, `Freestyle-CRUD`, etc.

### Demostración de la app

1. Abrir `http://localhost:3000`
2. Hacer clic en **Registrarse** y crear una cuenta
3. Iniciar sesión con el correo y contraseña
4. Crear una lista de compras (botón `+`)
5. Entrar a la lista y agregar productos con precio y categoría
6. Marcar productos como comprados
7. Volver al dashboard y entrar a **Estadísticas** para ver los gráficos
8. (Opcional) Mostrar la API en `http://localhost:8080/swagger-ui/index.html`

### Opción alternativa — 1 sola terminal (todo en background)

```bash
cd /ruta/del/proyecto
sudo systemctl start docker
docker compose -f docker-compose.dev.yml up -d
cd backend && nohup mvn spring-boot:run > backend.log &
cd ../frontend && nohup npm run dev > frontend.log &
tail -f backend.log

---

## 🪟🐧 Linux vs Windows — Comandos lado a lado

| Acción | Linux (bash) | Windows (PowerShell) |
|--------|-------------|---------------------|
| **Prender Docker** | `sudo systemctl start docker` | Abrir Docker Desktop (menú inicio) |
| **Matar frontend** | `kill $(lsof -t -i :3000)` | `Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess` |
| **Matar backend** | `kill $(lsof -t -i :8080)` | `Stop-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess` |
| **Matar todo rápido** | `kill $(lsof -t -i :3000 -i :8080) 2>/dev/null` | `Get-NetTCPConnection -LocalPort 3000,8080 \| Stop-Process -Id \$_.OwningProcess` |
| **Bajar Docker** | `docker compose -f docker-compose.dev.yml down` | `docker compose -f docker-compose.dev.yml down` (igual) |
| **Levantar DB** | `docker compose -f docker-compose.dev.yml up -d` | `docker compose -f docker-compose.dev.yml up -d` (igual) |
| **Backend** | `cd backend && mvn spring-boot:run` | `cd backend; mvn spring-boot:run` |
| **Frontend** | `cd frontend && npm run dev` | `cd frontend; npm run dev` |
| **Tests** | `cd backend && mvn test` | `cd backend; mvn test` |
| **Tests unitarios** | `mvn test -Dtest="ShoppingListServiceTest,..."` | `mvn test -Dtest="ShoppingListServiceTest,..."` (igual) |
| **Variables entorno** | `DB_PORT=3307 mvn test` | `$env:DB_PORT=3307; mvn test` |
| **Ver logs (tail)** | `tail -f backend.log` | `Get-Content backend.log -Wait` |
| **Ruta proyecto** | `/home/user/proyecto` | `C:\Users\user\proyecto` |

---

## 📋 Después de `git clone` — Guía completa paso a paso

### 1. Clonar y entrar al repo
```bash
git clone https://github.com/caroandres356-eng/Administrador-de-Compras-de-Mercado.git
cd Administrador-de-Compras-de-Mercado
```

### 2. Prender Docker y levantar base de datos
```bash
sudo systemctl start docker
docker compose -f docker-compose.dev.yml up -d
# esperar ~10s hasta que MariaDB aparezca como (healthy)
```

El servicio `db-init` crea `mercalist_test_db` automáticamente.

### 3. Correr la app (opcional — para desarrollo)

**Terminal A — Backend:**
```bash
cd backend
mvn spring-boot:run
# → http://localhost:8080/swagger-ui/index.html
```

**Terminal B — Frontend:**
```bash
cd frontend
npm run dev
# → http://localhost:3000
```

### 4. Correr tests
```bash
cd backend
mvn test
```
Resultado esperado: `Tests run: 86, Failures: 0, Errors: 0`

> Si el test falla por conexión a la base de datos, es porque el puerto 3307 no está libre en tu máquina. En ese caso cambia el puerto en `.env` (ej. `DB_PORT=3308`) y usa ese mismo puerto al correr los tests: `DB_PORT=3308 mvn test`.

### 5. Levantar Jenkins (CI/CD)
```bash
docker rm -f jenkins 2>/dev/null
docker run -d --name jenkins \
  -p 8083:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(which docker):/usr/local/bin/docker \
  -u root \
  jenkins/jenkins:lts
```
Monta el socket de Docker + el binario `docker` para que Jenkins ejecute comandos Docker. Corre como root para evitar problemas de permisos.

### 6. Configurar Jenkins (primera vez)
```bash
# Obtener la contraseña inicial
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```
1. Abrir `http://localhost:8083`
2. Pegar la contraseña
3. Instalar **plugins sugeridos**
4. Crear usuario: `admin` / contraseña: `admin`

### 7. Importar los 3 jobs
```bash
for job in MercaList-Deploy Freestyle-CRUD Despliegue-CRUD; do
  curl -X POST "http://localhost:8083/createItem?name=$job" \
    --user "admin:admin" -H "Content-Type: application/xml" \
    -d @jenkins-jobs/$job.xml
done
```

### 8. Instalar Maven dentro de Jenkins
La imagen `jenkins/jenkins:lts` no incluye Maven. Hay que instalarlo manualmente:
```bash
docker exec jenkins sh -c "\
  curl -sL https://dlcdn.apache.org/maven/maven-3/3.9.16/binaries/apache-maven-3.9.16-bin.tar.gz \
    -o /tmp/maven.tar.gz && \
  tar xzf /tmp/maven.tar.gz -C /opt/ && \
  ln -sf /opt/apache-maven-3.9.16/bin/mvn /usr/local/bin/mvn"
```
Verificar: `docker exec jenkins mvn --version`

### 9. Configurar Git safe.directory
Los workspaces de Jenkins tienen dueños mezclados (root y jenkins), lo que hace que Git se niegue a trabajar. Solución:
```bash
for ws in Freestyle-CRUD Despliegue-CRUD MercaList-Deploy; do
  docker exec jenkins git config --global --add safe.directory \
    "/var/jenkins_home/workspace/$ws" 2>/dev/null || true
done
```

### 10. Disparar el pipeline MercaList-Deploy
Desde la web `http://localhost:8083`:
- Entrar a **MercaList-Deploy**
- Click en **"Construir ahora"**

O desde terminal:
```bash
curl -X POST "http://localhost:8083/job/MercaList-Deploy/build" --user admin:admin
```

El pipeline ejecuta automáticamente: checkout del repo → `mvn clean package` → `mvn test` (86 tests) → `docker build -t market-admin` → `docker run -p 8080:8080`

### 11. Problemas comunes y soluciones

| Problema | Causa | Solución |
|---|---|---|
| `mvn: not found` | Jenkins no trae Maven instalado | Seguir el paso 8 (instalar Maven) |
| `fatal: not in a git directory` / `dubious ownership` | Dueño del `.git` no coincide con el usuario jenkins | Seguir el paso 9 (safe.directory) |
| `port 8080 already in use` | Otro proceso (o el backend) ya ocupa el puerto | El pipeline ejecuta `fuser -k 8080/tcp` automáticamente |
| `Pipeline script from SCM` falla al cargar Jenkinsfile | Incompatibilidad del plugin Git con Jenkins 2.555+ | `MercaList-Deploy` usa pipeline inline en vez de "from SCM" |
| La app no arranca o tests fallan | Puerto 3307 ocupado en tu máquina | Cambiar `DB_PORT` en `.env` y usar ese puerto en los comandos `mvn` |
```
