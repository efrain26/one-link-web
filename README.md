# OneLink Web - Frontend

Frontend web para OneLink, el generador de links universales para App Stores.

## 🎯 Descripción

Interfaz web construida con React + Vite que permite:
- Crear proyectos (apps) con sus URLs de App Store y Play Store
- Generar links cortos universales
- Ver proyectos creados
- Copiar y compartir links

## 🛠️ Stack Tecnológico

- **Framework:** Vite + React
- **Estilos:** TailwindCSS
- **Componentes:** shadcn/ui
- **HTTP Client:** Axios
- **Forms:** React Hook Form
- **Routing:** React Router

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Setup

```bash
# Clonar el repositorio
git clone https://github.com/efrain26/one-link-web.git
cd one-link-web

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL de tu backend
```


## 💻 Desarrollo

```bash
# Correr en modo desarrollo
npm run dev

# El servidor estará en http://localhost:5173
```

## 🏗️ Build para Producción

```bash
# Generar build optimizado
npm run build

# Preview del build
npm run preview
```

## 📂 Estructura del Proyecto

```
one-link-web/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes React
│   │   ├── ui/         # Componentes shadcn/ui
│   │   └── ...
│   ├── pages/          # Páginas/Vistas
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilidades y helpers
│   ├── services/       # API calls
│   ├── App.jsx         # Componente principal
│   └── main.jsx        # Entry point
├── .env                # Variables de entorno
├── package.json
└── vite.config.js
```

## 🔗 Backend

Este frontend se conecta al backend FastAPI de OneLink:
- Repositorio: [one-link](https://github.com/efrain26/one-link)
- API Docs: http://localhost:8000/docs

## 📝 Licencia

MIT

## 👨‍💻 Autor

Desarrollado con ❤️ para simplificar la distribución de apps móviles
