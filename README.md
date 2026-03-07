# Administrador de Compras de Mercado (Frontend)

Aplicación web en Angular para gestionar listas de mercado: creación de listas, productos, compras frecuentes, estadísticas y autenticación básica.

Está construida con **Angular 21** y usa **localStorage** para persistir datos en el navegador.

---

## Requisitos previos

- **Node.js** (versión recomendada LTS).
- **npm** (el proyecto está configurado para usar npm).

Puedes verificar tus versiones con:

```bash
node -v
npm -v
```

---

## Instalación y ejecución del frontend

1. **Clonar el repositorio**

   ```bash
   git clone <URL_DEL_REPO>
   cd Administrador-de-Compras-de-Mercado
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Levantar servidor de desarrollo**

   ```bash
   npm start
   ```

   Esto ejecuta `ng serve`.  
   Cuando la compilación termine, abre en tu navegador:

   ```text
   http://localhost:4200/
   ```

   La aplicación se recargará automáticamente cuando modifies los archivos fuente.

4. **Build para producción**

   ```bash
   npm run build
   ```

   Los artefactos se generan en la carpeta `dist/`.

---

## Funcionalidades principales

- **Autenticación básica**: pantallas de inicio de sesión y registro.
- **Dashboard**: vista general de tus listas y accesos rápidos.
- **Listas de mercado**:
  - Crear, editar y eliminar listas.
  - Ver el detalle de cada lista con sus productos.
- **Productos**:
  - Agregar, editar y eliminar productos de una lista.
  - Marcar productos como **pendientes** o **comprados**.
  - Separación visual en la vista de detalle entre **Pendientes** y **Comprados**.
- **Compras frecuentes**:
  - Catálogo de productos frecuentes.
  - Añadir rápidamente productos frecuentes a una lista existente.
- **Estadísticas**:
  - Vista de estadísticas generales de tus compras (usa `chart.js`).

> Nota: los datos (listas, productos, estado de compra, etc.) se almacenan en `localStorage`, por lo que son propios de cada navegador/dispositivo.

---

## Scripts disponibles

En el directorio del proyecto puedes ejecutar:

- **`npm start`**  
  Inicia el servidor de desarrollo (`ng serve`).

- **`npm run build`**  
  Compila la aplicación para producción en `dist/`.

- **`npm run watch`**  
  Compila en modo watch (`ng build --watch --configuration development`).

- **`npm test`**  
  Ejecuta las pruebas unitarias configuradas con `ng test`/Vitest.

---

## Estructura general del código (resumen)

- `src/main.ts`  
  Punto de entrada de la aplicación Angular.

- `src/index.html`  
  HTML principal que carga el bundle de Angular.

- `src/styles.css`  
  Estilos globales de la aplicación.

- `src/app/app.config.ts`, `app.routes.ts`  
  Configuración principal de Angular (bootstrap) y definición de rutas.

- `src/app/models`  
  Interfaces de dominio (`User`, `GroceryList`, `Product`, etc.).

- `src/app/services`  
  Servicios para manejar lógica de negocio y acceso a datos (listas, productos, autenticación, estadísticas).  
  Se apoyan en `localStorage` para persistir información.

- `src/app/guards`  
  Guards de rutas (por ejemplo, para proteger rutas que requieren que el usuario esté autenticado).

- `src/app/components`  
  Componentes reutilizables:
  - `navbar`, `sidebar`, `layout`
  - `product-card`, `product-form`, `list-form`, etc.

- `src/app/pages`  
  Páginas de alto nivel (rutas):
  - `login`, `register`
  - `dashboard`
  - `list-detail`
  - `frequent-purchases`
  - `statistics`

---

## Notas para contribuyentes

- Mantener la arquitectura actual basada en:
  - Páginas en `src/app/pages`.
  - Componentes reutilizables en `src/app/components`.
  - Servicios en `src/app/services`.
  - Modelos tipados en `src/app/models`.
- Preferir el uso de **servicios** para la lógica de negocio y acceso a datos, y mantener los componentes lo más “presentacionales” posible.
- Antes de abrir un Pull Request:
  - Verificar que el proyecto compila (`npm run build` o al menos `npm start` sin errores).
  - Ejecutar pruebas unitarias relevantes (`npm test` si aplica en tu cambio).
