# Memoria Histórica - Plataforma Educativa Gamificada

> Plataforma web interactiva que utiliza gamificación y tecnologías modernas para acercar a los jóvenes al aprendizaje de la historia de Colombia.

## Características Principales

### Sistema de Autenticación
- Registro e inicio de sesión con JWT
- Perfiles de usuario personalizables
- Gestión de sesiones segura

### Línea de Tiempo Histórica
- Visualización cronológica de eventos
- Filtros por categoría (político, social, conflicto, cultural, económico)
- Tarjetas interactivas con información detallada
- Enlaces a fuentes históricas verificadas

### Módulo de Videos Educativos
- Catálogo de videos sobre historia colombiana
- Player de YouTube integrado
- Sistema de búsqueda y filtros
- Contador de vistas y "me gusta"

### Mapas Interactivos
- Visualización geográfica de eventos históricos
- Filtros por categoría y década
- Información detallada por región
- Puntos codificados por color

### Sistema de Trivias Gamificado
- Preguntas de selección múltiple
- Tres niveles de dificultad: fácil, medio, difícil
- Configuración personalizable (cantidad, dificultad, categoría)
- Sistema de puntuación dinámico
- Feedback inmediato
- Historial de intentos

### Sistema de Niveles y Medallas
- **Niveles Dinámicos**: Cada nivel requiere (nivel × 100) puntos
- **Medallas Automáticas**:
  - **Nivel X**: Al alcanzar cada nuevo nivel
  - **Trivia Perfecta**: 100% de acierto
  - **Experto**: ≥90% de acierto
  - **Perseverante**: 10 trivias completadas
  - **Maestro**: 50 trivias completadas
  - **Racha de Fuego**: 5 trivias consecutivas con ≥80%

### Perfil de Usuario Completo
- **Tab Estadísticas**:
  - Trivias completadas
  - Respuestas correctas/incorrectas
  - Tasa de éxito global
  - Racha actual
  - Mejor porcentaje
- **Tab Medallas**: Todas las medallas con fecha de obtención
- **Tab Historial**: Registro completo de trivias realizadas

### Dashboard Analítico
- Resumen de estadísticas clave
- Gráfica de progreso reciente
- Tabla de historial detallado
- Métricas de desempeño

### Ranking Global
- Top 10 usuarios por puntos
- Visualización de nivel
- Actualización en tiempo real

---

## Tecnologías Utilizadas

### Frontend
```javascript
{
  "framework": "React 18",
  "buildTool": "Vite",
  "httpClient": "Axios",
  "styling": "CSS3 + Styled Components",
  "charts": "Chart.js",
  "routing": "React Router (planned)"
}
```

### Backend
```javascript
{
  "runtime": "Node.js 18+",
  "framework": "Express.js",
  "database": "MongoDB",
  "odm": "Mongoose",
  "authentication": "JWT (jsonwebtoken)",
  "security": "bcryptjs",
  "cors": "cors middleware"
}
```

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │  Login   │  │Timeline  │  │ Videos   │  │  Mapas  ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │  Trivia  │  │Dashboard │  │ Profile  │  │ Ranking ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS (Axios)
                     │ REST API
┌────────────────────▼────────────────────────────────────┐
│                  BACKEND (Node.js + Express)             │
│  ┌──────────────────────────────────────────────────┐   │
│  │            API Routes                             │   │
│  │  /api/auth  /api/eventos  /api/trivia            │   │
│  │  /api/user  /api/videos   /api/eventos/mapa     │   │
│  └────────────────┬─────────────────────────────────┘   │
│                   │                                      │
│  ┌────────────────▼─────────────────────────────────┐   │
│  │         Middleware Layer                          │   │
│  │  - Authentication (JWT)                           │   │
│  │  - CORS                                           │   │
│  │  - Error Handling                                 │   │
│  └────────────────┬─────────────────────────────────┘   │
└───────────────────┼──────────────────────────────────────┘
                    │ Mongoose ODM
┌───────────────────▼──────────────────────────────────────┐
│                    MongoDB Database                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  users   │  │ eventos  │  │preguntas │  │ videos  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│  ┌──────────┐                                            │
│  │resultados│                                            │
│  └──────────┘                                            │
└──────────────────────────────────────────────────────────┘
```

---

## Instalación

### Requisitos Previos

- Node.js 18+ ([Descargar](https://nodejs.org/))
- MongoDB 6+ ([Descargar](https://www.mongodb.com/try/download/community)) o cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Git ([Descargar](https://git-scm.com/))

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/zeo420/demo-memoria-historica.git
cd demo-memoria-historica
```

### Paso 2: Configurar Backend

```bash
# Instalar dependencias del backend
cd backend
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales
nano .env
```

**Contenido del .env:**
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/memoria-historica
JWT_SECRET=tu_clave_secreta_segura_12345*-/
PORT=5000
NODE_ENV=development
```

### Paso 3: Poblar Base de Datos

```bash
# Ejecutar script de seed
npm run seed
```

**Salida esperada:**
```
Limpiando base de datos...
Insertando eventos históricos...
Insertando preguntas de trivia...
Insertando videos educativos...
Base de datos poblada exitosamente!
   - x eventos históricos
   - x preguntas de trivia
   - x videos educativos
```

### Paso 4: Iniciar Backend

```bash
npm run dev
```

**Salida esperada:**
```
MongoDB conectado
Servidor corriendo en puerto 5000
```

### Paso 5: Configurar Frontend

```bash
# En una nueva terminal
cd ..
npm install

# Crear archivo .env en la raíz
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### Paso 6: Iniciar Frontend

```bash
npm run dev
```

**Salida esperada:**
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Paso 7: Acceder a la Aplicación

Abrir navegador en: **http://localhost:5173**

---

## Uso

### 1. Registro de Usuario

- Click en "Registrarse"
- Ingresar: Nombre, Email, Contraseña
- Click en "Crear Cuenta"

### 2. Explorar Contenido

**Línea de Tiempo:**
- Navegar por eventos históricos
- Filtrar por categoría
- Leer descripciones detalladas

**Videos:**
- Buscar videos por título
- Filtrar por categoría
- Ver videos educativos

**Mapas:**
- Visualizar eventos por ubicación
- Filtrar por década y categoría
- Ver detalles de cada evento

### 3. Completar Trivias

1. Click en "Trivia"
2. Configurar:
   - Cantidad de preguntas (5-20)
   - Dificultad (Fácil/Medio/Difícil)
   - Categoría
3. Click en "Comenzar Trivia"
4. Responder preguntas
5. Ver resultados y medallas

### 4. Revisar Progreso

**Dashboard:**
- Ver estadísticas generales
- Gráfica de progreso
- Historial de trivias

**Perfil:**
- Tab Estadísticas: Métricas detalladas
- Tab Medallas: Logros obtenidos
- Tab Historial: Todas las trivias

---

## Modelos de Datos

### User (Usuario)
```javascript
{
  _id: ObjectId,
  nombre: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  nivel: Number (default: 1),
  puntos: Number (default: 0),
  medallas: [{
    tipo: String,
    nombre: String,
    fecha: Date
  }],
  estadisticas: {
    triviasCompletadas: Number,
    respuestasCorrectas: Number,
    respuestasIncorrectas: Number,
    racha: Number,
    mejorPorcentaje: Number
  },
  fechaRegistro: Date
}
```

### Evento
```javascript
{
  _id: ObjectId,
  titulo: String,
  fecha: Date,
  descripcion: String,
  categoria: String (enum),
  pais: String,
  imagen: String (URL),
  videoUrl: String,
  coordenadas: { lat: Number, lng: Number },
  fuentes: [String]
}
```

### Pregunta
```javascript
{
  _id: ObjectId,
  pregunta: String,
  opciones: [String],
  respuestaCorrecta: Number,
  dificultad: String (enum: facil, medio, dificil),
  categoria: String,
  puntos: Number
}
```

### Resultado
```javascript
{
  _id: ObjectId,
  usuario: ObjectId (ref: User),
  preguntasRespondidas: [{
    pregunta: ObjectId,
    respuestaUsuario: Number,
    correcta: Boolean,
    tiempo: Number
  }],
  puntosTotales: Number,
  porcentajeAcierto: Number,
  fecha: Date
}
```

### Video
```javascript
{
  _id: ObjectId,
  titulo: String,
  descripcion: String,
  youtubeId: String,
  duracion: Number (segundos),
  categoria: String,
  vistas: Number,
  likes: [ObjectId] (ref: User)
}
```

## API Endpoints

### Autenticación
```
POST   /api/auth/register      # Registrar usuario
POST   /api/auth/login         # Iniciar sesión
```

### Eventos
```
GET    /api/eventos            # Obtener todos los eventos
GET    /api/eventos/:id        # Obtener evento por ID
POST   /api/eventos            # Crear evento (auth)
GET    /api/eventos/mapa       # Eventos con geolocalización
```

### Trivias
```
GET    /api/trivia/preguntas   # Obtener preguntas (auth)
POST   /api/trivia/resultado   # Guardar resultado (auth)
GET    /api/trivia/historial   # Obtener historial (auth)
```

### Usuario
```
GET    /api/user/profile       # Obtener perfil (auth)
PUT    /api/user/profile       # Actualizar perfil (auth)
GET    /api/user/ranking       # Ranking global
```

### Videos
```
GET    /api/videos             # Obtener videos
POST   /api/videos/:id/vista   # Registrar vista (auth)
POST   /api/videos/:id/like    # Toggle like (auth)
```

## Metodología: Design Thinking

Este proyecto fue desarrollado siguiendo la metodología **Design Thinking**:

### 1. Empatizar 
- Encuestas a estudiantes sobre conocimiento histórico
- Identificación del problema: bajo interés en historia reciente
- Análisis de necesidades educativas

### 2. Definir 
- **Problema**: Jóvenes desconocen eventos clave de la historia colombiana
- **Solución**: Plataforma gamificada para aprendizaje histórico interactivo
- **Objetivo**: Aumentar retención del conocimiento en un 20%

### 3. Idear 
- Brainstorming de funcionalidades
- Wireframes y mockups
- Selección de tecnologías
- Diseño de sistema de gamificación

### 4. Prototipar 
- Desarrollo de MVP con React + Node.js
- Implementación de funcionalidades core
- Integración con MongoDB
- Sistema de autenticación

### 5. Probar 
- Pruebas con usuarios reales
- Recolección de feedback
- Iteraciones y mejoras
- Validación de métricas

---

## Roadmap

### Fase 1: Fundamentos (Completado)
- [x] Backend con Node.js + Express
- [x] Base de datos MongoDB
- [x] Autenticación JWT
- [x] Frontend React básico
- [x] Sistema de trivias
- [x] Dashboard y perfil

### Fase 2: Multimedia (Completado)
- [x] Módulo de videos
- [x] Mapas interactivos
- [x] Sistema de medallas
- [x] Historial de trivias

### Fase 3: Expansión de Contenido (En Progreso)
- [ ] Biografías de personajes
- [ ] Narrativas interactivas
- [ ] Torneos y competencias

### Fase 5: Deployment (Planeado)
- [ ] Dockerización
- [ ] CI/CD con GitHub Actions
- [ ] Deploy en la nube
- [ ] Monitoreo y analytics


