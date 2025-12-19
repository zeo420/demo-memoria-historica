const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/memoria-historica', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error MongoDB:', err));

// ==================== MODELOS ====================

// Usuario
const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'default-avatar.png' },
  nivel: { type: Number, default: 1 },
  puntos: { type: Number, default: 0 },
  medallas: [{
    tipo: String,
    nombre: String,
    fecha: Date
  }],
  estadisticas: {
    triviasCompletadas: { type: Number, default: 0 },
    respuestasCorrectas: { type: Number, default: 0 },
    respuestasIncorrectas: { type: Number, default: 0 },
    tiempoTotal: { type: Number, default: 0 },
    racha: { type: Number, default: 0 },
    mejorPorcentaje: { type: Number, default: 0 }
  },
  fechaRegistro: { type: Date, default: Date.now }
});

// Evento Histórico
const EventoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  fecha: { type: Date, required: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, enum: ['politico', 'social', 'economico', 'cultural', 'conflicto'], required: true },
  pais: { type: String, default: 'Colombia' },
  imagen: String,
  videoUrl: String,
  fuentes: [String],
  coordenadas: { lat: Number, lng: Number }
});

// Pregunta de Trivia
const PreguntaSchema = new mongoose.Schema({
  pregunta: { type: String, required: true },
  opciones: [{ type: String, required: true }],
  respuestaCorrecta: { type: Number, required: true },
  dificultad: { type: String, enum: ['facil', 'medio', 'dificil'], default: 'medio' },
  categoria: String,
  eventoRelacionado: { type: mongoose.Schema.Types.ObjectId, ref: 'Evento' },
  puntos: { type: Number, default: 10 }
});

// Resultado de Trivia
const ResultadoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  preguntasRespondidas: [{
    pregunta: { type: mongoose.Schema.Types.ObjectId, ref: 'Pregunta' },
    respuestaUsuario: Number,
    correcta: Boolean,
    tiempo: Number
  }],
  puntosTotales: Number,
  porcentajeAcierto: Number,
  fecha: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
// Video Schema
const VideoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: String,
  youtubeId: { type: String, required: true },
  duracion: Number,
  categoria: String,
  eventoRelacionado: { type: mongoose.Schema.Types.ObjectId, ref: 'Evento' },
  vistas: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const Evento = mongoose.model('Evento', EventoSchema);
const Pregunta = mongoose.model('Pregunta', PreguntaSchema);
const Resultado = mongoose.model('Resultado', ResultadoSchema);
const Video = mongoose.model('Video', VideoSchema);

// ==================== MIDDLEWARE AUTH ====================
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
    const user = await User.findById(decoded.userId);
    
    if (!user) throw new Error();
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Por favor autentícate' });
  }
};

// ==================== RUTAS AUTH ====================

// Registro
app.post('/api/auth/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    
    // Validaciones
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    const existeUsuario = await User.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      nombre,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey123');
    
    res.status(201).json({
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        nivel: user.nivel,
        puntos: user.puntos
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey123');
    
    res.json({
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        nivel: user.nivel,
        puntos: user.puntos,
        avatar: user.avatar,
        estadisticas: user.estadisticas
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// ==================== RUTAS EVENTOS ====================

// Obtener todos los eventos
app.get('/api/eventos', async (req, res) => {
  try {
    const { categoria, pais, limit = 50 } = req.query;
    const filtro = {};
    
    if (categoria) filtro.categoria = categoria;
    if (pais) filtro.pais = pais;
    
    const eventos = await Evento.find(filtro)
      .sort({ fecha: 1 })
      .limit(parseInt(limit));
    
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

// Crear evento (protegido)
app.post('/api/eventos', authMiddleware, async (req, res) => {
  try {
    const evento = new Evento(req.body);
    await evento.save();
    res.status(201).json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear evento' });
  }
});

// ==================== RUTAS TRIVIA ====================

// Obtener preguntas aleatorias
app.get('/api/trivia/preguntas', authMiddleware, async (req, res) => {
  try {
    const { cantidad = 10, dificultad, categoria } = req.query;
    const filtro = {};
    
    if (dificultad) filtro.dificultad = dificultad;
    if (categoria) filtro.categoria = categoria;
    
    const preguntas = await Pregunta.aggregate([
      { $match: filtro },
      { $sample: { size: parseInt(cantidad) } }
    ]);
    
    res.json(preguntas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener preguntas' });
  }
});

// Obtener historial de trivias del usuario
app.get('/api/trivia/historial', authMiddleware, async (req, res) => {
  try {
    const historial = await Resultado.find({ usuario: req.user._id })
      .sort({ fecha: -1 })
      .limit(50)
      .populate('preguntasRespondidas.pregunta', 'pregunta categoria');
    
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

// Guardar resultado de trivia
app.post('/api/trivia/resultado', authMiddleware, async (req, res) => {
  try {
    const { preguntasRespondidas, puntosTotales, porcentajeAcierto } = req.body;
    
    const resultado = new Resultado({
      usuario: req.user._id,
      preguntasRespondidas,
      puntosTotales,
      porcentajeAcierto
    });
    
    await resultado.save();
    
    // Actualizar estadísticas del usuario
    req.user.estadisticas.triviasCompletadas += 1;
    req.user.puntos += puntosTotales;
    
    const respuestasCorrectas = preguntasRespondidas.filter(p => p.correcta).length;
    req.user.estadisticas.respuestasCorrectas += respuestasCorrectas;
    req.user.estadisticas.respuestasIncorrectas += (preguntasRespondidas.length - respuestasCorrectas);
    
    // Sistema de niveles mejorado (cada nivel requiere más puntos)
    const puntosParaNivel = req.user.nivel * 100;
    let nuevosMedallas = [];
    
    while (req.user.puntos >= req.user.nivel * 100) {
      req.user.nivel += 1;
      nuevosMedallas.push({
        tipo: `nivel_${req.user.nivel}`,
        nombre: `Nivel ${req.user.nivel} Alcanzado`,
        fecha: new Date()
      });
    }
    
    // Medallas por logros específicos
    if (porcentajeAcierto === 100) {
      nuevosMedallas.push({
        tipo: 'perfeccion',
        nombre: 'Trivia Perfecta',
        fecha: new Date()
      });
    }
    
    if (porcentajeAcierto >= 90) {
      nuevosMedallas.push({
        tipo: 'experto',
        nombre: 'Experto en Historia',
        fecha: new Date()
      });
    }
    
    if (req.user.estadisticas.triviasCompletadas === 10) {
      nuevosMedallas.push({
        tipo: 'perseverante',
        nombre: 'Perseverante - 10 Trivias',
        fecha: new Date()
      });
    }
    
    if (req.user.estadisticas.triviasCompletadas === 50) {
      nuevosMedallas.push({
        tipo: 'maestro',
        nombre: 'Maestro de la Historia',
        fecha: new Date()
      });
    }
    
    // Racha de victorias
    if (porcentajeAcierto >= 80) {
      req.user.estadisticas.racha = (req.user.estadisticas.racha || 0) + 1;
      
      if (req.user.estadisticas.racha >= 5) {
        nuevosMedallas.push({
          tipo: 'racha',
          nombre: 'Racha de Fuego - 5 Trivias',
          fecha: new Date()
        });
      }
    } else {
      req.user.estadisticas.racha = 0;
    }
    
    // Agregar nuevas medallas
    if (nuevosMedallas.length > 0) {
      req.user.medallas.push(...nuevosMedallas);
    }
    
    await req.user.save();
    
    res.json({
      resultado,
      usuario: {
        nivel: req.user.nivel,
        puntos: req.user.puntos,
        estadisticas: req.user.estadisticas,
        medallas: req.user.medallas
      },
      nuevasMedallas: nuevosMedallas
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar resultado' });
  }
});

// ==================== RUTAS USUARIO ====================

// Perfil del usuario
app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// Actualizar perfil
app.put('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const { nombre, avatar } = req.body;
    
    if (nombre) req.user.nombre = nombre;
    if (avatar) req.user.avatar = avatar;
    
    await req.user.save();
    
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

// Ranking de usuarios
app.get('/api/user/ranking', async (req, res) => {
  try {
    const ranking = await User.find()
      .select('nombre puntos nivel avatar')
      .sort({ puntos: -1 })
      .limit(10);
    
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ranking' });
  }
});

// ==================== RUTAS VIDEOS ====================

// Obtener todos los videos
app.get('/api/videos', async (req, res) => {
  try {
    const { categoria, busqueda } = req.query;
    const filtro = {};
    
    if (categoria) filtro.categoria = categoria;
    if (busqueda) {
      filtro.$or = [
        { titulo: { $regex: busqueda, $options: 'i' } },
        { descripcion: { $regex: busqueda, $options: 'i' } }
      ];
    }
    
    const videos = await Video.find(filtro).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener videos' });
  }
});

// Registrar vista de video
app.post('/api/videos/:id/vista', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { vistas: 1 } },
      { new: true }
    );
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar vista' });
  }
});

// Toggle like en video
app.post('/api/videos/:id/like', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    const userId = req.user._id;
    
    if (video.likes.includes(userId)) {
      video.likes = video.likes.filter(id => !id.equals(userId));
    } else {
      video.likes.push(userId);
    }
    
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error al dar like' });
  }
});

// ==================== RUTAS MAPAS ====================

// Obtener eventos para mapa
app.get('/api/eventos/mapa', async (req, res) => {
  try {
    const { categoria, decada } = req.query;
    const filtro = { coordenadas: { $exists: true } };
    
    if (categoria) filtro.categoria = categoria;
    if (decada) {
      const year = parseInt(decada);
      filtro.fecha = {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 10, 0, 1)
      };
    }
    
    const eventos = await Evento.find(filtro).select('titulo fecha categoria coordenadas descripcion imagen fuentes');
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos del mapa' });
  }
});

// ==================== SERVIDOR ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});