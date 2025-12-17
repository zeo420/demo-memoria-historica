// seed.js - Script para poblar la base de datos con datos iniciales
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/memoria-historica');

// Definir schemas (repetir del server.js)
const EventoSchema = new mongoose.Schema({
  titulo: String,
  fecha: Date,
  descripcion: String,
  categoria: String,
  pais: String,
  imagen: String,
  videoUrl: String,
  fuentes: [String],
  coordenadas: { lat: Number, lng: Number }
});

const PreguntaSchema = new mongoose.Schema({
  pregunta: String,
  opciones: [String],
  respuestaCorrecta: Number,
  dificultad: String,
  categoria: String,
  puntos: Number
});

const Evento = mongoose.model('Evento', EventoSchema);
const Pregunta = mongoose.model('Pregunta', PreguntaSchema);

// Datos de eventos históricos de Colombia
const eventosHistoricos = [
  {
    titulo: "Proceso de Paz con las FARC",
    fecha: new Date("2016-09-26"),
    descripcion: "Firma del acuerdo de paz entre el gobierno colombiano y las FARC-EP, poniendo fin a más de 50 años de conflicto armado.",
    categoria: "politico",
    pais: "Colombia",
    imagen: "https://example.com/paz.jpg",
    coordenadas: { lat: 4.711, lng: -74.072 },
    fuentes: ["https://www.bbc.com/mundo/noticias-america-latina-37491036"]
  },
  {
    titulo: "Bogotazo",
    fecha: new Date("1948-04-09"),
    descripcion: "Revueltas y disturbios en Bogotá tras el asesinato del líder liberal Jorge Eliécer Gaitán, marcando el inicio de La Violencia.",
    categoria: "conflicto",
    pais: "Colombia",
    coordenadas: { lat: 4.598, lng: -74.076 },
    fuentes: ["https://www.banrepcultural.org/biblioteca-virtual/credencial-historia/numero-220/el-bogotazo"]
  },
  {
    titulo: "Constitución de 1991",
    fecha: new Date("1991-07-04"),
    descripcion: "Promulgación de la nueva Constitución Política de Colombia, considerada una de las más garantistas de América Latina.",
    categoria: "politico",
    pais: "Colombia",
    coordenadas: { lat: 4.598, lng: -74.076 },
    fuentes: ["https://www.constitucioncolombia.com/"]
  },
  {
    titulo: "Toma del Palacio de Justicia",
    fecha: new Date("1985-11-06"),
    descripcion: "El grupo guerrillero M-19 tomó el Palacio de Justicia en Bogotá, resultando en un trágico desenlace con múltiples víctimas.",
    categoria: "conflicto",
    pais: "Colombia",
    coordenadas: { lat: 4.596, lng: -74.076 },
    fuentes: ["https://www.eltiempo.com/archivo/documento/MAM-56789"]
  },
  {
    titulo: "Asesinato de Luis Carlos Galán",
    fecha: new Date("1989-08-18"),
    descripcion: "Asesinato del candidato presidencial Luis Carlos Galán en Soacha, uno de los crímenes políticos más impactantes de Colombia.",
    categoria: "conflicto",
    pais: "Colombia",
    coordenadas: { lat: 4.582, lng: -74.217 },
    fuentes: ["https://www.semana.com/nacion/articulo/luis-carlos-galan/"]
  },
  {
    titulo: "Creación de las AUC",
    fecha: new Date("1997-04-18"),
    descripcion: "Consolidación de las Autodefensas Unidas de Colombia, grupo paramilitar que marcó el conflicto armado colombiano.",
    categoria: "conflicto",
    pais: "Colombia",
    fuentes: ["https://verdadabierta.com/"]
  },
  {
    titulo: "Proceso 8000",
    fecha: new Date("1995-06-21"),
    descripcion: "Investigación sobre la infiltración de dineros del narcotráfico en la campaña presidencial de Ernesto Samper.",
    categoria: "politico",
    pais: "Colombia",
    fuentes: ["https://www.elespectador.com/"]
  },
  {
    titulo: "Festival de Rock al Parque",
    fecha: new Date("1995-07-01"),
    descripcion: "Inicio del festival de música gratuito más importante de Colombia y uno de los más grandes de Latinoamérica.",
    categoria: "cultural",
    pais: "Colombia",
    coordenadas: { lat: 4.661, lng: -74.099 },
    fuentes: ["https://rockalparque.gov.co/"]
  }
];

// Preguntas de trivia
const preguntasTrivia = [
  {
    pregunta: "¿En qué año se firmó el acuerdo de paz con las FARC?",
    opciones: ["2014", "2015", "2016", "2017"],
    respuestaCorrecta: 2,
    dificultad: "facil",
    categoria: "politico",
    puntos: 10
  },
  {
    pregunta: "¿Quién fue el líder liberal asesinado que desencadenó el Bogotazo?",
    opciones: ["Jorge Eliécer Gaitán", "Alfonso López", "Carlos Lleras", "Alberto Lleras"],
    respuestaCorrecta: 0,
    dificultad: "medio",
    categoria: "conflicto",
    puntos: 15
  },
  {
    pregunta: "¿En qué año se promulgó la Constitución de 1991?",
    opciones: ["1989", "1990", "1991", "1992"],
    respuestaCorrecta: 2,
    dificultad: "facil",
    categoria: "politico",
    puntos: 10
  },
  {
    pregunta: "¿Qué grupo guerrillero tomó el Palacio de Justicia en 1985?",
    opciones: ["FARC", "ELN", "M-19", "EPL"],
    respuestaCorrecta: 2,
    dificultad: "medio",
    categoria: "conflicto",
    puntos: 15
  },
  {
    pregunta: "¿En qué municipio fue asesinado Luis Carlos Galán?",
    opciones: ["Bogotá", "Soacha", "Medellín", "Cali"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    categoria: "conflicto",
    puntos: 15
  },
  {
    pregunta: "¿Cuántos años aproximadamente duró el conflicto armado con las FARC?",
    opciones: ["30 años", "40 años", "50 años", "60 años"],
    respuestaCorrecta: 2,
    dificultad: "medio",
    categoria: "conflicto",
    puntos: 15
  },
  {
    pregunta: "¿Qué presidente firmó el acuerdo de paz con las FARC?",
    opciones: ["Álvaro Uribe", "Juan Manuel Santos", "Andrés Pastrana", "César Gaviria"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    categoria: "politico",
    puntos: 10
  },
  {
    pregunta: "¿En qué año fue la Toma del Palacio de Justicia?",
    opciones: ["1983", "1984", "1985", "1986"],
    respuestaCorrecta: 2,
    dificultad: "medio",
    categoria: "conflicto",
    puntos: 15
  },
  {
    pregunta: "¿Qué escándalo político afectó al presidente Ernesto Samper?",
    opciones: ["Proceso 8000", "Carrusel de contratos", "Yidispolítica", "Agro Ingreso Seguro"],
    respuestaCorrecta: 0,
    dificultad: "dificil",
    categoria: "politico",
    puntos: 20
  },
  {
    pregunta: "¿Cuál es el festival de música gratuito más grande de Colombia?",
    opciones: ["Estereo Picnic", "Rock al Parque", "Festival de Verano", "Festival Vallenato"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    categoria: "cultural",
    puntos: 10
  }
];

async function seed() {
  try {
    console.log('🌱 Limpiando base de datos...');
    await Evento.deleteMany({});
    await Pregunta.deleteMany({});
    
    console.log('📚 Insertando eventos históricos...');
    await Evento.insertMany(eventosHistoricos);
    
    console.log('❓ Insertando preguntas de trivia...');
    await Pregunta.insertMany(preguntasTrivia);
    
    console.log('✅ Base de datos poblada exitosamente!');
    console.log(`   - ${eventosHistoricos.length} eventos históricos`);
    console.log(`   - ${preguntasTrivia.length} preguntas de trivia`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

seed();