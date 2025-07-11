# TP2 - Grupo 37: Productoras de Películas

## 📖 Descripción

Este proyecto es una aplicación web que obtiene información sobre las productoras de las 5 películas mejor valoradas utilizando la API de The Movie Database (TMDb) y permite almacenar y recuperar estos datos desde un CMS Strapi.

## ✨ Características

- **Consulta de API Externa**: Integración con TMDb API para obtener las películas mejor valoradas
- **Gestión de Datos**: Procesamiento y eliminación de duplicados de productoras
- **Integración con Strapi**: Almacenamiento y recuperación de datos desde un CMS headless
- **Interfaz Responsiva**: Diseño moderno con animaciones CSS
- **Visualización**: Muestra logos, nombres y países de origen de las productoras

## 🚀 Funcionalidades

### Principales
1. **Cargar Productoras**: Obtiene las 5 películas mejor valoradas de TMDb y extrae las productoras únicas
2. **Guardar en Strapi**: Almacena automáticamente las productoras en el CMS Strapi
3. **Ver desde Strapi**: Recupera y muestra los datos almacenados en Strapi
4. **Prevención de Duplicados**: Verifica la existencia antes de guardar nuevos registros

### Técnicas
- Consumo de APIs RESTful
- Manejo asíncrono con async/await
- Procesamiento de datos con Map() para evitar duplicados
- Autenticación con Bearer Token
- Renderizado dinámico del DOM

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**: 
  - TMDb API (The Movie Database)
  - Strapi CMS API
- **Estilos**: CSS con animaciones personalizadas
- **Fuentes**: Google Fonts (Roboto)

## 📁 Estructura del Proyecto

```
Grupo37/
├── index.html          # Página principal
├── styles.css          # Estilos y animaciones
├── script.js           # Lógica de la aplicación
├── README.md           # Documentación
└── images/
    ├── LogoTYG.webp    # Logo principal
    ├── pageLogo.ico    # Favicon
    └── StrapiLogo.webp # Logo de Strapi
```

## 🔧 Configuración

### APIs Utilizadas

1. **TMDb API**
   - Endpoint: `https://api.themoviedb.org/3/`
   - Funciones: Obtener películas top y detalles de películas

2. **Strapi CMS**
   - URL: `https://gestionweb.frlp.utn.edu.ar/api/g37-productoras`
   - Funciones: CRUD de productoras

### Instalación

1. Clona el repositorio
2. Abre `index.html` en tu navegador
3. ¡Listo para usar!

No requiere instalación adicional ya que es una aplicación web estática.

## 💻 Uso

1. **Cargar Datos**: Haz clic en "Cargar Productoras" para obtener datos de TMDb y guardarlos en Strapi
2. **Ver Datos**: Una vez cargados, usa "Ver datos desde Strapi" para visualizar la información almacenada
3. **Navegación**: El logo es interactivo y cuenta con animaciones personalizadas

## 🎨 Características de Diseño

- **Tema Oscuro**: Paleta de colores moderna en tonos oscuros
- **Animaciones**: 
  - Logo con efecto de agitación continua
  - Efectos hover en botones
  - Transiciones suaves
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **UX/UI**: Interfaz intuitiva con feedback visual

## 👥 Equipo

**Grupo 37** - TygWeb 2025
- **Siadore, Valentino**
- **Costa, Tomás**
- **Salas Triana, Mariano**
- **Ferrari, Agustín**

---

*Desarrollado como parte del Trabajo Práctico 2 de la materia TygWeb - 2025*
