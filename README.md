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
- **Java 17**
- **Spring Boot 3.2+**
- **Spring Security** (Autenticación JWT)
- **Spring Data JPA** (Hibernate)
- **MySQL** (Base de datos por defecto en desarrollo)
- **H2 Database** (Respaldo en memoria)
- **Maven** (Gestión de dependencias)

---

## 🛠️ Instalación y Configuración

### Requisitos Previos
- **Node.js** (v18 o superior)
- **Java JDK 17**
- **Maven** (opcional, se puede usar el wrapper `./mvnw`)
- **MySQL Server** corriendo localmente

---

### 1. Configuración del Backend (Spring Boot)

El backend maneja la autenticación, persistencia de datos (MySQL) y lógica de negocio.

**Requisitos MySQL:**
1. Asegúrate de tener un servidor MySQL corriendo.
2. Crea una base de datos llamada `mercalist_db`.

**Configuración de Variables de Entorno (Recomendado):**
Para evitar subir contraseñas al código, el proyecto usa variables de entorno en el perfil `dev`. Configura las siguientes variables en tu sistema o IDE para que coincidan con tu MySQL local:
- `DB_NAME`: Nombre de tu base de datos (por defecto: `mercalist_db`).
- `DB_USER`: Tu usuario de MySQL (por defecto: `root`).
- `DB_PASS`: Tu contraseña de MySQL (por defecto: vacía).

*Si prefieres usar H2 (en memoria), cambia `spring.profiles.active=dev` a `default` en `backend/src/main/resources/application.properties`.*

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
