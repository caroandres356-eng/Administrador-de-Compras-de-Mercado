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
- **Node.js** (v18 o superior)
- **Java JDK 21**
- **Maven** (opcional, se puede usar el wrapper `./mvnw`)
- **MySQL Server** corriendo localmente

### 1. Configuración del Backend (Spring Boot)

El backend maneja la autenticación, persistencia de datos (MySQL) y lógica de negocio.

**Requisitos MySQL:**

Asegúrate de tener un servidor MySQL corriendo.
Crea una base de datos llamada `mercalist_db`.

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

```bash
# 1. Prerequisitos (Arch Linux)
sudo pacman -S docker jdk17-openjdk maven
sudo systemctl enable docker && sudo systemctl start docker
sudo usermod -aG docker $USER  # cerrar sesión y volver a entrar

# 2. Clonar
git clone https://github.com/caroandres356-eng/Administrador-de-Compras-de-Mercado.git
cd Administrador-de-Compras-de-Mercado

# 3. Levantar la BD
docker compose -f docker-compose.dev.yml up -d

# 4. Correr tests
cd backend && DB_PORT=3307 SPRING_PROFILES_ACTIVE=dev mvn test
# Resultado esperado: Tests run: 86, Failures: 0, Errors: 0

# 5. Empaquetar y correr manualmente
mvn clean package -DskipTests
DB_PORT=3307 SPRING_PROFILES_ACTIVE=dev java -jar target/admin-0.0.1-SNAPSHOT.jar
# http://localhost:8080/swagger-ui/index.html

# 6. Construir imagen Docker
cd .. && docker build -t market-admin:latest ./backend
docker run -d --name market-admin --network host \
  -e SPRING_PROFILES_ACTIVE=dev -e DB_PORT=3307 \
  -e DB_NAME=mercalist_db -e DB_USER=root -e DB_PASS=Pipesofi2006 \
  market-admin:latest

# 7. Levantar Jenkins (si ya fue configurado antes)
docker start jenkins
# http://localhost:8083 | admin / admin
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
