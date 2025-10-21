# MaterialesYA

Proyecto marketplace para materiales de construcción, centrado en que particulares puedan crear publicaciones para vender sobrantes que tengan.
La cualidad principal del sistema es que los usuarios, al buscar, puedan **filtrar por categorías y subcategorías** de materiales, haciendo la búsqueda más fácil y los resultados más precisos.

---

## Herramientas Utilizadas

### Frontend

| Tecnología | Uso |
|------------|-----|
| `HTML5` | Estructura y maquetado de la aplicación |
| `CSS3` | Estilos y diseño responsive de la web |
| `JavaScript` | Lógica del cliente, manejo de eventos y comunicación con la API |

### Backend

| Tecnología | Uso |
|------------|-----|
| `Node.js` | Lógica del servidor, conexión con la base de datos e intercambio de datos con el frontend |
| `Express` | Framework para construir la API REST y servir archivos estáticos |
| `CORS` | Permite comunicación entre frontend y backend durante el desarrollo |
| `Body-Parser` | Permite procesar datos enviados en el cuerpo de las peticiones HTTP |

### Base de Datos

| Tecnología | Uso |
|------------|-----|
| `SQLite` | Almacenamiento local de usuarios, categorías y publicaciones |
| `Better-SQLite3` | Manejador eficiente de consultas SQL dentro del servidor Node |

---

## Instalación y ejecución del proyecto

### 1 - Clonar repositorio
```bash
git clone https://github.com/sebaiannotta17/2025-UTN-GRUPO-6.git
cd 2025-UTN-GRUPO-6
```
### 2 - Instalar dependencias del backend
```bash
cd backend
npm install
```
Nota: se instalan las siguientes dependencias
- better-sqlite3
- express
- CORS
- body-parser
### 3 - Iniciar servidor
```bash
npm start
```

