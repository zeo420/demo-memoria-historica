// server.js - Backend Node.js + Express + MongoDB
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
}).then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// ==================== MODELOS ====================

// Usuario
const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'default-avatar.png' },
  nivel: { type: Number, default: 1 },
  puntos: { type: Number, default: 0 },
  medallas: [{ tipo: String, fecha: Date }],
  estadisticas: {
    triviasCompletadas: { type: Number, default: 0 },
    respuestasCorrectas: { type: Number, default: 0 },
    respuestasIncorrectas: { type: Number, default: 0 },
    tiempoTotal: { type: Number, default: 0 }
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
const Evento = mongoose.model('Evento', EventoSchema);
const Pregunta = mongoose.model('Pregunta', PreguntaSchema);
const Resultado = mongoose.model('Resultado', ResultadoSchema);

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
    
    // Sistema de niveles
    const puntosParaNivel = req.user.nivel * 100;
    if (req.user.puntos >= puntosParaNivel) {
      req.user.nivel += 1;
      req.user.medallas.push({ tipo: `nivel_${req.user.nivel}`, fecha: new Date() });
    }
    
    await req.user.save();
    
    res.json({
      resultado,
      usuario: {
        nivel: req.user.nivel,
        puntos: req.user.puntos,
        estadisticas: req.user.estadisticas
      }
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

// ==================== SERVIDOR ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});