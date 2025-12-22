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

const VideoSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  youtubeId: String,
  duracion: Number,
  categoria: String,
  vistas: { type: Number, default: 0 },
  likes: [String]
});

const PersonajeSchema = new mongoose.Schema({
  nombre: String,
  nombreCompleto: String,
  fechaNacimiento: Date,
  fechaMuerte: Date,
  lugarNacimiento: String,
  pais: String,
  ambito: String,
  profesiones: [String],
  biografia: String,
  logrosDestacados: [String],
  frasesCelebres: [{ frase: String, contexto: String }],
  imagen: String,
  legado: String,
  cronologia: [{ año: Number, evento: String, descripcion: String }],
  fuentes: [String]
});

const NarrativaSchema = new mongoose.Schema({
  titulo: String,
  subtitulo: String,
  descripcionCorta: String,
  ambito: String,
  categoria: String,
  imagen: String,
  duracionEstimada: Number,
  capitulos: [{
    numero: Number,
    titulo: String,
    contenido: String,
    imagenes: [String]
  }]
});

const PodcastSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  ambito: String,
  categoria: String,
  duracion: Number,
  audioUrl: String,
  imagenPortada: String,
  temporada: Number,
  episodio: Number,
  escuchas: { type: Number, default: 0 }
});

const Evento = mongoose.model('Evento', EventoSchema);
const Pregunta = mongoose.model('Pregunta', PreguntaSchema);
const Video = mongoose.model('Video', VideoSchema);
const Personaje = mongoose.model('Personaje', PersonajeSchema);
const Narrativa = mongoose.model('Narrativa', NarrativaSchema);
const Podcast = mongoose.model('Podcast', PodcastSchema);

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
  },
  {
    pregunta: "¿En qué año se fundó Santa Marta, la primera ciudad española en Colombia?",
    opciones: ["1510", "1525", "1536", "1538"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    categoria: "historico",
    puntos: 15
  },
  {
    pregunta: "¿Qué cultura precolombina era famosa por su orfebrería, especialmente los poporos?",
    opciones: ["Muisca", "Quimbaya", "Tayrona", "San Agustín"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    categoria: "cultural",
    puntos: 15
  },
  {
    pregunta: "¿En qué año se produjo la Masacre de las Bananeras?",
    opciones: ["1922", "1928", "1930", "1945"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    categoria: "conflicto",
    puntos: 15
  },
  {
    pregunta: "¿Qué presidente colombiano ganó el Premio Nobel de Literatura?",
    opciones: ["Miguel Antonio Caro", "Juan Manuel Santos", "Álvaro Uribe", "Ninguno ganó Nobel"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    categoria: "cultural",
    puntos: 10
  },
  {
    pregunta: "¿En qué año se creó oficialmente el Frente Nacional?",
    opciones: ["1956", "1958", "1960", "1962"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    categoria: "politico",
    puntos: 15
  },
  {
    pregunta: "¿Qué batalla aseguró la independencia de Colombia?",
    opciones: ["Batalla de Ayacucho", "Batalla de Boyacá", "Batalla de Carabobo", "Batalla de Pichincha"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    categoria: "historico",
    puntos: 10
  },
  {
    pregunta: "¿En qué año se separó Panamá de Colombia?",
    opciones: ["1899", "1901", "1903", "1905"],
    respuestaCorrecta: 2,
    dificultad: "facil",
    categoria: "politico",
    puntos: 10
  },
  {
    pregunta: "¿Qué autor colombiano ganó el Nobel de Literatura en 1982?",
    opciones: ["Álvaro Mutis", "Gabriel García Márquez", "Rafael Pombo", "José Asunción Silva"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    categoria: "cultural",
    puntos: 10
  },
  {
    pregunta: "¿Cuál fue el primer nombre de la capital de Colombia?",
    opciones: ["Bacatá", "Santafé de Bogotá", "Nueva Granada", "Santafé"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    categoria: "historico",
    puntos: 15
  },
  {
    pregunta: "¿En qué año ocurrió la tragedia de Armero?",
    opciones: ["1983", "1985", "1986", "1988"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    categoria: "social",
    puntos: 15
  },
  {
    pregunta: "¿Qué grupo paramilitar se desmovilizó en 2003-2006?",
    opciones: ["FARC", "ELN", "AUC", "M-19"],
    respuestaCorrecta: 2,
    dificultad: "medio",
    categoria: "conflicto",
    puntos: 15
  },
  {
    pregunta: "¿En qué año se abolió completamente la esclavitud en Colombia?",
    opciones: ["1819", "1849", "1851", "1863"],
    respuestaCorrecta: 2,
    dificultad: "dificil",
    categoria: "social",
    puntos: 20
  },
  {
    pregunta: "¿Qué presidente implementó la 'Revolución en Marcha'?",
    opciones: ["Enrique Olaya Herrera", "Alfonso López Pumarejo", "Laureano Gómez", "Mariano Ospina Pérez"],
    respuestaCorrecta: 1,
    dificultad: "dificil",
    categoria: "politico",
    puntos: 20
  },
  {
    pregunta: "¿En qué año se inauguró el Museo del Oro en Bogotá?",
    opciones: ["1959", "1967", "1974", "1982"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    categoria: "cultural",
    puntos: 15
  },
  {
    pregunta: "¿Qué conflicto internacional tuvo Colombia con Perú en 1932-1933?",
    opciones: ["Guerra del Amazonas", "Conflicto de Leticia", "Guerra del Putumayo", "Conflicto Amazónico"],
    respuestaCorrecta: 1,
    dificultad: "dificil",
    categoria: "politico",
    puntos: 20
  },
  {
    pregunta: "¿En qué año Colombia participó en la Guerra de Corea?",
    opciones: ["1950-1951", "1951-1953", "1953-1955", "No participó"],
    respuestaCorrecta: 1,
    dificultad: "dificil",
    categoria: "historico",
    puntos: 20
  },
  {
    pregunta: "¿Qué constitución estableció el federalismo en Colombia?",
    opciones: ["Constitución de 1863", "Constitución de 1886", "Constitución de 1991", "Constitución de 1832"],
    respuestaCorrecta: 0,
    dificultad: "medio",
    categoria: "politico",
    puntos: 15
  },
  {
    pregunta: "¿En qué año ocurrió la toma de la Embajada de República Dominicana por el M-19?",
    opciones: ["1978", "1980", "1982", "1984"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    categoria: "conflicto",
    puntos: 15
  },
  {
    pregunta: "¿Quién fue el primer presidente elegido tras el Frente Nacional?",
    opciones: ["Misael Pastrana", "Alfonso López Michelsen", "Julio César Turbay", "Belisario Betancur"],
    respuestaCorrecta: 1,
    dificultad: "dificil",
    categoria: "politico",
    puntos: 20
  },
  {
    pregunta: "¿En qué año se estableció el Plan Colombia?",
    opciones: ["1998", "2000", "2002", "2004"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    categoria: "politico",
    puntos: 15
  },
  {
    pregunta: "¿Qué movimiento guerrillero se desmovilizó en 1990 tras un acuerdo de paz?",
    opciones: ["FARC", "ELN", "M-19", "EPL"],
    respuestaCorrecta: 2,
    dificultad: "medio",
    categoria: "conflicto",
    puntos: 15
  },
  {
    pregunta: "¿En qué año ocurrió la Operación Jaque?",
    opciones: ["2006", "2007", "2008", "2009"],
    respuestaCorrecta: 2,
    dificultad: "medio",
    categoria: "conflicto",
    puntos: 15
  },
  {
    pregunta: "¿Quién fue el primer presidente de izquierda elegido en Colombia?",
    opciones: ["Gustavo Petro", "Jorge Eliécer Gaitán", "Ernesto Samper", "Álvaro Uribe"],
    respuestaCorrecta: 0,
    dificultad: "facil",
    categoria: "politico",
    puntos: 10
  },
  {
    pregunta: "¿En qué año se realizó el plebiscito por los acuerdos de paz con las FARC?",
    opciones: ["2014", "2015", "2016", "2017"],
    respuestaCorrecta: 2,
    dificultad: "facil",
    categoria: "politico",
    puntos: 10
  },
  {
    pregunta: "¿Qué cultura precolombina construyó la Ciudad Perdida?",
    opciones: ["Muisca", "Quimbaya", "Tayrona", "San Agustín"],
    respuestaCorrecta: 2,
    dificultad: "medio",
    categoria: "cultural",
    puntos: 15
  },
  {
    pregunta: "¿En qué año se fundó el ELN?",
    opciones: ["1960", "1962", "1964", "1966"],
    respuestaCorrecta: 2,
    dificultad: "medio",
    categoria: "conflicto",
    puntos: 15
  },
  {
    pregunta: "¿Qué presidente colombiano fue asesinado durante el conflicto bipartidista?",
    opciones: ["Rafael Uribe Uribe", "Jorge Eliécer Gaitán", "Rafael Reyes", "Ninguno fue asesinado"],
    respuestaCorrecta: 3,
    dificultad: "dificil",
    categoria: "conflicto",
    puntos: 20
  },
  {
    pregunta: "¿En qué año se descubrió América?",
    opciones: ["1492", "1498", "1499", "1500"],
    respuestaCorrecta: 0,
    dificultad: "facil",
    categoria: "historico",
    puntos: 10
  },
  {
    pregunta: "¿Qué departamento colombiano tiene costa en dos océanos?",
    opciones: ["Chocó", "Antioquia", "La Guajira", "Chocó y La Guajira"],
    respuestaCorrecta: 3,
    dificultad: "medio",
    categoria: "geografico",
    puntos: 15
  },
  {
    pregunta: "¿En qué año se creó la Real Audiencia del Nuevo Reino de Granada?",
    opciones: ["1538", "1549", "1564", "1717"],
    respuestaCorrecta: 1,
    dificultad: "dificil",
    categoria: "historico",
    puntos: 20
  },
  {
    pregunta: "¿Quién lideró la Rebelión de los Comuneros?",
    opciones: ["José Antonio Galán", "Manuela Beltrán", "Antonio Nariño", "Manuela Beltrán y José Antonio Galán"],
    respuestaCorrecta: 3,
    dificultad: "medio",
    categoria: "historico",
    puntos: 15
  },
  {
    pregunta: "¿En qué año se fundó la Universidad Nacional de Colombia?",
    opciones: ["1864", "1867", "1886", "1905"],
    respuestaCorrecta: 1,
    dificultad: "dificil",
    categoria: "cultural",
    puntos: 20
  },
  {
    pregunta: "¿Qué presidente implementó la 'Seguridad Democrática'?",
    opciones: ["Andrés Pastrana", "Álvaro Uribe", "Juan Manuel Santos", "Ernesto Samper"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    categoria: "politico",
    puntos: 10
  },
  {
    pregunta: "¿En qué año se realizaron los diálogos de paz del Caguán?",
    opciones: ["1997-1998", "1998-2002", "2002-2006", "2006-2010"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    categoria: "politico",
    puntos: 15
  },
  {
    pregunta: "¿Qué presidente colombiano fue exonerado por el Congreso durante el Proceso 8000?",
    opciones: ["César Gaviria", "Ernesto Samper", "Andrés Pastrana", "Álvaro Uribe"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    categoria: "politico",
    puntos: 15
  },
  {
    pregunta: "¿En qué año se estableció el Virreinato de Nueva Granada?",
    opciones: ["1717", "1739", "1776", "1789"],
    respuestaCorrecta: 0,
    dificultad: "medio",
    categoria: "historico",
    puntos: 15
  },
  {
    pregunta: "¿Qué río colombiano es el principal afluente del Amazonas?",
    opciones: ["Río Magdalena", "Río Caquetá", "Río Putumayo", "Río Amazonas"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    categoria: "geografico",
    puntos: 15
  },
  {
    pregunta: "¿En qué año se realizó la primera transmisión de televisión en Colombia?",
    opciones: ["1953", "1954", "1955", "1956"],
    respuestaCorrecta: 1,
    dificultad: "dificil",
    categoria: "cultural",
    puntos: 20
  },
  {
    pregunta: "¿Quién fue el primer presidente elegido por voto popular directo?",
    opciones: ["Mariano Ospina Pérez", "Laureano Gómez", "Gustavo Rojas Pinilla", "Alberto Lleras Camargo"],
    respuestaCorrecta: 3,
    dificultad: "dificil",
    categoria: "politico",
    puntos: 20
  },
  {
    pregunta: "¿En qué año se creó la OEA y Colombia fue miembro fundador?",
    opciones: ["1945", "1948", "1951", "1960"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    categoria: "politico",
    puntos: 15
  },
  {
    pregunta: "¿Qué departamento colombiano fue el último en crearse?",
    opciones: ["Vichada", "Guainía", "Vaupés", "No hay consenso"],
    respuestaCorrecta: 3,
    dificultad: "dificil",
    categoria: "geografico",
    puntos: 20
  },
  {
    pregunta: "¿En qué año se celebró la primera Copa América ganada por Colombia?",
    opciones: ["1999", "2001", "2014", "2016"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    categoria: "cultural",
    puntos: 10
  },
  {
    pregunta: "¿Qué héroe de la independencia es conocido como 'El Precursor'?",
    opciones: ["Simón Bolívar", "Francisco de Paula Santander", "Antonio Nariño", "Camilo Torres"],
    respuestaCorrecta: 2,
    dificultad: "medio",
    categoria: "historico",
    puntos: 15
  }
];

// Videos educativos
const videosEducativos = [
  {
    titulo: "Historia del Conflicto Armado en Colombia",
    descripcion: "Documental completo sobre los orígenes y desarrollo del conflicto armado colombiano desde mediados del siglo XX.",
    youtubeId: "d-nygSucq20", // Reemplazar con IDs reales
    categoria: "conflicto"
  },
  {
    titulo: "El Proceso de Paz con las FARC",
    descripcion: "Análisis del proceso de negociación de paz en La Habana y la firma del acuerdo de 2016.",
    youtubeId: "YKmVbr3fRg0",
    categoria: "politico"
  },
  {
    titulo: "La Constitución de 1991: Una Nueva Colombia",
    descripcion: "Contexto histórico y principales cambios que trajo la Constitución Política de 1991.",
    youtubeId: "m-4UzHge7V8",
    categoria: "politico"
  },
  {
    titulo: "El Bogotazo y La Violencia",
    descripcion: "Los hechos del 9 de abril de 1948 y su impacto en la historia colombiana.",
    youtubeId: "FPTMx2GQjxM",
    categoria: "conflicto"
  },
  {
    titulo: "Movimientos Sociales en Colombia",
    descripcion: "Historia de las luchas sociales y movimientos populares en Colombia durante el siglo XX.",
    youtubeId: "5zE4Rx-M2PQ",
    categoria: "social"
  },
  {
    titulo: "La Cultura Colombiana a través de los Años",
    descripcion: "Evolución de la música, arte y tradiciones colombianas.",
    youtubeId: "g2CiCEfn9dk",
    categoria: "cultural"
  },
  {
    titulo: 'La Independencia de Colombia - Documental Completo',
    descripcion: 'Documental histórico sobre el proceso de independencia de Colombia, desde el Grito de Independencia hasta la Batalla de Boyacá.',
    youtubeId: '1VbNrHuBVQw', // Reemplaza con tu ID real
    categoria: 'politico',
  },
  {
    titulo: 'Gabriel García Márquez: Vida y Obra',
    descripcion: 'Biografía del Premio Nobel colombiano y análisis de su obra literaria más importante.',
    youtubeId: 'oUlalTgTpgE', // Reemplaza con tu ID real
    categoria: 'cultural',
  },
  {
    titulo: 'Movimientos Sociales en Colombia: Del Paro Nacional a la Transformación',
    descripcion: 'Documental sobre las protestas sociales en Colombia y su impacto en la política nacional.',
    youtubeId: '2fSPGF1SyXE', // Reemplaza con tu ID real
    categoria: 'social',
  },
  {
    titulo: 'Historia Económica de Colombia: Del Café al Petróleo',
    descripcion: 'Análisis de la evolución económica de Colombia y los factores que han moldeado su desarrollo.',
    youtubeId: 'TVIMI7Z_Z_s', // Reemplaza con tu ID real
    categoria: 'economico',
  },
  {
    titulo: 'La Guerra de los Mil Días - Documental Histórico',
    descripcion: 'Reconstrucción de la guerra civil que marcó el inicio del siglo XX en Colombia.',
    youtubeId: 'DAvVQ5wEJMg', // Reemplaza con tu ID real
    categoria: 'conflicto',
  },
  {
    titulo: 'Cultura Afrocolombiana: Raíces y Expresiones',
    descripcion: 'Documental sobre la influencia y contribuciones de la cultura afro en Colombia.',
    youtubeId: 'ZDQRf3ToSZQ', // Reemplaza con tu ID real
    categoria: 'cultural',
  },
  {
    titulo: 'Revolución Liberal de 1930: Modernización de Colombia',
    descripcion: 'Análisis de las reformas liberales que transformaron la sociedad colombiana en el siglo XX.',
    youtubeId: '99k9hczHmtc', // Reemplaza con tu ID real
    categoria: 'politico',
  },
  {
    titulo: 'Indígenas Colombianos: Guardianes del Territorio y la Cultura',
    descripcion: 'Documental sobre las comunidades indígenas de Colombia y su lucha por la preservación cultural.',
    youtubeId: 'fKwV8Xzh5oc', // Reemplaza con tu ID real
    categoria: 'social',
  }
];

// Personajes históricos
const personajesHistoricos = [
  // COLOMBIA - Nacional
  {
    nombre: "Gabriel García Márquez",
    nombreCompleto: "Gabriel José de la Concordia García Márquez",
    fechaNacimiento: new Date("1927-03-06"),
    fechaMuerte: new Date("2014-04-17"),
    lugarNacimiento: "Aracataca, Magdalena",
    pais: "Colombia",
    ambito: "mundial",
    profesiones: ["Escritor", "Periodista", "Guionista"],
    biografia: "Escritor colombiano, premio Nobel de Literatura 1982. Máximo exponente del realismo mágico y uno de los autores más significativos del siglo XX. Su obra 'Cien años de soledad' es considerada una obra maestra de la literatura universal.",
    logrosDestacados: [
      "Premio Nobel de Literatura (1982)",
      "Autor de 'Cien años de soledad' (1967)",
      "Premio Rómulo Gallegos (1972)",
      "Cofundador de la Fundación para el Nuevo Periodismo Iberoamericano"
    ],
    frasesCelebres: [
      { frase: "La vida no es la que uno vivió, sino la que uno recuerda y cómo la recuerda para contarla", contexto: "Vivir para contarla" },
      { frase: "Siempre habrá un 'después' para todos nosotros", contexto: "El amor en los tiempos del cólera" }
    ],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Gabriel_Garcia_Marquez.jpg/220px-Gabriel_Garcia_Marquez.jpg",
    cronologia: [
      { año: 1927, evento: "Nacimiento", descripcion: "Nace en Aracataca, Magdalena" },
      { año: 1967, evento: "Cien años de soledad", descripcion: "Publica su obra cumbre" },
      { año: 1982, evento: "Premio Nobel", descripcion: "Recibe el Premio Nobel de Literatura" },
      { año: 2014, evento: "Fallecimiento", descripcion: "Muere en Ciudad de México" }
    ],
    legado: "Su obra transformó la literatura latinoamericana y mundial, consolidando el realismo mágico como movimiento literario.",
    fuentes: ["https://www.banrepcultural.org/biblioteca-virtual/credencial-historia/gabriel-garcia-marquez"]
  },

  {
    nombre: "Policarpa Salavarrieta",
    nombreCompleto: "Policarpa Salavarrieta Ríos",
    fechaNacimiento: new Date("1795-01-26"),
    fechaMuerte: new Date("1817-11-14"),
    lugarNacimiento: "Guaduas, Cundinamarca",
    pais: "Colombia",
    ambito: "nacional",
    profesiones: ["Espía", "Heroína de la Independencia"],
    biografia: "Heroína de la independencia colombiana, conocida como 'La Pola'. Fue una espía crucial para el ejército patriota durante la reconquista española. Su valentía y sacrificio la convirtieron en símbolo de la lucha por la libertad.",
    logrosDestacados: [
      "Espía de las fuerzas independentistas",
      "Reclutadora de soldados patriotas",
      "Símbolo de la resistencia femenina",
      "Primera mujer en aparecer en billetes colombianos"
    ],
    frasesCelebres: [
      { frase: "¡Pueblo indolente! ¡Cuán distinta sería hoy vuestra suerte si conocierais el precio de la libertad!", contexto: "Antes de su fusilamiento" }
    ],
    imagen: "https://commons.wikimedia.org/wiki/File:La_Hero%C3%ADna_Policarpa_Salavarrieta.jpg",
    cronologia: [
      { año: 1795, evento: "Nacimiento", descripcion: "Nace en Guaduas, Cundinamarca" },
      { año: 1816, evento: "Trabajo de espionaje", descripcion: "Inicia labores de espionaje para los patriotas" },
      { año: 1817, evento: "Captura y ejecución", descripcion: "Es capturada y fusilada por los españoles a los 22 años" }
    ],
    legado: "Símbolo de la participación femenina en la independencia y del valor ante la adversidad.",
    fuentes: ["https://www.banrepcultural.org/biblioteca-virtual/credencial-historia/policarpa-salavarrieta"]
  },

  {
    nombre: "Francisco de Paula Santander",
    nombreCompleto: "Francisco José de Paula Santander y Omaña",
    fechaNacimiento: new Date("1792-04-02"),
    fechaMuerte: new Date("1840-05-06"),
    lugarNacimiento: "Villa del Rosario, Cúcuta",
    pais: "Colombia",
    ambito: "nacional",
    profesiones: ["Militar", "Político", "Abogado"],
    biografia: "Militar y estadista colombiano, conocido como 'El Hombre de las Leyes'. Fue vicepresidente de la Gran Colombia y presidente de la Nueva Granada. Organizó el sistema educativo y jurídico del país.",
    logrosDestacados: [
      "Vicepresidente de la Gran Colombia (1819-1827)",
      "Presidente de la Nueva Granada (1832-1837)",
      "Organizador del sistema educativo colombiano",
      "Fundador de la Universidad Nacional de Colombia"
    ],
    frasesCelebres: [
      { frase: "Las armas os han dado la independencia, las leyes os darán la libertad", contexto: "Discurso presidencial" }
    ],
    imagen: "https://commons.wikimedia.org/wiki/File:%27Francisco_de_Paula_Santander%27_(n.d.)_by_Constantino_Carvajal_Quintero_-_Museo_de_Antioquia_-_Medell%C3%ADn_-_Colombia_2024.jpg",
    cronologia: [
      { año: 1792, evento: "Nacimiento", descripcion: "Nace en Villa del Rosario" },
      { año: 1819, evento: "Batalla de Boyacá", descripcion: "Participa en la batalla decisiva de la independencia" },
      { año: 1819, evento: "Vicepresidente", descripcion: "Es nombrado vicepresidente de la Gran Colombia" },
      { año: 1832, evento: "Presidente", descripcion: "Elegido presidente de la Nueva Granada" },
      { año: 1840, evento: "Fallecimiento", descripcion: "Muere en Bogotá" }
    ],
    legado: "Fundador del Estado de derecho en Colombia y organizador de las instituciones republicanas.",
    fuentes: ["https://www.banrepcultural.org/biblioteca-virtual/francisco-de-paula-santander"]
  },

  {
    nombre: "Fernando Botero",
    nombreCompleto: "Fernando Botero Angulo",
    fechaNacimiento: new Date("1932-04-19"),
    fechaMuerte: new Date("2023-09-15"),
    lugarNacimiento: "Medellín, Antioquia",
    pais: "Colombia",
    ambito: "mundial",
    profesiones: ["Pintor", "Escultor", "Dibujante"],
    biografia: "Artista colombiano reconocido internacionalmente por su estilo único caracterizado por figuras voluminosas. Es considerado el artista vivo más cotizado de Latinoamérica durante varias décadas.",
    logrosDestacados: [
      "Exposiciones en los museos más importantes del mundo",
      "Donación de más de 300 obras a Colombia",
      "Creador del estilo 'Boterismo'",
      "Premio Fernando Botero (1952)"
    ],
    frasesCelebres: [
      { frase: "Exagero todo para poder comunicar la sensualidad de las formas", contexto: "Sobre su estilo artístico" }
    ],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Fernando_Botero_2010.jpg/220px-Fernando_Botero_2010.jpg",
    cronologia: [
      { año: 1932, evento: "Nacimiento", descripcion: "Nace en Medellín" },
      { año: 1952, evento: "Primer premio", descripcion: "Gana segundo premio en el IX Salón Nacional de Artistas" },
      { año: 1964, evento: "Primera escultura", descripcion: "Incursiona en el campo escultórico" },
      { año: 2000, evento: "Donación", descripcion: "Dona 123 obras al Banco de la República" },
      { año: 2023, evento: "Fallecimiento", descripcion: "Muere en Mónaco" }
    ],
    legado: "Creador de un estilo único reconocible mundialmente, embajador del arte colombiano.",
    fuentes: ["https://www.banrepcultural.org/coleccion-de-arte/artista/fernando-botero"]
  },

  {
    nombre: "Antonio Nariño",
    nombreCompleto: "Antonio Amador José de Nariño y Álvarez",
    fechaNacimiento: new Date("1765-04-09"),
    fechaMuerte: new Date("1823-12-13"),
    lugarNacimiento: "Bogotá, Virreinato de Nueva Granada",
    pais: "Colombia",
    ambito: "nacional",
    profesiones: ["Militar", "Político", "Prócer"],
    biografia: "Prócer de la independencia colombiana, conocido como 'El Precursor'. Tradujo y difundió la Declaración de los Derechos del Hombre, lo que le costó prisión. Fue presidente de Cundinamarca.",
    logrosDestacados: [
      "Traductor de los Derechos del Hombre (1793)",
      "Presidente de Cundinamarca (1811-1812)",
      "Primer golpe de Estado en Colombia",
      "Luchador por la independencia"
    ],
    frasesCelebres: [
      { frase: "De nada servirá que seamos libres si seguimos siendo ignorantes", contexto: "Sobre la educación" }
    ],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Nari%C3%B1o_by_Acevedo_Bernal.jpg",
    cronologia: [
      { año: 1765, evento: "Nacimiento", descripcion: "Nace en Bogotá" },
      { año: 1794, evento: "Traducción histórica", descripcion: "Traduce los Derechos del Hombre" },
      { año: 1797, evento: "Prisión", descripcion: "Es encarcelado y deportado" },
      { año: 1811, evento: "Presidente", descripcion: "Presidente de Cundinamarca" },
      { año: 1823, evento: "Fallecimiento", descripcion: "Muere en Villa de Leiva" }
    ],
    legado: "Precursor ideológico de la independencia, defensor de los derechos humanos.",
    fuentes: ["https://www.banrepcultural.org/biblioteca-virtual/antonio-narino"]
  },

  // LATINOAMÉRICA
  {
    nombre: "Simón Bolívar",
    nombreCompleto: "Simón José Antonio de la Santísima Trinidad Bolívar Palacios Ponte y Blanco",
    fechaNacimiento: new Date("1783-07-24"),
    fechaMuerte: new Date("1830-12-17"),
    lugarNacimiento: "Caracas, Venezuela",
    pais: "Venezuela",
    ambito: "latinoamerica",
    profesiones: ["Militar", "Político", "Libertador"],
    biografia: "Líder militar y político, figura central de la independencia de América del Sur. Libertó a Venezuela, Colombia, Ecuador, Perú y Bolivia del dominio español. Considerado uno de los personajes más influyentes de la historia latinoamericana.",
    logrosDestacados: [
      "Libertador de cinco naciones sudamericanas",
      "Presidente de la Gran Colombia (1819-1830)",
      "Batalla de Boyacá (1819)",
      "Congreso de Angostura (1819)"
    ],
    frasesCelebres: [
      { frase: "Un ser sin estudio es un ser incompleto", contexto: "Carta a su maestro Simón Rodríguez" },
      { frase: "He arado en el mar", contexto: "Últimas palabras" }
    ],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Sim%C3%B3n_Bol%C3%ADvar_by_Jos%C3%A9_Mar%C3%ADa_Espinosa.jpg/220px-Sim%C3%B3n_Bol%C3%ADvar_by_Jos%C3%A9_Mar%C3%ADa_Espinosa.jpg",
    cronologia: [
      { año: 1783, evento: "Nacimiento", descripcion: "Nace en Caracas, Venezuela" },
      { año: 1819, evento: "Batalla de Boyacá", descripcion: "Victoria decisiva en la independencia" },
      { año: 1824, evento: "Batalla de Ayacucho", descripcion: "Fin del dominio español en Sudamérica" },
      { año: 1830, evento: "Fallecimiento", descripcion: "Muere en Santa Marta, Colombia" }
    ],
    legado: "Considerado el Libertador de América, su visión de unidad latinoamericana sigue vigente.",
    fuentes: ["https://www.banrepcultural.org/biblioteca-virtual/simon-bolivar"]
  },

  {
    nombre: "José Martí",
    nombreCompleto: "José Julián Martí Pérez",
    fechaNacimiento: new Date("1853-01-28"),
    fechaMuerte: new Date("1895-05-19"),
    lugarNacimiento: "La Habana, Cuba",
    pais: "Cuba",
    ambito: "latinoamerica",
    profesiones: ["Poeta", "Político", "Periodista", "Revolucionario"],
    biografia: "Héroe nacional de Cuba, poeta y pensador. Líder del movimiento independentista cubano. Su obra literaria es considerada una de las más importantes de la literatura latinoamericana.",
    logrosDestacados: [
      "Fundador del Partido Revolucionario Cubano",
      "Poeta modernista",
      "Héroe nacional de Cuba",
      "Pensador antiimperialista"
    ],
    frasesCelebres: [
      { frase: "Yo quiero que la ley primera de nuestra república sea el culto de los cubanos a la dignidad plena del hombre", contexto: "Sobre la independencia" },
      { frase: "Ser cultos es el único modo de ser libres", contexto: "Sobre la educación" }
    ],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Jose_Marti_1891.jpg/220px-Jose_Marti_1891.jpg",
    cronologia: [
      { año: 1853, evento: "Nacimiento", descripcion: "Nace en La Habana" },
      { año: 1892, evento: "Partido Revolucionario", descripcion: "Funda el Partido Revolucionario Cubano" },
      { año: 1895, evento: "Muerte en combate", descripcion: "Muere en la batalla de Dos Ríos" }
    ],
    legado: "Símbolo de la independencia cubana y del antiimperialismo latinoamericano.",
    fuentes: ["https://www.biografiasyvidas.com/biografia/m/marti_jose.htm"]
  },

  {
    nombre: "Pablo Neruda",
    nombreCompleto: "Ricardo Eliécer Neftalí Reyes Basoalto",
    fechaNacimiento: new Date("1904-07-12"),
    fechaMuerte: new Date("1973-09-23"),
    lugarNacimiento: "Parral, Chile",
    pais: "Chile",
    ambito: "mundial",
    profesiones: ["Poeta", "Diplomático", "Político"],
    biografia: "Poeta chileno, premio Nobel de Literatura 1971. Considerado uno de los más influyentes poetas del siglo XX. Su obra abarca diversos estilos desde el amor hasta la poesía política.",
    logrosDestacados: [
      "Premio Nobel de Literatura (1971)",
      "Autor de 'Veinte poemas de amor y una canción desesperada'",
      "Embajador de Chile en Francia",
      "Premio Nacional de Literatura de Chile (1945)"
    ],
    frasesCelebres: [
      { frase: "Podrán cortar todas las flores, pero no podrán detener la primavera", contexto: "Sobre la esperanza" },
      { frase: "Muere lentamente quien no viaja, quien no lee", contexto: "Sobre la vida" }
    ],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Pablo_Neruda_1963.jpg/220px-Pablo_Neruda_1963.jpg",
    cronologia: [
      { año: 1904, evento: "Nacimiento", descripcion: "Nace en Parral, Chile" },
      { año: 1924, evento: "Veinte poemas", descripcion: "Publica su obra más famosa" },
      { año: 1971, evento: "Premio Nobel", descripcion: "Recibe el Nobel de Literatura" },
      { año: 1973, evento: "Fallecimiento", descripcion: "Muere en Santiago de Chile" }
    ],
    legado: "Una de las voces poéticas más importantes del siglo XX en idioma español.",
    fuentes: ["https://www.biografiasyvidas.com/biografia/n/neruda.htm"]
  },

  {
    nombre: "Frida Kahlo",
    nombreCompleto: "Magdalena Carmen Frida Kahlo Calderón",
    fechaNacimiento: new Date("1907-07-06"),
    fechaMuerte: new Date("1954-07-13"),
    lugarNacimiento: "Coyoacán, México",
    pais: "México",
    ambito: "mundial",
    profesiones: ["Pintora", "Artista"],
    biografia: "Pintora mexicana, icono del arte y el feminismo. Su obra, marcada por el dolor y la pasión, la convirtió en una de las artistas más reconocidas del siglo XX. Su vida y arte son símbolos de resistencia.",
    logrosDestacados: [
      "Primera artista mexicana en el Louvre",
      "Icono feminista mundial",
      "Más de 200 obras, principalmente autorretratos",
      "Símbolo de la identidad mexicana"
    ],
    frasesCelebres: [
      { frase: "Pies, ¿para qué los quiero si tengo alas para volar?", contexto: "Diario personal" },
      { frase: "Yo solía pensar que era la persona más extraña en el mundo", contexto: "Reflexión personal" }
    ],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/220px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg",
    cronologia: [
      { año: 1907, evento: "Nacimiento", descripcion: "Nace en Coyoacán, México" },
      { año: 1925, evento: "Accidente", descripcion: "Sufre grave accidente que marca su vida" },
      { año: 1929, evento: "Matrimonio", descripcion: "Se casa con Diego Rivera" },
      { año: 1954, evento: "Fallecimiento", descripcion: "Muere en México" }
    ],
    legado: "Símbolo del feminismo, el arte y la identidad mexicana.",
    fuentes: ["https://www.biografiasyvidas.com/biografia/k/kahlo.htm"]
  },

  {
    nombre: "Che Guevara",
    nombreCompleto: "Ernesto Guevara de la Serna",
    fechaNacimiento: new Date("1928-06-14"),
    fechaMuerte: new Date("1967-10-09"),
    lugarNacimiento: "Rosario, Argentina",
    pais: "Argentina",
    ambito: "mundial",
    profesiones: ["Médico", "Revolucionario", "Guerrillero", "Político"],
    biografia: "Revolucionario argentino-cubano, figura emblemática de los movimientos de izquierda. Participó en la Revolución Cubana junto a Fidel Castro. Su imagen se convirtió en símbolo de rebeldía mundial.",
    logrosDestacados: [
      "Líder de la Revolución Cubana (1959)",
      "Ministro de Industria de Cuba",
      "Autor de 'La guerra de guerrillas'",
      "Símbolo de la lucha revolucionaria"
    ],
    frasesCelebres: [
      { frase: "Hasta la victoria siempre", contexto: "Carta de despedida" },
      { frase: "Seamos realistas, pidamos lo imposible", contexto: "Sobre los ideales" }
    ],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/CheHigh.jpg/220px-CheHigh.jpg",
    cronologia: [
      { año: 1928, evento: "Nacimiento", descripcion: "Nace en Rosario, Argentina" },
      { año: 1959, evento: "Revolución Cubana", descripcion: "Triunfo de la revolución" },
      { año: 1965, evento: "Salida de Cuba", descripcion: "Se va para continuar la lucha" },
      { año: 1967, evento: "Muerte", descripcion: "Es capturado y ejecutado en Bolivia" }
    ],
    legado: "Icono global de la revolución y la lucha contra la injusticia.",
    fuentes: ["https://www.biografiasyvidas.com/biografia/g/guevara.htm"]
  },

  // MUNDIAL
  {
    nombre: "Nelson Mandela",
    nombreCompleto: "Nelson Rolihlahla Mandela",
    fechaNacimiento: new Date("1918-07-18"),
    fechaMuerte: new Date("2013-12-05"),
    lugarNacimiento: "Mvezo, Sudáfrica",
    pais: "Sudáfrica",
    ambito: "mundial",
    profesiones: ["Abogado", "Político", "Activista"],
    biografia: "Líder sudafricano anti-apartheid, presidente de Sudáfrica (1994-1999). Pasó 27 años en prisión por su lucha contra la segregación racial. Premio Nobel de la Paz 1993.",
    logrosDestacados: [
      "Premio Nobel de la Paz (1993)",
      "Primer presidente negro de Sudáfrica",
      "Fin del apartheid",
      "Símbolo de la reconciliación"
    ],
    frasesCelebres: [
      { frase: "La educación es el arma más poderosa que puedes usar para cambiar el mundo", contexto: "Sobre la educación" },
      { frase: "Nadie nace odiando a otra persona por el color de su piel", contexto: "Sobre el racismo" }
    ],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/220px-Nelson_Mandela_1994.jpg",
    cronologia: [
      { año: 1918, evento: "Nacimiento", descripcion: "Nace en Mvezo" },
      { año: 1964, evento: "Prisión", descripcion: "Condenado a cadena perpetua" },
      { año: 1990, evento: "Libertad", descripcion: "Es liberado después de 27 años" },
      { año: 1994, evento: "Presidencia", descripcion: "Primer presidente negro de Sudáfrica" },
      { año: 2013, evento: "Fallecimiento", descripcion: "Muere en Johannesburgo" }
    ],
    legado: "Símbolo mundial de la lucha por la igualdad y los derechos humanos.",
    fuentes: ["https://www.biografiasyvidas.com/biografia/m/mandela.htm"]
  },

  {
    nombre: "Marie Curie",
    nombreCompleto: "Maria Salomea Skłodowska-Curie",
    fechaNacimiento: new Date("1867-11-07"),
    fechaMuerte: new Date("1934-07-04"),
    lugarNacimiento: "Varsovia, Polonia",
    pais: "Polonia",
    ambito: "mundial",
    profesiones: ["Científica", "Física", "Química"],
    biografia: "Científica polaco-francesa, pionera en el campo de la radiactividad. Primera mujer en ganar un Premio Nobel y única persona en ganar Premios Nobel en dos ciencias diferentes.",
    logrosDestacados: [
      "Premio Nobel de Física (1903)",
      "Premio Nobel de Química (1911)",
      "Descubrimiento del polonio y el radio",
      "Primera mujer profesora en la Sorbona"
    ],
    frasesCelebres: [
      { frase: "Nada en la vida debe ser temido, solamente comprendido", contexto: "Sobre la ciencia" },
      { frase: "Hay que perseverar y sobre todo tener confianza en uno mismo", contexto: "Sobre la determinación" }
    ],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Marie_Curie_c1920.jpg/220px-Marie_Curie_c1920.jpg",
    cronologia: [
      { año: 1867, evento: "Nacimiento", descripcion: "Nace en Varsovia" },
      { año: 1903, evento: "Primer Nobel", descripcion: "Nobel de Física junto a su esposo" },
      { año: 1911, evento: "Segundo Nobel", descripcion: "Nobel de Química" },
      { año: 1934, evento: "Fallecimiento", descripcion: "Muere por exposición a la radiación" }
    ],
    legado: "Pionera de la ciencia y símbolo de la lucha de las mujeres en el campo científico.",
    fuentes: ["https://www.biografiasyvidas.com/biografia/c/curie_marie.htm"]
  },

  {
    nombre: "Martin Luther King Jr.",
    nombreCompleto: "Michael King Jr.",
    fechaNacimiento: new Date("1929-01-15"),
    fechaMuerte: new Date("1968-04-04"),
    lugarNacimiento: "Atlanta, Georgia, EE.UU.",
    pais: "Estados Unidos",
    ambito: "mundial",
    profesiones: ["Pastor", "Activista", "Líder de derechos civiles"],
    biografia: "Líder del movimiento por los derechos civiles en Estados Unidos. Defensor de la resistencia no violenta. Su discurso 'I Have a Dream' es uno de los más famosos de la historia.",
    logrosDestacados: [
      "Premio Nobel de la Paz (1964)",
      "Líder del movimiento por los derechos civiles",
      "Marcha sobre Washington (1963)",
      "Ley de Derechos Civiles (1964)"
    ],
    frasesCelebres: [
      { frase: "Tengo un sueño de que mis cuatro hijos vivirán un día en una nación donde no serán juzgados por el color de su piel", contexto: "Discurso 'I Have a Dream'" },
      { frase: "La injusticia en cualquier lugar es una amenaza a la justicia en todas partes", contexto: "Carta desde la cárcel de Birmingham" }
    ],
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Martin_Luther_King%2C_Jr..jpg/220px-Martin_Luther_King%2C_Jr..jpg",
    cronologia: [
      { año: 1929, evento: "Nacimiento", descripcion: "Nace en Atlanta" },
      { año: 1963, evento: "I Have a Dream", descripcion: "Pronuncia su discurso más famoso" },
      { año: 1964, evento: "Premio Nobel", descripcion: "Recibe el Nobel de la Paz" },
      { año: 1968, evento: "Asesinato", descripcion: "Es asesinado en Memphis" }
    ],
    legado: "Símbolo de la lucha pacífica por los derechos civiles y la igualdad racial.",
    fuentes: ["https://www.biografiasyvidas.com/biografia/k/king.htm"]
  },
];

// Narrativas interactivas
const narrativas = [
  // COLOMBIA - Nacional
  {
    titulo: "El Camino hacia la Independencia",
    subtitulo: "La lucha por la libertad de Colombia 1810-1819",
    descripcionCorta: "Un recorrido interactivo por los eventos clave que llevaron a la independencia de Colombia del dominio español.",
    ambito: "nacional",
    categoria: "independencia",
    imagen: "https://example.com/independencia.jpg",
    duracionEstimada: 45,
    capitulos: [
      {
        numero: 1,
        titulo: "El Grito de Independencia",
        contenido: "El 20 de julio de 1810, en Bogotá, un incidente aparentemente menor desencadenó una revolución que cambiaría para siempre el destino de la Nueva Granada. El florero de Llorente, como se conoce este evento, fue el pretexto perfecto para que los criollos expresaran su descontento con el gobierno español.\n\nLos hermanos Francisco y Antonio Morales acudieron al comercio de José González Llorente para solicitar prestado un florero para adornar la mesa del prócer Antonio Villavicencio. La negativa del comerciante español fue interpretada como un desaire a los criollos, lo que desencadenó una revuelta popular.\n\nLa tensión acumulada durante años de dominio colonial encontró su válvula de escape. Los gritos de '¡Cabildo! ¡Cabildo!' resonaron por las calles empedradas de Santafé, y una multitud se congregó en la Plaza Mayor exigiendo un gobierno propio.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "La Reconquista Española",
        contenido: "Tras los primeros años de libertad, España no estaba dispuesta a perder sus colonias americanas. Entre 1815 y 1816, el general Pablo Morillo llegó con un poderoso ejército de más de 10,000 hombres, iniciando lo que se conocería como el Régimen del Terror.\n\nLa reconquista española fue brutal. Cientos de patriotas fueron ejecutados, encarcelados o exiliados. Nombres como Camilo Torres, Francisco José de Caldas y Policarpa Salavarrieta se convirtieron en mártires de la causa independentista. Sus ejecuciones no hicieron más que fortalecer la determinación del pueblo por alcanzar la libertad definitiva.\n\nMientras tanto, en los llanos orientales, grupos de guerrilleros mantenían viva la llama de la resistencia bajo el liderazgo de José Antonio Páez y otros valientes comandantes.",
        imagenes: []
      },
      {
        numero: 3,
        titulo: "La Campaña Libertadora",
        contenido: "En 1819, Simón Bolívar concibió uno de los planes militares más audaces de la historia americana: cruzar los Andes para sorprender a las fuerzas realistas en Boyacá. La marcha fue épica: 2,500 hombres atravesaron el páramo de Pisba en plena época de lluvias, perdiendo casi un tercio de sus efectivos.\n\nEl 7 de agosto de 1819, en el puente de Boyacá, se libró la batalla decisiva. En menos de dos horas, las fuerzas patriotas al mando de Bolívar y Santander derrotaron al ejército realista. El virrey Juan de Sámano huyó precipitadamente de Santafé, abandonando incluso sus pertenencias personales.\n\nLa victoria en Boyacá no solo significó la independencia de la Nueva Granada, sino que abrió el camino para la liberación de Venezuela, Ecuador, Perú y Bolivia. El sueño de una América libre comenzaba a hacerse realidad.",
        imagenes: []
      }
    ]
  },

  {
    titulo: "La Época del Café: Oro Verde",
    subtitulo: "El auge cafetero que transformó a Colombia 1835-1920",
    descripcionCorta: "La historia de cómo el café se convirtió en el motor económico de Colombia y moldeó su identidad nacional.",
    ambito: "nacional",
    categoria: "economico",
    imagen: "https://example.com/cafe.jpg",
    duracionEstimada: 35,
    capitulos: [
      {
        numero: 1,
        titulo: "Las Primeras Semillas",
        contenido: "A principios del siglo XIX, un sacerdote jesuita trajo las primeras plantas de café a Colombia desde las Antillas. Nadie imaginaba entonces que este grano transformaría completamente la economía y sociedad colombiana.\n\nLas primeras plantaciones se establecieron en Santander y Cundinamarca. El clima de las montañas andinas resultó ser perfecto para el cultivo: temperaturas moderadas, altitud ideal y lluvias bien distribuidas. El café colombiano comenzó a destacarse por su calidad excepcional.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "La Expansión hacia el Eje Cafetero",
        contenido: "A finales del siglo XIX, la colonización antioqueña llevó el café hacia el occidente del país. Familias enteras se aventuraron en la selva, talando bosques y estableciendo fincas cafeteras en lo que hoy conocemos como el Eje Cafetero: Caldas, Risaralda y Quindío.\n\nEsta región se convirtió en el corazón de la producción cafetera colombiana. Se desarrolló una cultura única alrededor del café, con técnicas de cultivo transmitidas de generación en generación. El paisaje cultural cafetero, hoy Patrimonio de la Humanidad, comenzó a tomar forma.",
        imagenes: []
      }
    ]
  },

  {
    titulo: "La Violencia: 1948-1958",
    subtitulo: "El conflicto bipartidista que desangró a Colombia",
    descripcionCorta: "Una década oscura de enfrentamientos entre liberales y conservadores que dejó más de 200,000 muertos.",
    ambito: "nacional",
    categoria: "conflicto",
    imagen: "https://example.com/violencia.jpg",
    duracionEstimada: 40,
    capitulos: [
      {
        numero: 1,
        titulo: "El Bogotazo",
        contenido: "El 9 de abril de 1948, a la 1:05 pm, tres disparos acabaron con la vida de Jorge Eliécer Gaitán frente al edificio Agustín Nieto en Bogotá. El líder liberal, que prometía cambios sociales profundos, cayó asesinado cuando se dirigía a almorzar con un colega.\n\nLa noticia se expandió como pólvora. En cuestión de minutos, una turba enfurecida tomó las calles del centro de Bogotá. Los disturbios duraron tres días, dejando gran parte de la ciudad en ruinas. Más de 3,000 personas murieron en Bogotá, y la violencia se extendió rápidamente por todo el país.\n\nEl Bogotazo marcó el inicio de una época que los colombianos simplemente llamarían 'La Violencia'. Lo que comenzó como un conflicto político entre liberales y conservadores se transformó en una guerra civil no declarada que marcaría profundamente la historia nacional.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "El Terror Rural",
        contenido: "Mientras Bogotá se recuperaba lentamente del Bogotazo, en las zonas rurales la violencia apenas comenzaba. Bandas armadas conocidas como 'pájaros' (conservadores) y 'chusmeros' (liberales) aterrorizaban los campos.\n\nFamilias enteras eran asesinadas por su afiliación política. Los métodos de violencia alcanzaron niveles de crueldad inimaginables: el 'corte de franela', el 'corte de corbata' y otras atrocidades se convirtieron en símbolos del horror de esta época.\n\nPueblos enteros fueron abandonados. Los campesinos huían hacia las ciudades o se refugiaban en zonas selváticas. La producción agrícola se desplomó y el país entró en una espiral de violencia que parecía no tener fin.",
        imagenes: []
      }
    ]
  },

  {
    titulo: "La Gran Colombia: Un Sueño de Unidad",
    subtitulo: "El proyecto bolivariano de una nación unida 1819-1831",
    descripcionCorta: "La historia de la unión de Colombia, Venezuela, Ecuador y Panamá bajo un solo país y las razones de su disolución.",
    ambito: "latinoamerica",
    categoria: "politico",
    imagen: "https://example.com/grancolombia.jpg",
    duracionEstimada: 40,
    capitulos: [
      {
        numero: 1,
        titulo: "El Congreso de Angostura",
        contenido: "El 15 de febrero de 1819, en plena campaña militar, Simón Bolívar convocó un congreso en Angostura (hoy Ciudad Bolívar, Venezuela). Allí presentó su visión de una gran nación sudamericana que uniera a los territorios liberados del dominio español.\n\nBolívar soñaba con una república fuerte, capaz de resistir las presiones europeas y desarrollarse como potencia. Propuso un gobierno centralizado, un poder moral que vigilara la educación y las costumbres, y una estructura que garantizara la estabilidad.\n\nEl congreso aprobó la creación de la República de Colombia, que inicialmente comprendía las actuales Venezuela y Colombia. Meses después, con la victoria en Boyacá, el sueño comenzaba a materializarse.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "Las Semillas de la División",
        contenido: "Desde su inicio, la Gran Colombia enfrentó desafíos monumentales. Las enormes distancias entre regiones dificultaban la comunicación y el control. Caracas estaba a más de 20 días de viaje de Bogotá, y Quito aún más lejos.\n\nLas rivalidades regionales pronto emergieron. Los venezolanos sentían que Bogotá tenía demasiado poder. Los ecuatorianos se sentían marginados. José Antonio Páez en Venezuela y Juan José Flores en Ecuador comenzaron a tener ambiciones separatistas.\n\nAdemás, surgieron diferencias ideológicas fundamentales. Francisco de Paula Santander lideraba a los federalistas, que querían más autonomía regional. Bolívar defendía el centralismo. Esta división ideológica se profundizaría hasta hacer insostenible la unión.",
        imagenes: []
      }
    ]
  },

  {
    titulo: "El Proceso de Paz con las FARC",
    subtitulo: "De La Habana a la firma en Cartagena 2012-2016",
    descripcionCorta: "El largo camino de negociaciones que puso fin a más de 50 años de conflicto armado entre el gobierno y las FARC.",
    ambito: "nacional",
    categoria: "politico",
    imagen: "https://example.com/paz.jpg",
    duracionEstimada: 50,
    capitulos: [
      {
        numero: 1,
        titulo: "Los Diálogos Secretos",
        contenido: "En 2010, cuando Juan Manuel Santos asumió la presidencia, pocos sabían que ya se habían iniciado acercamientos secretos con las FARC. Henry Acosta y Sergio Jaramillo, enviados del gobierno, se reunieron clandestinamente con 'Mauricio Jácome' y 'Andrés París', delegados de la guerrilla.\n\nLas conversaciones exploratorias se realizaron en Cuba, con la mediación de Raúl Castro. Durante dos años, se trabajó en la agenda de negociación y en establecer las condiciones mínimas para iniciar diálogos formales. El secreto era fundamental: intentos anteriores habían fracasado por presiones públicas y ataques militares.\n\nFinalmente, el 26 de agosto de 2012, el presidente Santos anunció al país el inicio formal de las conversaciones de paz en La Habana. El escepticismo era generalizado, pero la decisión estaba tomada.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "Los Seis Puntos",
        contenido: "La agenda de negociación se estructuró en seis puntos fundamentales: política de desarrollo agrario integral, participación política, fin del conflicto, solución al problema de las drogas ilícitas, víctimas, e implementación y verificación.\n\nCada punto representaba décadas de conflicto y problemas estructurales del país. Las negociaciones fueron largas y complejas. Se logró un acuerdo histórico sobre reforma agraria, reconociendo que el problema de la tierra estaba en el origen del conflicto.\n\nLa participación política de excombatientes generó intensos debates. El acuerdo sobre justicia transicional, con el sistema de Jurisdicción Especial para la Paz (JEP), fue quizás el más polémico: ¿cómo balancear justicia, verdad y paz?",
        imagenes: []
      }
    ]
  },
  {
    titulo: "El Bogotazo: El Día que Colombia Ardió",
    subtitulo: "Del asesinato de Gaitán al inicio de La Violencia 1948-1953",
    descripcionCorta: "El magnicidio que desató una revuelta nacional y marcó el inicio de una década de violencia bipartidista.",
    ambito: "nacional",
    categoria: "conflicto",
    imagen: "https://example.com/bogotazo-detalle.jpg",
    duracionEstimada: 50,
    capitulos: [
      {
        numero: 1,
        titulo: "El Asesinato en la Carrera Séptima",
        contenido: "El 9 de abril de 1948, Jorge Eliécer Gaitán salía de su oficina en el edificio Agustín Nieto cuando Juan Roa Sierra le disparó a quemarropa tres veces. Testigos presenciales, entre ellos el médico Jorge Moreno Díaz, intentaron salvarle la vida llevándolo a la Clínica Central, pero Gaitán murió minutos después. La noticia se propagó como reguero de pólvora gracias a las emisoras de radio, especialmente la voz desgarrada de Carlos Arturo Rueda en Radio Nacional.\n\nMientras tanto, la turba capturó a Roa Sierra y lo linchó frente al Palacio Presidencial. Su cuerpo mutilado fue arrastrado por las calles y finalmente colgado de un poste frente al Capitolio Nacional. La muchedumbre, desbordada por la rabia, gritaba consignas contra el gobierno conservador de Mariano Ospina Pérez.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "Tres Días de Furia en Bogotá",
        contenido: "Bogotá se transformó en un infierno. Multitudes incendiaron tranvías, saquearon almacenes de lujo como la Droguería Francesa y atacaron edificios gubernamentales. La Novena Conferencia Panamericana, que se realizaba en el Capitolio con delegados de todo el continente, tuvo que ser suspendida. Un joven Fidel Castro, que se encontraba en Bogotá como delegado estudiantil, fue testigo del caos y años después afirmaría que este evento influyó en su pensamiento revolucionario.\n\nEl gobierno declaró estado de sitio, pero la policía estaba sobrepasada. El ejército tardó horas en movilizarse. Para cuando recuperaron el control, el centro histórico estaba destruido: 142 edificios dañados, 100 tranvías quemados, y las pérdidas económicas ascendían a 500 millones de pesos de la época. Oficialmente murieron 3,000 personas, aunque estimaciones extraoficiales hablan de hasta 5,000 víctimas.",
        imagenes: []
      },
      {
        numero: 3,
        titulo: "La Nacionalización de la Violencia",
        contenido: "El Bogotazo fue solo el inicio. En las semanas siguientes, la violencia se extendió por todo el país. En Santander, Antioquia y Tolima, liberales y conservadores se enfrentaron en una guerra no declarada. Las 'guerrillas liberales' comenzaron a organizarse como respuesta a la represión del gobierno conservador.\n\nEn 1949, el Partido Liberal se retiró de las elecciones y Laureano Gómez, un conservador de línea dura, llegó a la presidencia. Su gobierno radicalizó la persecución política. Para 1953, el país estaba al borde del colapso: más de 200,000 muertos, 800,000 desplazados, y una economía en ruinas. El 13 de junio de ese año, el general Gustavo Rojas Pinilla dio un golpe de estado 'para pacificar la nación', iniciando una nueva etapa en la historia colombiana.",
        imagenes: []
      }
    ]
  },
  {
    titulo: "La Bonanza Marimbera: Marihuana, Dólares y Violencia",
    subtitulo: "El auge y caída del primer gran cartel colombiano 1970-1985",
    descripcionCorta: "Cómo el tráfico de marihuana desde la Guajira transformó regiones enteras y sentó las bases para el narcotráfico moderno.",
    ambito: "nacional",
    categoria: "economico",
    imagen: "https://example.com/bonanza-marimbera.jpg",
    duracionEstimada: 45,
    capitulos: [
      {
        numero: 1,
        titulo: "La Costa se Viste de Verde",
        contenido: "A principios de los años 70, campesinos de la Sierra Nevada de Santa Marta comenzaron a cultivar marihuana a gran escala. La variedad 'Colombian Gold' se hizo famosa en Estados Unidos por su alta potencia. Pronto, regiones enteras de La Guajira, Magdalena y Cesar se dedicaron al cultivo.\n\nLos 'marimberos' organizaron rutas de contrabando innovadoras: avionetas Cessna despegaban de pistas clandestinas en la noche, volaban bajo para evitar radares, y descargaban en el mar frente a las costas de Florida, donde lanchas rápidas recogían la carga. Un kilo que costaba $20 producir en Colombia se vendía a $600 en Miami. El dinero llegaba en maletas llenas de billetes que blanqueaban comprando ganado, fincas y negocios legítimos.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "La Violencia Entra en Escena",
        contenido: "Con las enormes ganancias llegó la violencia. Pablo Escobar, inicialmente contrabandista de cigarrillos y electrodomésticos, vio la oportunidad. Junto con los hermanos Ochoa y Carlos Lehder, comenzó a controlar el negocio. En 1978, Lehder compró la isla de Norman's Cay en las Bahamas y la convirtió en un centro de transbordo para la cocaína.\n\nEl gobierno de Julio César Turbay (1978-1982) lanzó una ofensiva con el Estatuto de Seguridad. En 1979, la Operación Fulminante destruyó 8,000 hectáreas de marihuana en la Sierra Nevada, pero ya era tarde: los narcos habían diversificado hacia la cocaína, más rentable y fácil de transportar. La bonanza marimbera terminaba, pero daba paso a algo mucho más peligroso: el cartel de Medellín.",
        imagenes: []
      },
      {
        numero: 3,
        titulo: "Legado y Transformación",
        contenido: "La bonanza marimbera dejó profundas huellas: ciudades como Riohacha y Valledupar experimentaron un boom de construcción, pero también aumentaron la desigualdad y la corrupción. Muchas de las técnicas de contrabando, lavado de dinero y corrupción política se perfeccionaron en esta época.\n\nEl dinero de la marihuana financió la expansión de la cocaína en los 80. Los 'marimberos' pioneros fueron desplazados o absorbidos por los nuevos capos más violentos. Para 1985, Colombia ya no era el principal exportador de marihuana, pero se había consolidado como el centro mundial del narcotráfico de cocaína, con consecuencias que marcarían las siguientes décadas.",
        imagenes: []
      }
    ]
  },
  {
    titulo: "El Holocausto del Palacio de Justicia",
    subtitulo: "27 horas que conmocionaron a Colombia 6-7 de noviembre de 1985",
    descripcionCorta: "La toma guerrillera y retoma militar que dejó más de 100 muertos, incluidos 11 magistrados de la Corte Suprema.",
    ambito: "nacional",
    categoria: "conflicto",
    imagen: "https://example.com/palacio-justicia.jpg",
    duracionEstimada: 55,
    capitulos: [
      {
        numero: 1,
        titulo: "La Toma: Operación Antonio Nariño",
        contenido: "A las 11:35 AM del 6 de noviembre de 1985, 35 guerrilleros del M-19 al mando de Luis Otero Cifuentes y Andrés Almarales irrumpieron en el Palacio de Justicia. Vestidos con overoles naranja de la empresa de acueducto, ingresaron armas en cajas que supuestamente contenían equipos. En minutos controlaron el edificio con más de 350 rehenes, incluidos los 24 magistrados de la Corte Suprema, el Consejo de Estado y la sala constitucional.\n\nSu demanda principal: que el presidente Belisario Betancur se presentara ante el tribunal para ser juzgado por 'traicionar los procesos de paz'. El M-19 argumentaba que el gobierno había roto los acuerdos de cese al fuego firmados en 1984. Mientras, afuera, familiares de los rehenes comenzaban a congregarse bajo la llovizna bogotana.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "La Retoma: Fuego y Muerte",
        contenido: "El ejército, bajo el mando del general Rafael Samudio, decidió una retoma inmediata y frontal. Tanques blindados dispararon contra la fachada. Soldados del Batallón de Artillería N°13 'Palacé' ingresaron bajo fuego pesado. La decisión de usar fuerza desproporcionada sigue siendo debatida: ¿era necesario incendiar el edificio?\n\nDentro del palacio, el caos era absoluto. Los guerrilleros concentraron a los magistrados en el baño del cuarto piso. Cuando el fuego y el humo hicieron insostenible la situación, el magistrado auxiliar Carlos Medellín Forero intentó negociar la salida de los magistrados. Fue ejecutado en el acto. Otros magistrados murieron por inhalación de humo o balas perdidas.",
        imagenes: []
      },
      {
        numero: 3,
        titulo: "Las Preguntas sin Respuesta",
        contenido: "Al amanecer del 7 de noviembre, el Palacio de Justicia era una fachada calcinada. Balance oficial: 98 muertos (incluidos 11 magistrados, 33 guerrilleros y varios empleados). Pero las cifras reales pueden ser mayores. Los sobrevivientes hablaron de ejecuciones sumarias y de personas que 'desaparecieron' después de salir con vida.\n\nEl caso más emblemático: la desaparición de Irma Franco y Cristina Guarín, empleadas de la cafetería, y de varios visitantes cuyos cuerpos nunca aparecieron. Testigos afirmaron ver a soldados sacando personas con vida que luego desaparecieron. La Comisión de la Verdad creada años después documentó irregularidades graves, pero muchos familiares siguen esperando justicia 40 años después.\n\nEl Palacio de Justicia marcó un punto de no retorno: demostró la brutalidad del conflicto y erosionó la confianza en las instituciones. Los procesos de paz se estancarían por años, y la guerra se recrudecería.",
        imagenes: []
      }
    ]
  },
  {
    titulo: "Proceso 8000: Narcopolítica y la Caída de un Presidente",
    subtitulo: "El escándalo que vinculó a Pablo Escobar con la clase política 1994-1996",
    descripcionCorta: "La investigación que reveló cómo el cartel de Cali financió la campaña de Ernesto Samper y desató una crisis institucional.",
    ambito: "nacional",
    categoria: "politico",
    imagen: "https://example.com/proceso-8000.jpg",
    duracionEstimada: 48,
    capitulos: [
      {
        numero: 1,
        titulo: "Los Narcocassettes",
        contenido: "En junio de 1994, semanas antes de la segunda vuelta presidencial entre Ernesto Samper y Andrés Pastrana, aparecieron unas grabaciones que conmocionaron al país. En ellas, los hermanos Miguel y Gilberto Rodríguez Orejuela, jefes del cartel de Cali, discutían con Santiago Medina, tesorero de la campaña samperista, sobre el desembolso de $3.7 millones de dólares para la campaña.\n\nLa Fiscalía General, bajo el mando de Alfonso Valdivieso, abrió la investigación 8000. Las pruebas eran contundentes: cheques, transferencias y testimonios de ex-funcionarios del cartel. Fernando Botero Zea, ministro de Defensa de Samper, renunció y admitió haber recibido dinero del narcotráfico 'sin saber su procedencia'. La frase se volvería emblemática del escándalo.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "La Casa de Nariño Bajo Asedio",
        contenido: "1995 fue el año del desgaste. La Cámara de Representantes, controlada por samperistas, archivó la primera acusación. Pero la presión internacional era implacable. Estados Unidos, a través de su embajador Myles Frechette, exigía acciones concretas. En marzo de 1996, el gobierno de Bill Clinton 'decertificó' a Colombia en la lucha antidrogas, imponiendo sanciones económicas.\n\nDentro del gobierno, la parálisis era total. Ministros renunciaban uno tras otro. La economía sufrió: fuga de capitales, devaluación del peso, y pérdida de crédito internacional. Mientras, en las calles, protestas estudiantiles bajo el lema 'No más mentiras, no más corrupción' exigían la renuncia de Samper.",
        imagenes: []
      },
      {
        numero: 3,
        titulo: "Absolución y Heridas Abiertas",
        contenido: "El 12 de junio de 1996, la Cámara de Representantes, en una sesión maratónica transmitida por televisión nacional, absolvió a Samper por 111 votos contra 43. El presidente declaró: 'He sido juzgado y absuelto', pero la victoria fue pírrica.\n\nLas consecuencias fueron profundas: Colombia quedó aislada internacionalmente, las instituciones se debilitaron, y se creó un precedente peligroso de impunidad. Aunque Samper terminó su mandato en 1998, su gobierno estuvo marcado por la parálisis. El Proceso 8000 demostró hasta qué punto el narcotráfico había penetrado la política colombiana, una lección que tardaría años en ser asimilada.",
        imagenes: []
      }
    ]
  },

  // LATINOAMÉRICA
  {
    titulo: "La Revolución Mexicana",
    subtitulo: "La transformación de México 1910-1920",
    descripcionCorta: "Una década de revolución que cambió para siempre la estructura social y política de México.",
    ambito: "latinoamerica",
    categoria: "revolucion",
    imagen: "https://example.com/revolucion-mexicana.jpg",
    duracionEstimada: 45,
    capitulos: [
      {
        numero: 1,
        titulo: "El Porfiriato y sus Contradicciones",
        contenido: "Durante 30 años, Porfirio Díaz gobernó México con mano de hierro. Trajo modernización: ferrocarriles, telégrafos, inversión extranjera. Pero el costo fue altísimo. El 95% de la población rural no tenía tierra propia. Los campesinos trabajaban en condiciones de semi-esclavitud en las haciendas.\n\nLa frase 'Poca política, mucha administración' resumía su estilo de gobierno. No había democracia real, la prensa era censurada, y la disidencia era aplastada. Para 1910, Díaz tenía 80 años y llevaba tres décadas en el poder.\n\nFrancisco I. Madero, un hacendado idealista del norte, lanzó el Plan de San Luis desconociendo la reelección de Díaz y llamando al pueblo a levantarse en armas el 20 de noviembre de 1910.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "Pancho Villa y Emiliano Zapata",
        contenido: "Desde el norte, Francisco 'Pancho' Villa lideraba la División del Norte, un ejército de rancheros y trabajadores. Desde el sur, Emiliano Zapata comandaba el Ejército Libertador del Sur, compuesto principalmente por campesinos indígenas.\n\nZapata tenía un objetivo claro: 'Tierra y Libertad'. Su Plan de Ayala exigía la devolución de tierras a los pueblos. Villa, más pragmático, buscaba justicia social y modernización. Ambos se convirtieron en leyendas vivientes.\n\nEn diciembre de 1914, Villa y Zapata se encontraron en la Ciudad de México. La fotografía de ambos sentados en la silla presidencial simbolizó un momento de triunfo revolucionario, aunque breve. Sus diferencias con Venustiano Carranza pronto desembocarían en nuevos conflictos.",
        imagenes: []
      }
    ]
  },

  {
    titulo: "El Che Guevara: De Médico a Revolucionario",
    subtitulo: "La transformación de Ernesto Guevara",
    descripcionCorta: "Cómo un joven médico argentino se convirtió en uno de los revolucionarios más icónicos del siglo XX.",
    ambito: "latinoamerica",
    categoria: "revolucion",
    imagen: "https://example.com/che.jpg",
    duracionEstimada: 35,
    capitulos: [
      {
        numero: 1,
        titulo: "Los Viajes que Forjaron al Che",
        contenido: "En 1951, Ernesto Guevara tenía 23 años y estudiaba medicina en Buenos Aires. Decidió emprender un viaje en motocicleta junto a su amigo Alberto Granado que cambiaría su vida para siempre. Recorrieron Argentina, Chile, Perú, Colombia y Venezuela.\n\nEn este viaje, Ernesto fue testigo de la pobreza extrema, la explotación minera, las enfermedades sin tratamiento. En una leprosería de Perú, se negó a usar guantes para tratar a los pacientes, quienes lo apodaron cariñosamente 'El Pelao'.\n\nCuando regresó a Buenos Aires, ya no era el mismo. La injusticia que había presenciado lo había transformado. Terminó su carrera de medicina, pero su destino ya no sería curar enfermedades individuales, sino lo que él veía como las enfermedades sociales de América Latina.",
        imagenes: []
      }
    ]
  },
  {
    titulo: "La Separación: Cómo Colombia Perdió a Panamá",
    subtitulo: "Intereses estadounidenses y separatismo 1903",
    descripcionCorta: "La historia detrás de la separación de Panamá y el rol decisivo de Estados Unidos en la creación de un nuevo país.",
    ambito: "nacional",
    categoria: "politico",
    imagen: "https://example.com/independencia-panama.jpg",
    duracionEstimada: 42,
    capitulos: [
      {
        numero: 1,
        titulo: "El Canal que Dividió una Nación",
        contenido: "A finales del siglo XIX, el sueño de un canal interoceánico en Centroamérica obsesionaba a las potencias mundiales. Francia, bajo Ferdinand de Lesseps (constructor del Canal de Suez), intentó primero pero fracasó estrepitosamente entre 1881 y 1889: 22,000 trabajadores murieron, principalmente de malaria y fiebre amarilla, y la compañía quebró en un escándalo financiero.\n\nEstados Unidos, emergiendo como potencia global después de la guerra contra España (1898), necesitaba una ruta rápida entre sus costas este y oeste. Consideró Nicaragua, pero finalmente optó por Panamá. El problema: era parte de Colombia, y el Senado colombiano, liderado por el general Rafael Reyes, rechazó el tratado Herrán-Hay en agosto de 1903, considerando que ofrecía muy poco dinero y afectaba la soberanía.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "La Conspiración en Washington",
        contenido: "El presidente Theodore Roosevelt estaba furioso. 'No voy a dejar que esos bandidos de Bogotá me roben el canal', dijo. Su secretario de Estado, John Hay, y el francés Philippe Bunau-Varilla (antiguo ingeniero del proyecto francés) conspiraron con separatistas panameños.\n\nBunau-Varilla financió y organizó la revuelta. El 3 de noviembre de 1903, con el apoyo tácito del USS Nashville que impidió el desembarco de tropas colombianas, Panamá declaró su independencia. No hubo batallas significativas: murieron un soldado colombiano y un panameño. Tres días después, Estados Unidos reconoció al nuevo país, un récord de velocidad diplomática.",
        imagenes: []
      },
      {
        numero: 3,
        titulo: "El Tratado y las Consecuencias",
        contenido: "Bunau-Varilla, nombrado 'enviado extraordinario' de un país que apenas conocía, firmó el Tratado Hay-Bunau Varilla el 18 de noviembre. Panamá cedía a perpetuidad una zona de 10 millas de ancho por donde pasaría el canal, por solo $10 millones iniciales y $250,000 anuales. Los panameños protestaron: habían cambiado un amo por otro.\n\nColombia, débil y sumida en la Guerra de los Mil Días, no pudo hacer nada. En 1921, bajo presión estadounidense, reconoció la independencia panameña a cambio de $25 millones. La herida nunca cerró completamente: cada 3 de noviembre, Panamá celebra su independencia, mientras en Colombia se recuerda como 'la pérdida'.",
        imagenes: []
      }
    ]
  },
  {
    titulo: "La Revolución Cubana: De la Sierra Maestra a La Habana",
    subtitulo: "La guerrilla que derrocó a Batista y desafió a Estados Unidos",
    descripcionCorta: "Cómo 82 revolucionarios liderados por Fidel Castro cambiaron la historia de Cuba y América Latina.",
    ambito: "latinoamerica",
    categoria: "revolucion",
    imagen: "https://example.com/revolucion-cubana.jpg",
    duracionEstimada: 60,
    capitulos: [
      {
        numero: 1,
        titulo: "El Asalto al Cuartel Moncada",
        contenido: "El 26 de julio de 1953, 135 jóvenes revolucionarios atacaron el cuartel Moncada en Santiago de Cuba, segunda fortaleza militar del país. El plan era audaz: capturar armas, incitar una insurrección popular y derrocar al dictador Fulgencio Batista. Pero todo salió mal: la mayoría fueron capturados o ejecutados sumariamente.\n\nFidel Castro, abogado de 26 años, fue capturado días después. En su defensa ante el tribunal pronunció el famoso discurso 'La Historia me Absolverá', donde expuso el programa revolucionario: reforma agraria, industrialización, educación y salud gratuitas. Condenado a 15 años, fue liberado en 1955 por una amnistía y se exilió en México, donde comenzó a reorganizar el movimiento.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "El Granma y la Guerra de Guerrillas",
        contenido: "El 25 de noviembre de 1956, 82 hombres zarparon del puerto mexicano de Tuxpan en el yate Granma, diseñado para 12 personas. Tras 7 días de penurias, llegaron el 2 de diciembre a Playa Las Coloradas. Fueron emboscados por el ejército: solo 12 sobrevivieron, entre ellos Fidel, su hermano Raúl, el argentino Ernesto 'Che' Guevara y Camilo Cienfuegos.\n\nLos sobrevivientes se refugiaron en la Sierra Maestra. Desde allí, con apoyo campesino, libraron una guerra de guerrillas brillante. El Che Guevara, médico convertido en comandante, estableció una eficiente red de apoyo logístico. Mientras, en las ciudades, el Movimiento 26 de Julio dirigido por Frank País organizaba huelgas y sabotajes.",
        imagenes: []
      },
      {
        numero: 3,
        titulo: "La Toma del Poder y la Guerra Fría",
        contenido: "A mediados de 1958, la ofensiva rebelde se expandió. Columnas comandadas por el Che y Camilo Cienfuegos avanzaron hacia el occidente. En diciembre, la batalla de Santa Clara fue decisiva: el tren blindado del gobierno fue capturado, y Batista huyó el 1 de enero de 1959.\n\nEl 8 de enero, Fidel entró triunfante en La Habana. Pronto las reformas radicales (expropiación de latifundios, nacionalización de empresas estadounidenses) provocaron la ruptura con Washington. En 1961, la fallida invasión de Bahía de Cochinos y la Crisis de los Misiles al año siguiente colocaron a Cuba en el centro de la Guerra Fría, posición que mantendría por décadas.",
        imagenes: []
      }
    ]
  },
  {
    titulo: "Operación Cóndor: La Internacional del Terror",
    subtitulo: "Cómo las dictaduras sudamericanas coordinaron la represión 1975-1983",
    descripcionCorta: "La alianza clandestina que permitió a las dictaduras secuestrar, torturar y asesinar opositores a través de fronteras.",
    ambito: "latinoamerica",
    categoria: "derechos_humanos",
    imagen: "https://example.com/operacion-condor.jpg",
    duracionEstimada: 65,
    capitulos: [
      {
        numero: 1,
        titulo: "Los Regímenes se Organizan",
        contenido: "A mediados de los años 70, América del Sur estaba dominada por dictaduras militares: Augusto Pinochet en Chile (1973), la Junta Militar en Argentina (1976), Hugo Banzer en Bolivia (1971), Alfredo Stroessner en Paraguay (1954), y los militares en Uruguay (1973) y Brasil (1964). Compartían un enemigo común: la 'subversión' de izquierda.\n\nEn noviembre de 1975, en Santiago de Chile, los jefes de inteligencia de estos países se reunieron secretamente. Con apoyo logístico de la CIA (según documentos desclasificados), crearon la Operación Cóndor: un sistema de cooperación para perseguir a opositores políticos más allá de las fronteras. Compartían listas de 'blancos', interceptaban comunicaciones, y coordinaban operaciones conjuntas.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "Secuestros Transfronterizos y Vuelos de la Muerte",
        contenido: "El modus operandi era aterrador: agentes de un país podían secuestrar a alguien en territorio de otro país y 'devolverlo' a su nación de origen. Así murieron cientos. El caso más emblemático: los exiliados chilenos Jorge Fuentes y el general chileno Carlos Prats, asesinados en Buenos Aires.\n\nEn Argentina, los 'vuelos de la muerte' arrojaban prisioneros sedados al Río de la Plata o al mar. En Chile, la DINA (Dirección de Inteligencia Nacional) operaba centros de tortura como Villa Grimaldi. En Uruguay, 1 de cada 50 ciudadanos fue preso político. En Paraguay, los 'Archivos del Terror' descubiertos en 1992 documentarían 50,000 personas asesinadas, 30,000 desaparecidas y 400,000 encarceladas.",
        imagenes: []
      },
      {
        numero: 3,
        titulo: "El Caso Letelier y el Fin del Cóndor",
        contenido: "El asesinato que expuso la operación internacionalmente ocurrió en Washington D.C. El 21 de septiembre de 1976, un coche bomba mató al ex canciller chileno Orlando Letelier y a su asistente Ronni Moffitt. La investigación del FBI reveló la autoría de la DINA chilena.\n\nLa presión estadounidense, combinada con el retorno gradual de la democracia en los 80 (Argentina 1983, Uruguay 1985, Chile 1990), desmanteló la red. Pero las heridas permanecen: se estima que el Cóndor causó 60,000 muertos y 400,000 presos políticos. Los procesos judiciales continúan hasta hoy, como el histórico juicio en Argentina (2016) que condenó a 15 ex represores por los crímenes del Plan Cóndor.",
        imagenes: []
      }
    ]
  },
  {
    titulo: "La Década Perdida: América Latina Endeudada",
    subtitulo: "La crisis que sumió a la región en la pobreza 1982-1990",
    descripcionCorta: "Cómo el colapso de la deuda externa transformó economías enteras y dio paso al neoliberalismo.",
    ambito: "latinoamerica",
    categoria: "economico",
    imagen: "https://example.com/crisis-deuda.jpg",
    duracionEstimada: 52,
    capitulos: [
      {
        numero: 1,
        titulo: "La Fiesta del Crédito Barato",
        contenido: "En los años 70, los bancos internacionales nadaban en petrodólares. Los países árabes, ricos por el embargo petrolero de 1973, depositaban sus excedentes en bancos estadounidenses y europeos. Estos, a su vez, prestaban masivamente a América Latina con tasas de interés bajas.\n\nMéxico, Brasil, Argentina y Chile se endeudaron alegremente: construyeron infraestructuras, subsidios, y en algunos casos, financiaron dictaduras militares. Para 1982, la deuda latinoamericana superaba los $300 mil millones. Nadie parecía preocuparse: las materias primas que exportaba la región (petróleo, cobre, café) tenían precios récord. Era la fiesta del 'desarrollo con deuda'.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "El Efecto Volcker y el Default Mexicano",
        contenido: "En 1979, Paul Volcker, presidente de la Reserva Federal de EE.UU., subió las tasas de interés para controlar la inflación. De la noche a la mañana, los pagos de intereses de la deuda latinoamericana se dispararon. Simultáneamente, los precios de las materias primas colapsaron.\n\nEl 12 de agosto de 1982, el secretario de Hacienda mexicano, Jesús Silva Herzog, llamó al FMI y al Tesoro estadounidense: 'México no puede pagar'. La noticia desató el pánico. Brasil, Argentina, Chile y otros siguieron. Era la primera crisis de deuda soberana global desde los años 30.",
        imagenes: []
      },
      {
        numero: 3,
        titulo: "Los Planes de Ajuste y el Costo Social",
        contenido: "El Fondo Monetario Internacional impuso durísimos planes de ajuste: reducir gasto público, eliminar subsidios, devaluar monedas, privatizar empresas estatales. El resultado fue devastador: hiperinflación (en Argentina llegó al 3,000% anual), desempleo masivo, y caída del PIB per cápita.\n\nEn México, el salario mínimo perdió 50% de su poder adquisitivo. En Perú, Alan García declaró unilateralmente que solo pagaría el 10% de las exportaciones como servicio de la deuda, aislando al país. Brasil implementó el Plan Cruzado con congelación de precios, que inicialmente funcionó pero luego generó escasez y mercado negro.\n\nLa 'década perdida' dejó profundas cicatrices: aumentó la pobreza del 40% al 48% de la población, migraciones masivas, y sentó las bases para la adopción del modelo neoliberal en los 90.",
        imagenes: []
      }
    ]
  },
  {
    titulo: "El Éxodo Venezolano: La Crisis Humanitaria del Siglo XXI",
    subtitulo: "Cómo 7 millones de venezolanos abandonaron su país 2015-2023",
    descripcionCorta: "La mayor crisis migratoria en la historia de América Latina, comparable solo con Siria a nivel mundial.",
    ambito: "latinoamerica",
    categoria: "social",
    imagen: "https://example.com/migracion-venezolana.jpg",
    duracionEstimada: 55,
    capitulos: [
      {
        numero: 1,
        titulo: "El Colapso de la Revolución Bolivariana",
        contenido: "En 2013, tras la muerte de Hugo Chávez, Nicolás Maduro heredó una economía ya debilitada pero con precios del petróleo altos. Para 2015, el barril cayó de $100 a $30, exponiendo la vulnerabilidad de un país que obtenía el 96% de sus divisas del crudo.\n\nLa crisis se profundizó: hiperinflación que llegó a 1,700,000% en 2018, escasez de alimentos y medicinas (87% de pobreza según ENCOVI), colapso de servicios básicos. Hospitales sin agua, electricidad por racionamiento, y un sistema educativo paralizado. Lo que comenzó como una migración de profesionales (médicos, ingenieros, profesores) se transformó en un éxodo masivo de todas las clases sociales.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "Los Caminantes y las Rutas del Desespero",
        contenido: "Sin dinero para aviones, los venezolanos comenzaron a caminar. La ruta más transitada: Cúcuta (frontera colombo-venezolana) hacia Bogotá, un trayecto de 600 km a pie. Familias enteras con niños, ancianos y mascotas. Algunos continuaban a Perú, Chile o Argentina.\n\nColombia, el principal receptor, acogió a 2.5 millones de migrantes. Otros destinos: Perú (1.5 millones), Chile (450,000), Ecuador (500,000). En 2018, el flujo era de 5,000 personas diarias cruzando por Cúcuta. Las imágenes de la 'trocha' (paso irregular) mostraban a personas cruzando el río Táchira con el agua al cuello, cargando maletas plásticas.",
        imagenes: []
      },
      {
        numero: 3,
        titulo: "Xenofobia, Solidaridad y Futuro Incierto",
        contenido: "La recepción fue inicialmente solidaria, especialmente en Colombia con el Estatuto de Protección Temporal. Pero la magnitud generó tensiones: en ciudades fronterizas, los servicios de salud y educación colapsaron. En Perú y Chile, protestas bajo el lema 'No más venecos'.\n\nLos migrantes enfrentan explotación laboral, trata de personas, y discriminación. Muchos profesionales terminan trabajando en oficios informales. La pandemia de COVID-19 agravó la situación: sin trabajo, muchos emprendieron el 'retorno caminando' a Venezuela.\n\nA 2023, la diáspora venezolana supera los 7 millones (25% de la población). La integración es el gran desafío, mientras la situación en Venezuela no mejora sustancialmente. La crisis redefine la demografía latinoamericana y plantea preguntas difíciles sobre solidaridad regional y derechos humanos.",
        imagenes: []
      }
    ]
  },
  {
    titulo: "Los Hijos del Sol: Imperio Inca y Resistencia Aymara",
    subtitulo: "Civilizaciones que dominaron los Andes y su legado perdurable",
    descripcionCorta: "Desde el esplendor del Tahuantinsuyo hasta la resistencia cultural que perdura cinco siglos después.",
    ambito: "latinoamerica",
    categoria: "cultural",
    imagen: "https://example.com/incas-aymaras.jpg",
    duracionEstimada: 58,
    capitulos: [
      {
        numero: 1,
        titulo: "El Tahuantinsuyo: Un Imperio Vertical",
        contenido: "En solo un siglo (1438-1533), los incas construyeron el imperio más extenso de la América precolombina: 2 millones de km² desde Colombia hasta Chile. Su secreto: adaptación al medio ambiente andino. Desarrollaron agricultura en terrazas (andenes), un sistema de caminos (Qhapaq Ñan) de 30,000 km, y almacenes (qullqas) para redistribuir alimentos.\n\nLa sociedad estaba organizada en ayllus (comunidades) basadas en reciprocidad. La mita era un sistema de trabajo por turnos para obras públicas. No tenían escritura, pero usaban los quipus (cuerdas con nudos) para registrar información estadística y quizás narrativa. Cuzco, la capital, era el 'ombligo del mundo', diseñada en forma de puma sagrado.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "Los Aymaras: Antes y Después de los Incas",
        contenido: "Los aymaras, con centros en Tiwanaku (300-1150 d.C.), fueron una civilización anterior a los incas que dominó el altiplano. Tiwanaku, a 3,850 msnm, fue una ciudad ceremonial con monumentos como la Puerta del Sol y el templete semisubterráneo. Su influencia cultural se extendió hasta Chile y Argentina.\n\nCuando los incas conquistaron el territorio aymara en el siglo XV, encontraron una resistencia feroz. Los aymaras mantuvieron su lengua, organización social y ritos. De hecho, el quechua (lengua inca) nunca reemplazó completamente al aymara en la región del lago Titicaca. Esta resistencia cultural sería crucial durante la colonia.",
        imagenes: []
      },
      {
        numero: 3,
        titulo: "Resistencia y Sincretismo en la Colonia",
        contenido: "Tras la conquista española (1532), ambas culturas enfrentaron el colapso demográfico (de 12 a 1.5 millones en un siglo) y la imposición del cristianismo. Pero la resistencia fue constante: el Taki Onqoy ('enfermedad del baile'), movimiento mesiánico de los años 1560, predicaba el rechazo a lo español y el retorno a los huacas.\n\nLos aymaras protagonizaron grandes rebeliones: Túpac Katari (1781) sitió La Paz durante 184 días con 40,000 indígenas antes de ser descuartizado. Su frase profética: 'Volveré y seré millones'.\n\nHoy, 500 años después, 10 millones hablan quechua y 2 millones aymara. Festividades como el Inti Raymi (Cuzco) y la Alasita (La Paz) mezclan tradiciones prehispánicas con catolicismo. La cosmovisión andina, con su concepto de Pachamama (Madre Tierra) y la reciprocidad, influye incluso en constituciones modernas como la boliviana.",
        imagenes: []
      }
    ]
  },

  // MUNDIAL
  {
    titulo: "La Gran Guerra: El Fin de la Inocencia",
    subtitulo: "El conflicto que destruyó imperios y dio paso al siglo XX 1914-1918",
    descripcionCorta: "La guerra que mató a 20 millones de personas y cambió para siempre la política, la tecnología y la sociedad.",
    ambito: "mundial",
    categoria: "guerra",
    imagen: "https://example.com/primera-guerra.jpg",
    duracionEstimada: 70,
    capitulos: [
      {
        numero: 1,
        titulo: "El Asesinato en Sarajevo y la Máquina de la Guerra",
        contenido: "El 28 de junio de 1914, en Sarajevo, el archiduque Francisco Fernando de Austria y su esposa Sofía fueron asesinados por Gavrilo Princip, un nacionalista serbio bosnio. El incidente habría quedado en un atentado terrorista más de no ser por el sistema de alianzas que envolvió a Europa.\n\nAustria-Hungría, con apoyo alemán, envió un ultimátum imposible a Serbia. Rusia movilizó tropas en apoyo de Serbia. Alemania declaró la guerra a Rusia y a Francia. Cuando Alemania invadió Bélgica (neutral) para atacar Francia, Gran Bretaña entró en la guerra. En un mes, 6 potencias europeas estaban en guerra. Los generales creían que sería corta: 'De vuelta para Navidad', decían los soldados alemanes.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "El Infierno de las Trincheras",
        contenido: "La guerra de movimiento se estancó en el frente occidental en noviembre de 1914. De Suiza al Mar del Norte, 700 km de trincheras enfrentaban a alemanes contra franceses y británicos. La vida allí era un infierno: barro, ratas, piojos, y el constante terror de la artillería.\n\nEn 1916, dos batallas simbolizaron la carnicería: Verdún (febrero-diciembre), donde murieron 700,000 hombres por unos kilómetros, y el Somme (julio-noviembre), donde el primer día murieron 20,000 británicos. Se usaron nuevas armas: gas venenoso (Ypres, 1915), tanques (Somme, 1916), aviación de combate. La guerra industrial había nacido, y el ser humano era su materia prima desechable.",
        imagenes: []
      },
      {
        numero: 3,
        titulo: "El Colapso y las Consecuencias",
        contenido: "En 1917, dos eventos cambiaron la guerra: Estados Unidos entró tras el hundimiento del Lusitania y el Telegrama Zimmermann, y Rusia salió tras la Revolución Bolchevique. En 1918, la ofensiva final alemana casi triunfó, pero las tropas estadounidenses frescas inclinaron la balanza.\n\nEl armisticio del 11 de noviembre de 1918 encontró a Europa devastada: 20 millones de muertos, 21 millones de heridos, imperios desaparecidos (alemán, austrohúngaro, otomano, ruso). El Tratado de Versalles (1919) humilló a Alemania, sembrando las semillas de la Segunda Guerra. El mapa de Medio Oriente dibujado por franceses y británicos generó conflictos que duran hasta hoy. La Gran Guerra no fue 'la guerra que terminaría todas las guerras', sino el preludio de un siglo de violencia.",
        imagenes: []
      }
    ]
  },
  {
    titulo: "La Segunda Guerra Mundial: Europa en Llamas",
    subtitulo: "El conflicto que cambió el mundo 1939-1945",
    descripcionCorta: "La guerra más devastadora de la historia humana, con más de 70 millones de víctimas.",
    ambito: "mundial",
    categoria: "guerra",
    imagen: "https://example.com/ww2.jpg",
    duracionEstimada: 60,
    capitulos: [
      {
        numero: 1,
        titulo: "El Ascenso del Nazismo",
        contenido: "Alemania emergió de la Primera Guerra Mundial humillada y en crisis. El Tratado de Versalles le impuso reparaciones imposibles de pagar. La inflación se disparó: en 1923, un pan costaba miles de millones de marcos. El desempleo alcanzó el 30%.\n\nEn este contexto de desesperación, Adolf Hitler y el Partido Nazi encontraron terreno fértil. Su mensaje era simple pero efectivo: Alemania había sido traicionada, y solo una mano fuerte podía restaurar su grandeza. Prometió trabajo, orgullo nacional y un enemigo claro al cual culpar: los judíos.\n\nEn 1933, Hitler fue nombrado canciller. En menos de dos años, había eliminado toda oposición, establecido un estado totalitario y comenzado la persecución sistemática de judíos, gitanos, homosexuales y disidentes políticos. El camino hacia la guerra estaba trazado.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "La Invasión de Polonia",
        contenido: "El 1 de septiembre de 1939, a las 4:45 am, el acorazado alemán Schleswig-Holstein abrió fuego contra la guarnición polaca en Westerplatte. Simultáneamente, 1.5 millones de soldados alemanes cruzaron la frontera polaca. La Blitzkrieg (guerra relámpago) había comenzado.\n\nPolon ia resistió valientemente, pero estaba superada en tecnología y números. La Luftwaffe destruyó la fuerza aérea polaca en tierra. Los tanques alemanes avanzaban sin oposición efectiva. El 17 de septiembre, la Unión Soviética invadió por el este según un pacto secreto con Alemania.\n\nEl 28 de septiembre, Varsovia se rindió. Polonia había dejado de existir como nación independiente. Francia y Gran Bretaña le habían declarado la guerra a Alemania, pero no pudieron ayudar a tiempo. La Segunda Guerra Mundial había comenzado.",
        imagenes: []
      }
    ]
  },

  {
    titulo: "La Guerra Fría: El Mundo Dividido",
    subtitulo: "Capitalismo vs. Comunismo 1947-1991",
    descripcionCorta: "Cuatro décadas de tensión global entre Estados Unidos y la Unión Soviética que definió la segunda mitad del siglo XX.",
    ambito: "mundial",
    categoria: "politico",
    imagen: "https://example.com/guerra-fria.jpg",
    duracionEstimada: 55,
    capitulos: [
      {
        numero: 1,
        titulo: "El Telón de Acero",
        contenido: "El 5 de marzo de 1946, en Fulton, Missouri, Winston Churchill pronunció un discurso que definiría la nueva realidad global: 'Desde Stettin en el Báltico hasta Trieste en el Adriático, un telón de acero ha descendido sobre el continente'.\n\nLa alianza entre Estados Unidos y la Unión Soviética durante la Segunda Guerra Mundial había sido circunstancial. Con Hitler derrotado, las diferencias ideológicas emergieron con fuerza. Europa quedó dividida: el oeste capitalista y democrático bajo influencia estadounidense, el este comunista bajo control soviético.\n\nEn 1948, el Bloqueo de Berlín marcó el primer gran enfrentamiento. Stalin cortó todos los accesos terrestres a Berlín Occidental. La respuesta estadounidense fue espectacular: el Puente Aéreo de Berlín, transportando suministros por aire durante 11 meses hasta que Stalin levantó el bloqueo.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "La Crisis de los Misiles en Cuba",
        contenido: "En octubre de 1962, el mundo estuvo a 13 días de una guerra nuclear. Un avión espía U-2 estadounidense fotografió instalaciones de misiles soviéticos en Cuba, a solo 150 kilómetros de Florida. Los misiles nucleares podían alcanzar Washington en minutos.\n\nEl presidente John F. Kennedy enfrentaba el mayor dilema de su vida: ¿un ataque militar preventivo que podría desencadenar la Tercera Guerra Mundial, o una respuesta más moderada que pudiera verse como debilidad? Optó por un bloqueo naval llamado eufemísticamente 'cuarentena'.\n\nDurante 13 días, el mundo contuvo la respiración. Buques soviéticos navegaban hacia Cuba con más misiles. Las fuerzas estadounidenses estaban en DEFCON 2, el nivel más alto antes de la guerra nuclear. El 28 de octubre, Nikita Jrushchov aceptó retirar los misiles. La humanidad había esquivado la aniquilación por poco.",
        imagenes: []
      }
    ]
  },

  {
    titulo: "La Revolución Digital: De ARPANET a Internet",
    subtitulo: "Cómo la tecnología transformó el mundo 1969-2000",
    descripcionCorta: "La historia de cómo una red militar se convirtió en la fuerza más transformadora de la era moderna.",
    ambito: "mundial",
    categoria: "tecnologia",
    imagen: "https://example.com/internet.jpg",
    duracionEstimada: 40,
    capitulos: [
      {
        numero: 1,
        titulo: "ARPANET: Los Primeros Pasos",
        contenido: "El 29 de octubre de 1969, a las 10:30 pm, el programador Charley Kline en UCLA intentó enviar el mensaje 'LOGIN' a una computadora en Stanford. El sistema se cayó después de transmitir solo 'LO'. Sin saberlo, acababa de enviar el primer mensaje de lo que se convertiría en Internet.\n\nARPANET nació en plena Guerra Fría como un proyecto militar: crear una red de comunicaciones que pudiera sobrevivir a un ataque nuclear. La idea revolucionaria era la conmutación de paquetes: dividir la información en pequeños paquetes que podían viajar por diferentes rutas.\n\nEn 1971, Ray Tomlinson inventó el correo electrónico y eligió el símbolo @ para separar el nombre del usuario de la computadora. Para 1973, ARPANET había crecido a 40 nodos y se había expandido internacionalmente.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "La World Wide Web",
        contenido: "En 1989, en el CERN (Suiza), un científico británico llamado Tim Berners-Lee escribió una propuesta para un sistema de gestión de información. Su jefe escribió en la parte superior 'Vago pero emocionante'. Acababa de nacer el concepto de la World Wide Web.\n\nBerners-Lee desarrolló tres tecnologías fundamentales: HTML (lenguaje de marcado), HTTP (protocolo de transferencia) y URL (sistema de direcciones). Lo revolucionario era la idea del hipertexto: documentos conectados entre sí mediante enlaces clickeables.\n\nEn 1991, el CERN puso el primer sitio web en línea. En 1993, el navegador Mosaic hizo la web accesible al público general. Para el año 2000, había 70 millones de sitios web. La revolución digital había transformado completamente la sociedad humana.",
        imagenes: []
      }
    ]
  },

  {
    titulo: "El Apartheid en Sudáfrica",
    subtitulo: "La lucha contra la segregación racial 1948-1994",
    descripcionCorta: "Cómo un sistema de discriminación racial institucionalizada fue derrotado por la resistencia pacífica y la presión internacional.",
    ambito: "mundial",
    categoria: "derechos_humanos",
    imagen: "https://example.com/apartheid.jpg",
    duracionEstimada: 45,
    capitulos: [
      {
        numero: 1,
        titulo: "La Institucionalización del Racismo",
        contenido: "En 1948, el Partido Nacional llegó al poder en Sudáfrica con una promesa: apartheid (separación). Lo que siguió fue la codificación legal del racismo. La Ley de Registro de la Población clasificaba a todos en blancos, negros, mestizos o asiáticos.\n\nLa Ley de Áreas de Grupo obligó a 3.5 millones de personas negras a abandonar sus hogares y mudarse a 'bantustanes', territorios segregados sin recursos. Los matrimonios interraciales fueron prohibidos. Los negros necesitaban pases para moverse, y violaciones menores podían resultar en prisión.\n\nEl sistema era kafkiano: una persona podía ser clasificada como blanca pero su hermano como mestizo. Familias fueron separadas. Los mejores trabajos, escuelas, playas, hospitales y hasta baños públicos estaban reservados para blancos.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "La Resistencia se Organiza",
        contenido: "El Congreso Nacional Africano (ANC), fundado en 1912, inicialmente buscó cambios mediante métodos pacíficos. Pero la brutalidad del apartheid radicalizó el movimiento. En 1960, en Sharpeville, la policía abrió fuego contra manifestantes desarmados, matando a 69 personas, muchas por la espalda.\n\nNelson Mandela, un joven abogado, concluyó que la resistencia pacífica no era suficiente. En 1961 fundó Umkhonto we Sizwe (Lanza de la Nación), el brazo armado del ANC. No buscaban matar civiles, sino sabotear infraestructura del gobierno.\n\nEn 1964, Mandela fue condenado a cadena perpetua. Su declaración en el juicio resonó mundialmente: 'He luchado contra la dominación blanca y he luchado contra la dominación negra. He acariciado el ideal de una sociedad democrática y libre en la que todas las personas vivan juntas en armonía'. Pasaría 27 años en prisión.",
        imagenes: []
      }
    ]
  },

  {
    titulo: "La Revolución Francesa",
    subtitulo: "Libertad, Igualdad, Fraternidad 1789-1799",
    descripcionCorta: "Una década que transformó Francia y cambió para siempre el curso de la historia mundial.",
    ambito: "mundial",
    categoria: "revolucion",
    imagen: "https://example.com/revolucion-francesa.jpg",
    duracionEstimada: 50,
    capitulos: [
      {
        numero: 1,
        titulo: "El Antiguo Régimen en Crisis",
        contenido: "En 1789, Francia era la nación más poderosa de Europa, pero estaba al borde del colapso. Luis XVI había heredado un reino en bancarrota. Las guerras, especialmente el apoyo a la independencia estadounidense, habían vaciado las arcas. El pueblo pagaba impuestos agobiantes mientras la nobleza y el clero vivían exentos.\n\nEl invierno de 1788-89 fue brutal. Las cosechas se perdieron. El precio del pan, alimento básico del pueblo, se triplicó. En París, la gente pasaba hambre mientras la corte de Versalles derrochaba en fiestas. La tensión era insostenible.\n\nLuis XVI, presionado, convocó los Estados Generales, una asamblea no reunida desde 1614. Era una admisión de que el sistema estaba roto. Los representantes del Tercer Estado (el pueblo común) llegaron a Versalles con 40,000 cahiers de doléances (cuadernos de quejas). La revolución estaba en el aire.",
        imagenes: []
      }
    ]
  },
  {
    titulo: "La Gran Colombia: Un Sueño de Unidad",
    subtitulo: "El proyecto bolivariano 1819-1831",
    descripcionCorta: "La historia de la unión de Colombia, Venezuela, Ecuador y Panamá bajo un solo país.",
    ambito: "latinoamerica",
    categoria: "politico",
    imagen: "https://example.com/grancolombia.jpg",
    duracionEstimada: 40,
    capitulos: [
      {
        numero: 1,
        titulo: "El Congreso de Angostura",
        contenido: "En 1819, Simón Bolívar convocó un congreso en Angostura (hoy Ciudad Bolívar, Venezuela) donde presentó su visión de una gran nación sudamericana unida...",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "Apogeo y Conflictos",
        contenido: "Durante su corta existencia, la Gran Colombia enfrentó desafíos enormes: grandes distancias, rivalidades regionales, y visiones políticas divergentes...",
        imagenes: []
      }
    ]
  },
  {
    titulo: "Máquinas, Vapor y Capitalismo: La Revolución Industrial",
    subtitulo: "La transformación que creó el mundo moderno 1760-1840",
    descripcionCorta: "Cómo la máquina de vapor, las fábricas y el ferrocarril cambiaron para siempre la economía, la sociedad y el medio ambiente.",
    ambito: "mundial",
    categoria: "tecnologia",
    imagen: "https://example.com/revolucion-industrial.jpg",
    duracionEstimada: 65,
    capitulos: [
      {
        numero: 1,
        titulo: "Inglaterra: El Taller del Mundo",
        contenido: "Todo comenzó en la industria textil británica. La lanzadera volante de John Kay (1733), la hiladora jenny de Hargreaves (1764) y el telar hidráulico de Arkwright (1769) multiplicaron la producción. Pero la verdadera revolución llegó con James Watt y su máquina de vapor perfeccionada (1769), que liberó a las fábricas de depender de ríos para energía.\n\nManchester se convirtió en la primera ciudad industrial: de 25,000 habitantes en 1770 a 400,000 en 1850. Las chimeneas oscurecieron el cielo, el río Irwell se volvió una cloaca. La rentabilidad era tal que el algodón importado de las plantaciones esclavistas estadounidenses se transformaba en tela que se exportaba a todo el mundo, incluyendo la India, destruyendo su industria textil tradicional.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "El Ferrocarril y la Segunda Revolución",
        contenido: "En 1825, la línea Stockton-Darlington inauguró la era del ferrocarril. Para 1850, Gran Bretaña tenía 10,000 km de vías. El tren redujo costos, unificó mercados nacionales y creó la hora estándar (antes, cada ciudad tenía su hora local).\n\nLa industrialización se extendió a Bélgica, Francia, Alemania y EE.UU. En Pittsburgh y el Ruhr, el carbón y el hierro crearon gigantes siderúrgicos. Nuevas tecnologías: el convertidor Bessemer (1856) abarató el acero, el telégrafo (1844) revolucionó las comunicaciones. La 'segunda revolución industrial' (1870-1914) trajo la electricidad, el motor de combustión y la producción en masa.",
        imagenes: []
      },
      {
        numero: 3,
        titulo: "La Cuestion Social y el Legado",
        contenido: "El costo humano fue enorme: jornadas de 14-16 horas, salarios miserables, trabajo infantil (en 1830, el 50% de los trabajadores textiles eran niños). El smog londinense mataba miles. Friedrich Engels documentó estas condiciones en 'La Situación de la Clase Obrera en Inglaterra' (1845).\n\nLas respuestas fueron el ludismo (destrucción de máquinas), el sindicalismo, y el socialismo de Marx y Engels ('Manifiesto Comunista', 1848). Las reformas llegaron lentamente: leyes de fábricas que limitaban el trabajo infantil, educación pública, viviendas obreras.\n\nLa Revolución Industrial creó el mundo moderno: urbanización masiva, clases sociales definidas por el capital, crecimiento económico exponencial, pero también contaminación y desigualdad. Fue, en palabras de Eric Hobsbawm, 'el evento más importante en la historia humana desde la invención de la agricultura'.",
        imagenes: []
      }
    ]
  },
  {
    titulo: "Roma: De República a Imperio y Su Caída",
    subtitulo: "1,000 años que definieron Occidente 753 a.C. - 476 d.C.",
    descripcionCorta: "La historia completa de cómo una aldea del Tíber conquistó el mundo mediterráneo y por qué colapsó.",
    ambito: "mundial",
    categoria: "politico",
    imagen: "https://example.com/imperio-romano.jpg",
    duracionEstimada: 75,
    capitulos: [
      {
        numero: 1,
        titulo: "La República Conquistadora",
        contenido: "Según la leyenda, Rómulo fundó Roma el 21 de abril del 753 a.C. Tras derrocar a los reyes etruscos (509 a.C.), se estableció la República: sistema de checks and balances con cónsules, senado y asambleas. Pero la verdadera fuerza romana era su ejército ciudadano y su pragmatismo: incorporaba a los pueblos conquistados, dándoles ciudadanía parcial.\n\nEn las Guerras Púnicas (264-146 a.C.), Roma destruyó Cartago. En el 146 a.C., Corinto cayó, completando el dominio del Mediterráneo ('Mare Nostrum'). Pero la expansión trajo problemas: latifundios esclavistas arruinaron a los pequeños campesinos, y generales ambiciosos como Mario, Sila y Pompeyo desestabilizaron la República.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "El Alto Imperio: Pax Romana",
        contenido: "Tras la guerra civil entre César y Pompeyo, y el asesinato de César (44 a.C.), su hijo adoptivo Octavio derrotó a Marco Antonio y Cleopatra (31 a.C.). En el 27 a.C., el Senado le dio el título de Augusto, iniciando el Imperio.\n\nLos siguientes dos siglos fueron la 'Pax Romana': estabilidad, construcción de calzadas (80,000 km), acueductos, y un derecho unificado. El imperio alcanzó su máxima extensión con Trajano (117 d.C.): desde Britania hasta Mesopotamia, 5 millones de km² y 70 millones de habitantes. Roma, la ciudad, superó el millón de habitantes con edificios como el Coliseo y el Panteón.",
        imagenes: []
      },
      {
        numero: 3,
        titulo: "La Lenta Agonía",
        contenido: "La crisis del siglo III (235-284) fue casi terminal: 26 emperadores en 50 años, invasiones germánicas, inflación galopante, y el Imperio se dividió en tres. Diocleciano (284-305) lo salvó temporalmente con reformas, pero estableciendo la tetrarquía que dividiría definitivamente el imperio en Oriente y Occidente.\n\nConstantino (306-337) legalizó el cristianismo y fundó Constantinopla, desplazando el centro de poder al este. Teodosio (379-395) hizo del cristianismo religión oficial y dividió el imperio entre sus hijos: Arcadio (Oriente) y Honorio (Occidente).\n\nOccidente sucumbió lentamente: saqueo de Roma por Alarico (410), vándalos en Cartago (439), y en 476, Odoacro depuso al último emperador, Rómulo Augústulo. El Imperio Romano de Oriente (Bizantino) sobreviviría hasta 1453, pero el Occidente medieval había nacido.",
        imagenes: []
      }
    ]
  },
  {
    titulo: "El Islam: De Mahoma a un Imperio Global",
    subtitulo: "La rápida expansión que creó una nueva civilización 622-750",
    descripcionCorta: "Cómo en apenas 100 años, los seguidores de Mahoma construyeron un imperio desde España hasta India.",
    ambito: "mundial",
    categoria: "cultural",
    imagen: "https://example.com/expansion-islam.jpg",
    duracionEstimada: 60,
    capitulos: [
      {
        numero: 1,
        titulo: "Mahoma y la Hégira",
        contenido: "En el 610 d.C., en La Meca (actual Arabia Saudí), un comerciante de 40 años llamado Mahoma comenzó a recibir revelaciones del arcángel Gabriel. Su mensaje: un estricto monoteísmo (Alá es el único Dios) que rechazaba los ídolos de la Kaaba. Perseguido por los comerciantes mequíes cuyos negocios dependían del peregrinaje pagano, en el 622 huyó a Medina (la Hégira), evento que marca el inicio del calendario musulmán.\n\nEn Medina, Mahoma unificó las tribus árabes bajo el Islam. En el 630, regresó triunfal a La Meca, limpió la Kaaba de ídolos y la dedicó a Alá. Cuando murió en el 632, toda Arabia estaba unificada bajo la nueva fe. Su sucesor (califa) Abu Bakr enfrentó rebeliones, pero las sofocó y comenzó la expansión.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "Las Conquistas Relámpago",
        contenido: "Bajo los califas Omar (634-644) y Otmán (644-656), los ejércitos árabes barrieron a dos imperios agotados. En el 636, en la batalla de Yarmuk, derrotaron al Imperio Bizantino y tomaron Siria y Palestina (Jerusalén cayó en el 638). En el 637, en Qadisiyah, destruyeron al Imperio Sasánida persa.\n\nEn el 642, Egipto cayó. En el 651, el último sha persa fue asesinado. Los bereberes islamizados cruzaron el estrecho de Gibraltar en el 711 bajo Tariq ibn Ziyad (Gibraltar = Jabal Tariq, 'montaña de Tariq'). En la batalla de Guadalete, derrotaron a los visigodos y en 5 años controlaron casi toda la península ibérica. Solo en el 732, en Poitiers, los francos de Carlos Martel detuvieron su avance en Europa.",
        imagenes: []
      },
      {
        numero: 3,
        titulo: "El Califato Omeya y el Legado Cultural",
        contenido: "Los Omeyas (661-750) establecieron la capital en Damasco y crearon un estado imperial. Tolerantes con 'gente del libro' (cristianos y judíos), que pagaban un impuesto (yizia) pero mantenían sus leyes y religión. Esto explica la rápida conversión: muchos prefirieron el Islam para evitar impuestos y tener plenos derechos.\n\nEn el 750, los Abbasíes derrocaron a los Omeyas y trasladaron la capital a Bagdad, iniciando la 'Edad de Oro' islámica. Mientras Europa entraba en la Edad Media, el Islam preservaba y ampliaba el conocimiento griego, desarrollaba álgebra (al-Juarismi), medicina (Avicena), y filosofía (Averroes).\n\nLa expansión creó una civilización que iba de Córdoba (con su mezquita de 600 columnas) a Samarcanda, uniendo por primera vez el mundo mediterráneo con Asia a través del comercio y la fe.",
        imagenes: []
      }
    ]
  },
  {
    titulo: "El Mundo es Plano: La Era de la Globalización",
    subtitulo: "Conexión económica, tecnológica y cultural 1990-2020",
    descripcionCorta: "Cómo la caída del Muro de Berlín, Internet y el libre comercio crearon un mundo interconectado y sus contradicciones.",
    ambito: "mundial",
    categoria: "economico",
    imagen: "https://example.com/globalizacion.jpg",
    duracionEstimada: 68,
    capitulos: [
      {
        numero: 1,
        titulo: "Los Tres Motores de la Globalización",
        contenido: "En 1989 cayó el Muro de Berlín, en 1991 se disolvió la URSS. El capitalismo parecía haber ganado la Guerra Fría. Francis Fukuyama proclamó 'El Fin de la Historia'. Simultáneamente, la Revolución Digital (Internet comercial desde 1993) y los avances en contenedores marítimos abarataron drásticamente el transporte.\n\nEl tercer motor fue ideológico: el Consenso de Washington (1989) promovió desregulación, privatizaciones y libre comercio. Se creó la OMC en 1995. China, tras la muerte de Mao, abrió su economía gradualmente desde 1978, pero fue en los 90 cuando se convirtió en la 'fábrica del mundo'. Para el 2000, las cadenas de suministro eran globales: un iPhone diseñado en California, con chips de Taiwán, ensamblado en China.",
        imagenes: []
      },
      {
        numero: 2,
        titulo: "El Mundo Conectado y sus Desigualdades",
        contenido: "La globalización redujo la pobreza extrema del 36% en 1990 al 10% en 2015, principalmente por el crecimiento de China e India. Pero aumentó la desigualdad dentro de los países. En EE.UU., la clase media se estancó mientras el 1% más rico triplicaba sus ingresos.\n\nLa deslocalización industrial vació el 'cinturón de óxido' estadounidense y europeo. Surgieron movimientos antiglobalización: las protestas de Seattle (1999) contra la OMC, el zapatismo en México, y luego los indignados y Occupy Wall Street.\n\nCulturalmente, se homogeneizó: McDonald's en Moscú, Starbucks en la Meca, Hollywood dominando las taquillas mundiales. Pero también surgió la glocalización: Bollywood compite con Hollywood, el K-pop coreano conquista mercados, y el reguetón latino se vuelve global.",
        imagenes: []
      },
      {
        numero: 3,
        titulo: "Crisis y ¿Desglobalización?",
        contenido: "La crisis financiera de 2008 mostró los riesgos: lo que comenzó como hipotecas basura en EE.UU. contagió al mundo. La pandemia de COVID-19 (2020) reveló la vulnerabilidad de las cadenas de suministro globales: escasez de chips, medicamentos, y equipo médico.\n\nEn respuesta, surgen tendencias proteccionistas: el Brexit (2016), la guerra comercial sino-estadounidense de Trump, y el 'America First'. La invasión rusa de Ucrania (2022) aceleró la fragmentación en bloques.\n\n¿Estamos ante el fin de la globalización? Probablemente no, pero sí su transformación: más regionalización (nearshoring), resiliencia en cadenas de suministro, y tensiones entre interdependencia económica y soberanía nacional. El mundo posterior a 2020 será diferente, pero seguirá interconectado, para bien o para mal.",
        imagenes: []
      }
    ]
  }
];

async function seed() {
  try {
    console.log('Limpiando base de datos...');
    await Evento.deleteMany({});
    await Pregunta.deleteMany({});
    await Video.deleteMany({});
    await Personaje.deleteMany({});
    await Narrativa.deleteMany({});

    console.log('Insertando eventos históricos...');
    await Evento.insertMany(eventosHistoricos);

    console.log('Insertando preguntas de trivia...');
    await Pregunta.insertMany(preguntasTrivia);

    console.log('Insertando videos educativos...');
    await Video.insertMany(videosEducativos);

    console.log('Insertando personajes históricos...');
    await Personaje.insertMany(personajesHistoricos);

    console.log('Insertando narrativas interactivas...');
    await Narrativa.insertMany(narrativas);

    console.log('Base de datos poblada exitosamente!');
    console.log(`   - ${eventosHistoricos.length} eventos históricos`);
    console.log(`   - ${preguntasTrivia.length} preguntas de trivia`);
    console.log(`   - ${videosEducativos.length} videos educativos`);
    console.log(`   - ${personajesHistoricos.length} personajes históricos`);
    console.log(`   - ${narrativas.length} narrativas interactivas`);

    process.exit(0);
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

seed();