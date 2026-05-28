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
- **Java JDK 17+**
- **Maven** (incluido en el wrapper `./mvnw`)
- **MariaDB 11+** — dos opciones:

---

### Opción A: MariaDB nativo (recomendado si ya lo tenés instalado)

```bash
# Asegurate de que MariaDB esté corriendo
sudo systemctl start mariadb

# Crear la base de datos (si no existe)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS mercalist_db"
```

### Opción B: MariaDB en Docker (no requiere instalación local)

```bash
# Levantar MariaDB en puerto 3307 (evita conflictos con MariaDB nativo)
DB_PASS=Pipesofi2006 docker compose -f docker-compose.dev.yml up -d

# Si querés cambiar el puerto (ej. 3306):
DB_PORT=3306 DB_PASS=Pipesofi2006 docker compose -f docker-compose.dev.yml up -d
```

---

### 1. Configurar variables de entorno

El proyecto lee la configuración de BD desde variables de entorno. Copiá el template y ajustalo:

```bash
cp .env.example .env
# Editá .env si tu contraseña es distinta a Pipesofi2006
```

O exportalas directamente en tu shell:

```bash
export DB_PASS=tu_contraseña
```

**Variables disponibles:**

| Variable    | Default               | Descripción                        |
|-------------|-----------------------|------------------------------------|
| `DB_HOST`   | `127.0.0.1`           | Host de MariaDB                    |
| `DB_PORT`   | `3306`                | Puerto de MariaDB                  |
| `DB_NAME`   | `mercalist_db`        | Nombre de la base de datos         |
| `DB_USER`   | `root`                | Usuario de MariaDB                 |
| `DB_PASS`   | `Pipesofi2006`        | Contraseña de MariaDB              |

---

### 2. Ejecutar el Backend

```bash
cd backend
mvn spring-boot:run
```

El servidor inicia en `http://localhost:8080`.

> **⚠️ Puerto 8080 ocupado?** Si Jenkins u otro servicio lo usa, matalo con `fuser -k 8080/tcp` o cambiá el puerto con `SERVER_PORT=8081 mvn spring-boot:run`.

---

### 3. Configuración del Frontend (Next.js)

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
├── backend/                # API REST con Spring Boot
│   ├── src/main/java/com/market/admin/
│   │   ├── config/         # Configuración de Seguridad y CORS
│   │   ├── controller/     # Endpoints de la API
│   │   ├── dto/            # Objetos de transferencia de datos
│   │   ├── model/          # Entidades JPA (User, List, Product)
│   │   ├── repository/     # Interfaces de acceso a DB
│   │   └── service/        # Lógica de negocio
│   └── src/main/resources/ # Propiedades y perfiles (MySQL/H2)
├── frontend/               # Cliente web con Next.js
│   ├── components/         # Componentes de UI
│   ├── lib/                # Contexto y lógica de API
│   └── app/                # Páginas y layout principal
├── test/                   # Pruebas de API y herramientas
│   ├── jmeter/             # Planes de carga JMeter
│   ├── postman/            # Colecciones Postman
│   ├── newman/             # Reportes de Newman (Postman CLI)
│   ├── python/             # Scripts de prueba Python
│   ├── reports/            # Reportes generados (PDFs, etc.)
│   └── utils/              # Utilidades (formateo de reportes)
└── docs/                   # Documentación (PDFs de prácticas, etc.)
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
   `backend\target\reports\apidocs\index.html` (o `backend\target\site\apidocs\index.html` dependiendo de la versión del plugin).
