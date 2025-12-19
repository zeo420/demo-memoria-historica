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

const Evento = mongoose.model('Evento', EventoSchema);
const Pregunta = mongoose.model('Pregunta', PreguntaSchema);
const Video = mongoose.model('Video', VideoSchema);

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

async function seed() {
  try {
    console.log('Limpiando base de datos...');
    await Evento.deleteMany({});
    await Pregunta.deleteMany({});
    await Video.deleteMany({});
    
    console.log('Insertando eventos históricos...');
    await Evento.insertMany(eventosHistoricos);
    
    console.log('Insertando preguntas de trivia...');
    await Pregunta.insertMany(preguntasTrivia);
    
    console.log('Insertando videos educativos...');
    await Video.insertMany(videosEducativos);
    
    console.log('Base de datos poblada exitosamente!');
    console.log(`   - ${eventosHistoricos.length} eventos históricos`);
    console.log(`   - ${preguntasTrivia.length} preguntas de trivia`);
    console.log(`   - ${videosEducativos.length} videos educativos`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

seed();