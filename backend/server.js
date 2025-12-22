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

// Personaje (Biografía)
const PersonajeSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  nombreCompleto: String,
  fechaNacimiento: Date,
  fechaMuerte: Date,
  lugarNacimiento: String,
  pais: { type: String, default: 'Colombia' },
  ambito: { type: String, enum: ['nacional', 'latinoamerica', 'mundial'], default: 'nacional' },
  profesiones: [String],
  biografia: { type: String, required: true },
  logrosDestacados: [String],
  frasesCelebres: [{ frase: String, contexto: String }],
  imagen: String,
  galeria: [String],
  eventosRelacionados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evento' }],
  articulos: [{ titulo: String, contenido: String, fecha: Date }],
  cronologia: [{
    año: Number,
    evento: String,
    descripcion: String
  }],
  legado: String,
  fuentes: [String],
  createdAt: { type: Date, default: Date.now }
});

// Narrativa Interactiva
const NarrativaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  subtitulo: String,
  descripcionCorta: String,
  ambito: { type: String, enum: ['nacional', 'latinoamerica', 'mundial'], default: 'nacional' },
  categoria: String,
  imagen: String,
  capitulos: [{
    numero: Number,
    titulo: String,
    contenido: String,
    imagenes: [String],
    audioUrl: String,
    preguntas: [{
      pregunta: String,
      opciones: [String],
      respuestaCorrecta: Number
    }]
  }],
  personajesRelacionados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Personaje' }],
  eventosRelacionados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evento' }],
  duracionEstimada: Number,
  progreso: [{
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    capitulosCompletados: [Number],
    ultimoCapitulo: Number,
    fechaUltimaLectura: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

// Podcast
const PodcastSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: String,
  ambito: { type: String, enum: ['nacional', 'latinoamerica', 'mundial'], default: 'nacional' },
  categoria: String,
  duracion: Number,
  audioUrl: { type: String, required: true },
  imagenPortada: String,
  temporada: Number,
  episodio: Number,
  transcript: String,
  personajesRelacionados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Personaje' }],
  eventosRelacionados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evento' }],
  escuchas: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comentarios: [{
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    texto: String,
    fecha: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Evento = mongoose.model('Evento', EventoSchema);
const Pregunta = mongoose.model('Pregunta', PreguntaSchema);
const Resultado = mongoose.model('Resultado', ResultadoSchema);
const Video = mongoose.model('Video', VideoSchema);
const Personaje = mongoose.model('Personaje', PersonajeSchema);
const Narrativa = mongoose.model('Narrativa', NarrativaSchema);
const Podcast = mongoose.model('Podcast', PodcastSchema);

const torneosRoutes = require('./torneos');

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

app.use('/api/torneos', torneosRoutes);

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

// ==================== RUTAS PERSONAJES ====================

// Obtener todos los personajes
app.get('/api/personajes', async (req, res) => {
  try {
    const { ambito, profesion, busqueda } = req.query;
    const filtro = {};
    
    if (ambito) filtro.ambito = ambito;
    if (profesion) filtro.profesiones = profesion;
    if (busqueda) {
      filtro.$or = [
        { nombre: { $regex: busqueda, $options: 'i' } },
        { nombreCompleto: { $regex: busqueda, $options: 'i' } },
        { biografia: { $regex: busqueda, $options: 'i' } }
      ];
    }
    
    const personajes = await Personaje.find(filtro)
      .select('nombre fechaNacimiento fechaMuerte profesiones imagen pais ambito')
      .sort({ nombre: 1 });
    
    res.json(personajes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener personajes' });
  }
});

// Obtener personaje por ID
app.get('/api/personajes/:id', async (req, res) => {
  try {
    const personaje = await Personaje.findById(req.params.id)
      .populate('eventosRelacionados');
    
    if (!personaje) {
      return res.status(404).json({ error: 'Personaje no encontrado' });
    }
    
    res.json(personaje);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener personaje' });
  }
});

// Crear personaje (admin)
app.post('/api/personajes', authMiddleware, async (req, res) => {
  try {
    const personaje = new Personaje(req.body);
    await personaje.save();
    res.status(201).json(personaje);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear personaje' });
  }
});

// ==================== RUTAS NARRATIVAS ====================

// Obtener todas las narrativas
app.get('/api/narrativas', async (req, res) => {
  try {
    const { ambito, categoria } = req.query;
    const filtro = {};
    
    if (ambito) filtro.ambito = ambito;
    if (categoria) filtro.categoria = categoria;
    
    const narrativas = await Narrativa.find(filtro)
      .select('titulo subtitulo descripcionCorta imagen capitulos ambito categoria duracionEstimada')
      .sort({ createdAt: -1 });
    
    res.json(narrativas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener narrativas' });
  }
});

// Obtener narrativa por ID
app.get('/api/narrativas/:id', authMiddleware, async (req, res) => {
  try {
    const narrativa = await Narrativa.findById(req.params.id)
      .populate('personajesRelacionados', 'nombre imagen')
      .populate('eventosRelacionados', 'titulo fecha');
    
    if (!narrativa) {
      return res.status(404).json({ error: 'Narrativa no encontrada' });
    }
    
    // Buscar progreso del usuario
    const progreso = narrativa.progreso.find(
      p => p.usuario.toString() === req.user._id.toString()
    );
    
    res.json({
      ...narrativa.toObject(),
      progresoUsuario: progreso || { capitulosCompletados: [], ultimoCapitulo: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener narrativa' });
  }
});

// Actualizar progreso de narrativa
app.post('/api/narrativas/:id/progreso', authMiddleware, async (req, res) => {
  try {
    const { capituloCompletado } = req.body;
    const narrativa = await Narrativa.findById(req.params.id);
    
    if (!narrativa) {
      return res.status(404).json({ error: 'Narrativa no encontrada' });
    }
    
    const progresoIndex = narrativa.progreso.findIndex(
      p => p.usuario.toString() === req.user._id.toString()
    );
    
    if (progresoIndex === -1) {
      narrativa.progreso.push({
        usuario: req.user._id,
        capitulosCompletados: [capituloCompletado],
        ultimoCapitulo: capituloCompletado,
        fechaUltimaLectura: new Date()
      });
    } else {
      const progreso = narrativa.progreso[progresoIndex];
      if (!progreso.capitulosCompletados.includes(capituloCompletado)) {
        progreso.capitulosCompletados.push(capituloCompletado);
      }
      progreso.ultimoCapitulo = capituloCompletado;
      progreso.fechaUltimaLectura = new Date();
    }
    
    await narrativa.save();
    res.json({ message: 'Progreso actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar progreso' });
  }
});

// ==================== RUTAS PODCASTS ====================

// Obtener todos los podcasts
app.get('/api/podcasts', async (req, res) => {
  try {
    const { ambito, categoria, temporada } = req.query;
    const filtro = {};
    
    if (ambito) filtro.ambito = ambito;
    if (categoria) filtro.categoria = categoria;
    if (temporada) filtro.temporada = parseInt(temporada);
    
    const podcasts = await Podcast.find(filtro)
      .select('titulo descripcion duracion imagenPortada temporada episodio escuchas ambito categoria')
      .sort({ temporada: -1, episodio: -1 });
    
    res.json(podcasts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener podcasts' });
  }
});

// Obtener podcast por ID
app.get('/api/podcasts/:id', async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id)
      .populate('personajesRelacionados', 'nombre imagen')
      .populate('eventosRelacionados', 'titulo fecha')
      .populate('comentarios.usuario', 'nombre avatar');
    
    if (!podcast) {
      return res.status(404).json({ error: 'Podcast no encontrado' });
    }
    
    res.json(podcast);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener podcast' });
  }
});

// Registrar escucha de podcast
app.post('/api/podcasts/:id/escuchar', authMiddleware, async (req, res) => {
  try {
    const podcast = await Podcast.findByIdAndUpdate(
      req.params.id,
      { $inc: { escuchas: 1 } },
      { new: true }
    );
    res.json(podcast);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar escucha' });
  }
});

// Toggle like en podcast
app.post('/api/podcasts/:id/like', authMiddleware, async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    const userId = req.user._id;
    
    if (podcast.likes.includes(userId)) {
      podcast.likes = podcast.likes.filter(id => !id.equals(userId));
    } else {
      podcast.likes.push(userId);
    }
    
    await podcast.save();
    res.json(podcast);
  } catch (error) {
    res.status(500).json({ error: 'Error al dar like' });
  }
});

// Agregar comentario a podcast
app.post('/api/podcasts/:id/comentario', authMiddleware, async (req, res) => {
  try {
    const { texto } = req.body;
    const podcast = await Podcast.findById(req.params.id);
    
    podcast.comentarios.push({
      usuario: req.user._id,
      texto
    });
    
    await podcast.save();
    await podcast.populate('comentarios.usuario', 'nombre avatar');
    
    res.json(podcast);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar comentario' });
  }
});

// ==================== SERVIDOR ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});