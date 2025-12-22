// backend/torneos.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Esquemas de Mongoose
const torneoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  creadorId: { type: String, required: true },
  creadorNombre: { type: String, required: true },
  estado: { 
    type: String, 
    enum: ['activo', 'proximamente', 'finalizado'], 
    default: 'activo' 
  },
  tipo: { 
    type: String, 
    enum: ['puntos', 'tiempo', 'eliminatoria'], 
    default: 'puntos' 
  },
  dificultad: { 
    type: String, 
    enum: ['facil', 'medio', 'dificil', 'mixta'], 
    default: 'mixta' 
  },
  categoria: String,
  fechaInicio: { type: Date, default: Date.now },
  fechaFin: Date,
  maxParticipantes: { type: Number, default: 10 },
  participantesActuales: { type: Number, default: 0 },
  participantes: [{
    usuarioId: String,
    nombre: String,
    puntuacion: { type: Number, default: 0 },
    respuestasCorrectas: { type: Number, default: 0 },
    tiempoPromedio: Number,
    fechaUnion: { type: Date, default: Date.now }
  }],
  premios: [{
    posicion: Number,
    premio: String,
    puntos: Number
  }],
  esPrivado: { type: Boolean, default: false },
  codigoAcceso: String,
  requiereCodigo: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const resultadoTorneoSchema = new mongoose.Schema({
  torneoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Torneo' },
  usuarioId: String,
  posicion: Number,
  puntuacion: Number,
  respuestasCorrectas: Number,
  tiempoPromedio: Number,
  premiosObtenidos: [String],
  fechaParticipacion: { type: Date, default: Date.now }
});

const Torneo = mongoose.model('Torneo', torneoSchema);
const ResultadoTorneo = mongoose.model('ResultadoTorneo', resultadoTorneoSchema);

// GET todos los torneos
router.get('/', async (req, res) => {
  try {
    const { estado, tipo, dificultad, categoria } = req.query;
    const query = {};
    
    if (estado) query.estado = estado;
    if (tipo) query.tipo = tipo;
    if (dificultad) query.dificultad = dificultad;
    if (categoria) query.categoria = categoria;
    
    const torneos = await Torneo.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(torneos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET torneo por ID
router.get('/:id', async (req, res) => {
  try {
    const torneo = await Torneo.findById(req.params.id);
    if (!torneo) return res.status(404).json({ error: 'Torneo no encontrado' });
    res.json(torneo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear nuevo torneo
router.post('/', async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      creadorId,
      creadorNombre,
      tipo,
      dificultad,
      categoria,
      maxParticipantes,
      duracionHoras,
      esPrivado,
      codigoAcceso,
      premios
    } = req.body;
    
    const fechaFin = new Date();
    fechaFin.setHours(fechaFin.getHours() + (duracionHoras || 24));
    
    const nuevoTorneo = new Torneo({
      nombre,
      descripcion,
      creadorId,
      creadorNombre,
      tipo: tipo || 'puntos',
      dificultad: dificultad || 'mixta',
      categoria,
      fechaFin,
      maxParticipantes: maxParticipantes || 10,
      esPrivado: esPrivado || false,
      codigoAcceso: esPrivado ? codigoAcceso : undefined,
      requiereCodigo: esPrivado || false,
      premios: premios || [
        { posicion: 1, premio: 'Medalla de Oro', puntos: 1000 },
        { posicion: 2, premio: 'Medalla de Plata', puntos: 500 },
        { posicion: 3, premio: 'Medalla de Bronce', puntos: 250 }
      ]
    });
    
    await nuevoTorneo.save();
    res.status(201).json(nuevoTorneo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST unirse a torneo
router.post('/:id/unirse', async (req, res) => {
  try {
    const { usuarioId, nombre, codigoAcceso } = req.body;
    const torneo = await Torneo.findById(req.params.id);
    
    if (!torneo) return res.status(404).json({ error: 'Torneo no encontrado' });
    
    // Verificar si ya está en el torneo
    const yaParticipa = torneo.participantes.some(p => p.usuarioId === usuarioId);
    if (yaParticipa) {
      return res.status(400).json({ error: 'Ya estás en este torneo' });
    }
    
    // Verificar código de acceso si es privado
    if (torneo.esPrivado && torneo.codigoAcceso !== codigoAcceso) {
      return res.status(403).json({ error: 'Código de acceso incorrecto' });
    }
    
    // Verificar si hay cupo
    if (torneo.participantesActuales >= torneo.maxParticipantes) {
      return res.status(400).json({ error: 'El torneo está lleno' });
    }
    
    // Verificar si el torneo está activo
    if (torneo.estado !== 'activo') {
      return res.status(400).json({ error: 'El torneo no está activo' });
    }
    
    // Agregar participante
    torneo.participantes.push({
      usuarioId,
      nombre: nombre || `Usuario ${usuarioId}`,
      puntuacion: 0,
      respuestasCorrectas: 0,
      tiempoPromedio: 0,
      fechaUnion: new Date()
    });
    
    torneo.participantesActuales += 1;
    await torneo.save();
    
    res.json({ 
      success: true, 
      message: 'Te has unido al torneo exitosamente',
      torneo 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST abandonar torneo
router.post('/:id/abandonar', async (req, res) => {
  try {
    const { usuarioId } = req.body;
    const torneo = await Torneo.findById(req.params.id);
    
    if (!torneo) return res.status(404).json({ error: 'Torneo no encontrado' });
    
    // Remover participante
    const index = torneo.participantes.findIndex(p => p.usuarioId === usuarioId);
    if (index === -1) {
      return res.status(400).json({ error: 'No estás en este torneo' });
    }
    
    torneo.participantes.splice(index, 1);
    torneo.participantesActuales = Math.max(0, torneo.participantesActuales - 1);
    await torneo.save();
    
    res.json({ 
      success: true, 
      message: 'Has abandonado el torneo exitosamente' 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET leaderboard de un torneo
router.get('/:id/leaderboard', async (req, res) => {
  try {
    const torneo = await Torneo.findById(req.params.id);
    if (!torneo) return res.status(404).json({ error: 'Torneo no encontrado' });
    
    // Ordenar participantes por puntuación (descendente)
    const leaderboard = torneo.participantes
      .sort((a, b) => b.puntuacion - a.puntuacion)
      .map((participante, index) => ({
        posicion: index + 1,
        usuarioId: participante.usuarioId,
        nombre: participante.nombre,
        puntuacion: participante.puntuacion,
        tiempoPromedio: participante.tiempoPromedio || '0s',
        respuestasCorrectas: participante.respuestasCorrectas || 0,
        fechaUnion: participante.fechaUnion
      }));
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST registrar resultado de trivia en torneo
router.post('/:id/registrar-resultado', async (req, res) => {
  try {
    const { usuarioId, puntuacion, respuestasCorrectas, tiempoPromedio } = req.body;
    const torneo = await Torneo.findById(req.params.id);
    
    if (!torneo) return res.status(404).json({ error: 'Torneo no encontrado' });
    
    // Encontrar participante
    const participante = torneo.participantes.find(p => p.usuarioId === usuarioId);
    if (!participante) {
      return res.status(400).json({ error: 'No estás en este torneo' });
    }
    
    // Actualizar estadísticas
    participante.puntuacion += puntuacion || 0;
    participante.respuestasCorrectas += respuestasCorrectas || 0;
    
    // Actualizar tiempo promedio
    if (tiempoPromedio) {
      const tiemposPrevios = participante.tiempoPromedio || 0;
      const totalJuegos = torneo.participantes.filter(p => p.usuarioId === usuarioId).length;
      participante.tiempoPromedio = (tiemposPrevios + tiempoPromedio) / (totalJuegos + 1);
    }
    
    await torneo.save();
    
    res.json({ 
      success: true, 
      message: 'Resultado registrado exitosamente',
      participante 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET torneos de un usuario
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    // Encontrar torneos donde el usuario participa
    const torneos = await Torneo.find({
      'participantes.usuarioId': usuarioId
    });
    
    // Encontrar resultados históricos
    const resultados = await ResultadoTorneo.find({ usuarioId })
      .populate('torneoId', 'nombre')
      .sort({ fechaParticipacion: -1 });
    
    const historial = resultados.map(resultado => ({
      torneoId: resultado.torneoId?._id,
      torneoNombre: resultado.torneoId?.nombre || 'Torneo eliminado',
      posicion: resultado.posicion,
      puntuacion: resultado.puntuacion,
      fecha: resultado.fechaParticipacion,
      premios: resultado.premiosObtenidos || []
    }));
    
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;