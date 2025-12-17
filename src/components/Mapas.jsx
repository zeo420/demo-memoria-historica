// src/components/Mapas.jsx - Versión con Viaje Temporal por Filtros
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapas.css';

// Tus eventos históricos (incluyendo los nuevos que me diste)
const eventosHistoricos = [
  { id: 1, fecha: "1810-07-20", titulo: "Grito de Independencia", descripcion: "Inicio del proceso de independencia en Colombia.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 2, fecha: "1819-08-07", titulo: "Batalla de Boyacá", descripcion: "Victoria clave para la independencia.", categoria: "conflicto", coordenadas: { lat: 5.4545, lng: -73.3615 }, region: "Boyacá", importancia: "alta" },
  { id: 3, fecha: "1830-12-17", titulo: "Muerte de Simón Bolívar", descripcion: "Fallece en Santa Marta.", categoria: "politico", coordenadas: { lat: 11.2408, lng: -74.1990 }, region: "Magdalena", importancia: "alta" },
  { id: 4, fecha: "1948-04-09", titulo: "El Bogotazo", descripcion: "Asesinato de Jorge Eliécer Gaitán y revueltas populares.", categoria: "conflicto", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 5, fecha: "1953-06-13", titulo: "Golpe de Estado de Rojas Pinilla", descripcion: "Inicio del régimen militar.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 6, fecha: "1964-05-27", titulo: "Creación de las FARC", descripcion: "Nacimiento del grupo guerrillero en Marquetalia.", categoria: "conflicto", coordenadas: { lat: 2.9768, lng: -75.9011 }, region: "Tolima", importancia: "alta" },
  { id: 7, fecha: "1970-04-19", titulo: "Fraude electoral", descripcion: "Inconformidad con la victoria de Misael Pastrana.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 8, fecha: "1982-10-21", titulo: "Nobel a García Márquez", descripcion: "Premio Nobel de Literatura por 'Cien años de soledad'.", categoria: "cultural", coordenadas: { lat: 10.9639, lng: -74.7964 }, region: "Magdalena", importancia: "alta" },
  { id: 9, fecha: "1985-11-06", titulo: "Toma del Palacio de Justicia", descripcion: "Asalto del M-19 y operación militar.", categoria: "conflicto", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 10, fecha: "1989-08-18", titulo: "Asesinato de Galán", descripcion: "Luis Carlos Galán muere en un atentado en Soacha.", categoria: "politico", coordenadas: { lat: 4.5794, lng: -74.2161 }, region: "Cundinamarca", importancia: "alta" },
  { id: 11, fecha: "1991-07-04", titulo: "Nueva Constitución", descripcion: "Se promulga la actual Constitución Política de Colombia.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 12, fecha: "1993-12-02", titulo: "Muerte de Pablo Escobar", descripcion: "Muere el narcotraficante en Medellín.", categoria: "conflicto", coordenadas: { lat: 6.2442, lng: -75.5812 }, region: "Antioquia", importancia: "alta" },
  { id: 13, fecha: "2000-01-01", titulo: "Plan Colombia", descripcion: "Inicio del acuerdo con EE.UU. para combatir el narcotráfico.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 14, fecha: "2002-08-07", titulo: "Inicio del gobierno de Álvaro Uribe", descripcion: "Se implementa la política de seguridad democrática.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 15, fecha: "2008-03-01", titulo: "Operación Fénix", descripcion: "Muerte del comandante de las FARC, Raúl Reyes.", categoria: "conflicto", coordenadas: { lat: 0.8748, lng: -76.6311 }, region: "Putumayo", importancia: "alta" },
  { id: 16, fecha: "2011-06-10", titulo: "Ley de Víctimas", descripcion: "Reconocimiento y reparación a víctimas del conflicto armado.", categoria: "social", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 17, fecha: "2016-11-24", titulo: "Firma del acuerdo de paz", descripcion: "Acuerdo entre gobierno y FARC en el Teatro Colón.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 18, fecha: "2019-11-21", titulo: "Protestas sociales masivas", descripcion: "Manifestaciones contra políticas del gobierno.", categoria: "social", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 19, fecha: "2021-04-28", titulo: "Paro Nacional", descripcion: "Protestas contra la reforma tributaria y violaciones a DD.HH.", categoria: "social", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 20, fecha: "2022-06-19", titulo: "Elección de Gustavo Petro", descripcion: "Primer presidente de izquierda en la historia del país.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 21, fecha: "1903-11-03", titulo: "Separación de Panamá", descripcion: "Panamá se independiza de Colombia con apoyo de EE.UU.", categoria: "politico", coordenadas: { lat: 8.5375, lng: -80.7821 }, region: "Panamá", importancia: "alta" },
  { id: 22, fecha: "1928-12-06", titulo: "Masacre de las Bananeras", descripcion: "Ejército colombiano reprime huelga de trabajadores de la United Fruit Company.", categoria: "social", coordenadas: { lat: 10.7639, lng: -74.1597 }, region: "Magdalena", importancia: "alta" },
  { id: 23, fecha: "1958-08-07", titulo: "Inicio del Frente Nacional", descripcion: "Acuerdo político entre liberales y conservadores para alternancia presidencial.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 24, fecha: "1984-03-28", titulo: "Acuerdo de La Uribe", descripcion: "Acuerdo de cese al fuego entre gobierno y FARC.", categoria: "conflicto", coordenadas: { lat: 3.2542, lng: -75.2338 }, region: "Meta", importancia: "media" },
  { id: 25, fecha: "2000-08-03", titulo: "Masacre de El Salado", descripcion: "Paramilitares asesinan a más de 60 personas en Bolívar.", categoria: "conflicto", coordenadas: { lat: 8.6256, lng: -75.0317 }, region: "Bolívar", importancia: "alta" },
  { id: 26, fecha: "2010-08-07", titulo: "Inicio del gobierno de Juan Manuel Santos", descripcion: "Se enfocó en el proceso de paz con las FARC.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 27, fecha: "2017-09-01", titulo: "Desarme de las FARC", descripcion: "ONU certifica entrega total de armas por parte de las FARC.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 28, fecha: "1200-01-01", titulo: "Fundación de la Ciudad Perdida", descripcion: "Los Tayrona construyen Teyuna, conocida como Ciudad Perdida, en la Sierra Nevada de Santa Marta.", categoria: "cultural", coordenadas: { lat: 11.0396, lng: -73.9265 }, region: "Magdalena", importancia: "alta" },
  { id: 29, fecha: "800-01-01", titulo: "Apogeo de la Cultura Quimbaya", descripcion: "Desarrollo de la orfebrería quimbaya, famosa por sus poporos y figuras antropomorfas en oro.", categoria: "cultural", coordenadas: { lat: 4.8133, lng: -75.6961 }, region: "Quindío", importancia: "alta" },
  { id: 30, fecha: "600-01-01", titulo: "Desarrollo de la Cultura San Agustín", descripcion: "Esculturas monumentales y complejos funerarios en el Macizo Colombiano.", categoria: "cultural", coordenadas: { lat: 1.8800, lng: -76.2667 }, region: "Huila", importancia: "alta" },
  { id: 31, fecha: "1000-01-01", titulo: "Expansión de la Cultura Muisca", descripcion: "Desarrollo de la Confederación Muisca en el altiplano cundiboyacense.", categoria: "cultural", coordenadas: { lat: 5.5469, lng: -73.3622 }, region: "Boyacá", importancia: "alta" },
  { id: 32, fecha: "1499-01-01", titulo: "Primer Viaje de Alonso de Ojeda", descripcion: "Primer contacto europeo con la costa atlántica colombiana, acompañado por Américo Vespucio.", categoria: "politico", coordenadas: { lat: 11.2408, lng: -74.1990 }, region: "La Guajira", importancia: "alta" },
  { id: 33, fecha: "1525-02-29", titulo: "Fundación de Santa Marta", descripcion: "Primera ciudad española en territorio colombiano, fundada por Rodrigo de Bastidas.", categoria: "politico", coordenadas: { lat: 11.2408, lng: -74.1990 }, region: "Magdalena", importancia: "alta" },
  { id: 34, fecha: "1536-04-06", titulo: "Expedición de Gonzalo Jiménez de Quesada", descripcion: "Salida de Santa Marta hacia el interior, buscando El Dorado.", categoria: "conflicto", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Cundinamarca", importancia: "alta" },
  { id: 35, fecha: "1538-08-06", titulo: "Fundación de Santafé de Bogotá", descripcion: "Gonzalo Jiménez de Quesada funda la ciudad en el territorio muisca de Bacatá.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 36, fecha: "1540-01-01", titulo: "Creación de la Real Audiencia", descripcion: "Establecimiento de la Real Audiencia del Nuevo Reino de Granada.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 37, fecha: "1564-01-01", titulo: "Fundación de la Universidad Tomística", descripcion: "Primera universidad en Colombia, antecedente de la Universidad Santo Tomás.", categoria: "cultural", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 38, fecha: "1697-05-04", titulo: "Ataque de Henry Morgan a Cartagena", descripcion: "El pirata inglés saquea Cartagena durante 14 días.", categoria: "conflicto", coordenadas: { lat: 10.3910, lng: -75.4794 }, region: "Bolívar", importancia: "media" },
  { id: 39, fecha: "1717-05-27", titulo: "Creación del Virreinato de Nueva Granada", descripcion: "Separación del Virreinato del Perú para mejorar la administración colonial.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 40, fecha: "1781-03-16", titulo: "Rebelión de los Comuneros", descripcion: "Revuelta popular en Socorro contra los impuestos de la Corona española.", categoria: "social", coordenadas: { lat: 6.4684, lng: -73.2602 }, region: "Santander", importancia: "alta" },
  { id: 41, fecha: "1809-08-10", titulo: "Primer Grito de Independencia en América", descripcion: "Revuelta en Quito que inspira movimientos independentistas en Nueva Granada.", categoria: "politico", coordenadas: { lat: -0.2202, lng: -78.5123 }, region: "Ecuador", importancia: "alta" },
  { id: 42, fecha: "1815-08-06", titulo: "Sitio de Cartagena", descripcion: "Asedio español de 105 días a Cartagena, heroica resistencia que le dio el título 'Ciudad Heroica'.", categoria: "conflicto", coordenadas: { lat: 10.3910, lng: -75.4794 }, region: "Bolívar", importancia: "alta" },
  { id: 43, fecha: "1821-10-07", titulo: "Congreso de Cúcuta", descripcion: "Creación de la Gran Colombia y Constitución de 1821.", categoria: "politico", coordenadas: { lat: 7.8939, lng: -72.5078 }, region: "Norte de Santander", importancia: "alta" },
  { id: 44, fecha: "1828-09-25", titulo: "Conspiración Septembrina", descripcion: "Intento de asesinato contra Simón Bolívar en Bogotá.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 45, fecha: "1832-04-29", titulo: "Creación de la República de Nueva Granada", descripcion: "Separación definitiva de Venezuela y Ecuador de la Gran Colombia.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 46, fecha: "1849-04-01", titulo: "Abolición de la Esclavitud", descripcion: "Ley de Libertad de Vientres y abolición gradual de la esclavitud.", categoria: "social", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 47, fecha: "1851-05-21", titulo: "Abolición Total de la Esclavitud", descripcion: "Ley definitiva que libera a los últimos esclavos en Colombia.", categoria: "social", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 48, fecha: "1863-05-08", titulo: "Constitución de Rionegro", descripcion: "Constitución federalista que crea los Estados Unidos de Colombia.", categoria: "politico", coordenadas: { lat: 6.1551, lng: -75.3737 }, region: "Antioquia", importancia: "alta" },
  { id: 49, fecha: "1885-01-01", titulo: "Guerra Civil de 1885", descripcion: "Conflicto entre federalistas y centralistas que lleva a la Regeneración.", categoria: "conflicto", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Cundinamarca", importancia: "media" },
  { id: 50, fecha: "1886-08-05", titulo: "Constitución de 1886", descripcion: "Constitución centralista que regiría por 105 años.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 51, fecha: "1905-01-01", titulo: "Separación del Departamento de Panamá", descripcion: "Panamá se convierte en intendencia nacional antes de su separación definitiva.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 52, fecha: "1910-07-20", titulo: "Asamblea Nacional Constituyente", descripcion: "Reforma constitucional tras el gobierno de Rafael Reyes.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 53, fecha: "1914-08-15", titulo: "Inauguración del Canal de Panamá", descripcion: "EE.UU. inaugura el canal, consolidando la separación panameña.", categoria: "economico", coordenadas: { lat: 9.0800, lng: -79.6800 }, region: "Panamá", importancia: "alta" },
  { id: 54, fecha: "1922-03-24", titulo: "Tratado Urrutia-Thomson", descripcion: "EE.UU. indemniza a Colombia por la pérdida de Panamá con 25 millones de dólares.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 55, fecha: "1930-02-09", titulo: "Elección de Enrique Olaya Herrera", descripcion: "Primer presidente liberal tras la Hegemonía Conservadora (44 años).", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 56, fecha: "1932-09-01", titulo: "Guerra Colombo-Peruana", descripcion: "Conflicto por el territorio de Leticia en la Amazonía.", categoria: "conflicto", coordenadas: { lat: -4.2153, lng: -69.9406 }, region: "Amazonas", importancia: "alta" },
  { id: 57, fecha: "1936-08-01", titulo: "Reforma Constitucional", descripcion: "Reforma social bajo Alfonso López Pumarejo ('Revolución en Marcha').", categoria: "social", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 58, fecha: "1945-07-10", titulo: "Creación de las Naciones Unidas", descripcion: "Colombia es uno de los 51 países fundadores de la ONU.", categoria: "politico", coordenadas: { lat: 40.7490, lng: -73.9680 }, region: "Internacional", importancia: "alta" },
  { id: 59, fecha: "1951-11-09", titulo: "Colombia en la Guerra de Corea", descripcion: "Batallón Colombia participa en la guerra como parte de fuerzas de la ONU.", categoria: "conflicto", coordenadas: { lat: 37.5665, lng: 126.9780 }, region: "Corea", importancia: "media" },
  { id: 60, fecha: "1958-12-01", titulo: "Inicio del Frente Nacional", descripcion: "Alternancia presidencial entre liberales y conservadores por 16 años.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 61, fecha: "1962-05-15", titulo: "Primera Teletón en Colombia", descripcion: "Inicio de las campañas de recaudación para niños con discapacidad.", categoria: "social", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 62, fecha: "1967-07-20", titulo: "Inauguración del Museo del Oro", descripcion: "Apertura del museo con la mayor colección de orfebrería prehispánica del mundo.", categoria: "cultural", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 63, fecha: "1970-06-01", titulo: "Primer Campeonato Mundial de Fútbol", descripcion: "Colombia organiza y gana su primer Campeonato Mundial Sub-20.", categoria: "cultural", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 64, fecha: "1974-08-07", titulo: "Fin del Frente Nacional", descripcion: "Termina el acuerdo bipartidista, elegido Alfonso López Michelsen.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 65, fecha: "1975-12-12", titulo: "Creación del Sistema Nacional de Salud", descripcion: "Implementación del Sistema Nacional de Salud (SNS).", categoria: "social", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 66, fecha: "1980-02-27", titulo: "Toma de la Embajada de República Dominicana", descripcion: "M-19 toma la embajada durante 61 días, secuestrando a diplomáticos.", categoria: "conflicto", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 67, fecha: "1983-11-25", titulo: "Narcotráfico invade el Palacio de Justicia", descripcion: "Los Extraditables amenazan a magistrados por tratado de extradición.", categoria: "conflicto", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 68, fecha: "1986-03-13", titulo: "Erupción del Nevado del Ruiz", descripcion: "Desastre natural que destruye Armero, más de 25,000 víctimas.", categoria: "social", coordenadas: { lat: 4.8950, lng: -75.3200 }, region: "Tolima", importancia: "alta" },
  { id: 69, fecha: "1988-01-25", titulo: "Asesinato de Jaime Pardo Leal", descripcion: "Primer candidato presidencial de la Unión Patriótica asesinado.", categoria: "conflicto", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 70, fecha: "1989-12-06", titulo: "Atentado al edificio del DAS", descripcion: "Coche bomba del Cartel de Medellín contra inteligencia colombiana.", categoria: "conflicto", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 71, fecha: "1999-01-19", titulo: "Inicio de Diálogos del Caguán", descripcion: "Gobierno de Pastrana inicia negociaciones de paz con las FARC.", categoria: "politico", coordenadas: { lat: 2.1769, lng: -74.7806 }, region: "Caquetá", importancia: "alta" },
  { id: 72, fecha: "2002-02-20", titulo: "Fin de los Diálogos del Caguán", descripcion: "Secuestro de un avión comercial lleva al fin de las negociaciones.", categoria: "politico", coordenadas: { lat: 2.1769, lng: -74.7806 }, region: "Caquetá", importancia: "alta" },
  { id: 73, fecha: "2003-07-01", titulo: "Desmovilización de las AUC", descripcion: "Inicio de proceso de desmovilización paramilitar en Santa Fe de Ralito.", categoria: "politico", coordenadas: { lat: 7.9680, lng: -75.2140 }, region: "Córdoba", importancia: "alta" },
  { id: 74, fecha: "2008-07-02", titulo: "Operación Jaque", descripcion: "Rescate de 15 secuestrados, incluyendo Ingrid Betancourt, sin disparar un tiro.", categoria: "conflicto", coordenadas: { lat: 2.6333, lng: -72.7333 }, region: "Guaviare", importancia: "alta" },
  { id: 75, fecha: "2011-09-04", titulo: "Ley de Tierras y Víctimas", descripcion: "Ley 1448 de restitución de tierras a víctimas del conflicto.", categoria: "social", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 76, fecha: "2012-10-18", titulo: "Inicio de Diálogos de Paz en La Habana", descripcion: "Gobierno de Santos inicia negociaciones secretas con las FARC.", categoria: "politico", coordenadas: { lat: 23.1136, lng: -82.3666 }, region: "Cuba", importancia: "alta" },
  { id: 77, fecha: "2015-09-23", titulo: "Acuerdo de Paz con las FARC", descripcion: "Primer acuerdo anunciado en La Habana tras 3 años de negociaciones.", categoria: "politico", coordenadas: { lat: 23.1136, lng: -82.3666 }, region: "Cuba", importancia: "alta" },
  { id: 78, fecha: "2016-10-02", titulo: "Plebiscito por la Paz", descripcion: "Colombianos rechazan acuerdo de paz por estrecho margen (50.2% vs 49.8%).", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 79, fecha: "2017-09-26", titulo: "Firma del Acuerdo de Paz Final", descripcion: "Firma del acuerdo revisado en Cartagena.", categoria: "politico", coordenadas: { lat: 10.3910, lng: -75.4794 }, region: "Bolívar", importancia: "alta" },
  { id: 80, fecha: "2019-11-25", titulo: "Paro Nacional más grande de la historia", descripcion: "Más de 1.5 millones de personas protestan en todo el país.", categoria: "social", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 81, fecha: "1985-11-13", titulo: "Desastre de Armero", descripcion: "Erupción del Nevado del Ruiz causa lahares que entierran la ciudad.", categoria: "social", coordenadas: { lat: 4.9667, lng: -74.9000 }, region: "Tolima", importancia: "alta" },
  { id: 82, fecha: "1999-12-15", titulo: "Terremoto del Eje Cafetero", descripcion: "Sismo de 6.2 grados afecta a Armenia, Pereira y Manizales.", categoria: "social", coordenadas: { lat: 4.5333, lng: -75.6833 }, region: "Quindío", importancia: "alta" },
  { id: 83, fecha: "2010-12-06", titulo: "Invierno más fuerte de la historia", descripcion: "Ola invernal afecta a 2.2 millones de personas, 420 muertos.", categoria: "social", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 84, fecha: "2017-04-01", titulo: "Tragedia de Mocoa", descripcion: "Avalancha por lluvias deja más de 300 muertos en Putumayo.", categoria: "social", coordenadas: { lat: 1.1528, lng: -76.6525 }, region: "Putumayo", importancia: "alta" },
  { id: 85, fecha: "1948-06-13", titulo: "Asesinato de Jorge Eliécer Gaitán", descripcion: "Muerte del caudillo liberal desata El Bogotazo y La Violencia.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 86, fecha: "1962-08-30", titulo: "Primera transmisión de televisión a color", descripcion: "Inicio de la televisión a color en Colombia.", categoria: "cultural", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 87, fecha: "1975-08-01", titulo: "Lanzamiento de 'Cien años de soledad' en español", descripcion: "La obra de García Márquez se publica en Buenos Aires.", categoria: "cultural", coordenadas: { lat: -34.6037, lng: -58.3816 }, region: "Argentina", importancia: "alta" },
  { id: 88, fecha: "1990-06-18", titulo: "Colombia en el Mundial de Italia", descripcion: "Selección colombiana debuta en Copa Mundial de Fútbol.", categoria: "cultural", coordenadas: { lat: 41.9028, lng: 12.4964 }, region: "Italia", importancia: "media" },
  { id: 89, fecha: "1995-07-04", titulo: "Título de Miss Universo", descripcion: "Luz Marina Zuluaga gana Miss Universo para Colombia.", categoria: "cultural", coordenadas: { lat: 25.7617, lng: -80.1918 }, region: "EE.UU.", importancia: "media" },
  { id: 90, fecha: "2001-08-11", titulo: "Primer título mundial de boxeo", descripcion: "Miguel 'Happy' Lora gana título mundial de peso gallo.", categoria: "cultural", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 91, fecha: "1919-12-14", titulo: "Primer vuelo comercial en Colombia", descripcion: "SCADTA inicia operaciones, primera aerolínea de América.", categoria: "economico", coordenadas: { lat: 4.4525, lng: -75.7664 }, region: "Caldas", importancia: "media" },
  { id: 92, fecha: "1938-08-06", titulo: "Inauguración del Ferrocarril del Pacífico", descripcion: "Conecta Buenaventura con Cali, impulsando comercio exterior.", categoria: "economico", coordenadas: { lat: 3.8833, lng: -77.0333 }, region: "Valle del Cauca", importancia: "media" },
  { id: 93, fecha: "1969-04-28", titulo: "Creación del Pacto Andino", descripcion: "Acuerdo de integración económica entre países andinos.", categoria: "economico", coordenadas: { lat: -12.0464, lng: -77.0428 }, region: "Perú", importancia: "alta" },
  { id: 94, fecha: "1974-01-01", titulo: "Descubrimiento de Caño Limón", descripcion: "Encuentran uno de los mayores yacimientos petroleros del país.", categoria: "economico", coordenadas: { lat: 7.0333, lng: -71.5667 }, region: "Arauca", importancia: "alta" },
  { id: 95, fecha: "1991-11-27", titulo: "Apertura económica", descripcion: "Gobierno de Gaviria implementa liberalización económica.", categoria: "economico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 96, fecha: "2000-01-01", titulo: "Implementación del Plan Colombia", descripcion: "Acuerdo con EE.UU. para combatir narcotráfico y violencia.", categoria: "economico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 97, fecha: "2011-11-08", titulo: "Tratado de Libre Comercio con EE.UU.", descripcion: "Firma del TLC después de años de negociación.", categoria: "economico", coordenadas: { lat: 38.9072, lng: -77.0369 }, region: "EE.UU.", importancia: "alta" },
  { id: 98, fecha: "1942-03-24", titulo: "Fundación del Instituto Caro y Cuervo", descripcion: "Centro de investigación en lingüística y filología.", categoria: "cultural", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 99, fecha: "1969-12-21", titulo: "Llegada del Hombre a la Luna", descripcion: "Colombia sigue el evento por televisión, símbolo de modernidad.", categoria: "cultural", coordenadas: { lat: 0.6741, lng: 23.4729 }, region: "Luna", importancia: "media" },
  { id: 100, fecha: "1985-04-16", titulo: "Primer transplante de corazón", descripcion: "Realizado en la Fundación Cardioinfantil de Bogotá.", categoria: "social", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 101, fecha: "2007-03-07", titulo: "Lanzamiento del satélite Libertad 1", descripcion: "Primer satélite colombiano, desarrollado por la Universidad Sergio Arboleda.", categoria: "cultural", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 102, fecha: "1961-09-05", titulo: "Creación del Movimiento de Países No Alineados", descripcion: "Colombia participa en la fundación en Belgrado.", categoria: "politico", coordenadas: { lat: 44.7872, lng: 20.4573 }, region: "Serbia", importancia: "media" },
  { id: 103, fecha: "1978-11-21", titulo: "Colombia en el Consejo de Seguridad de la ONU", descripcion: "Primera vez como miembro no permanente.", categoria: "politico", coordenadas: { lat: 40.7490, lng: -73.9680 }, region: "EE.UU.", importancia: "media" },
  { id: 104, fecha: "2018-06-12", titulo: "Colombia en la Cumbre de Singapur", descripcion: "Participación en la cumbre histórica entre Trump y Kim Jong-un.", categoria: "politico", coordenadas: { lat: 1.3521, lng: 103.8198 }, region: "Singapur", importancia: "media" },
  { id: 105, fecha: "2023-02-13", titulo: "Primer diálogo de paz con el ELN en gobiernos", descripcion: "Reinicio de conversaciones tras 4 años de congelamiento.", categoria: "politico", coordenadas: { lat: 23.1136, lng: -82.3666 }, region: "Cuba", importancia: "alta" },
  { id: 106, fecha: "2023-08-07", titulo: "Reformas estructurales de Petro", descripcion: "Anuncio de reformas a salud, pensiones y trabajo.", categoria: "politico", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
  { id: 107, fecha: "2024-03-10", titulo: "Protestas por reforma a la salud", descripcion: "Marchas masivas contra la reforma del sistema de salud.", categoria: "social", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "media" },
  { id: 108, fecha: "2024-06-20", titulo: "Informe final de la Comisión de la Verdad", descripcion: "Presentación pública de hallazgos sobre el conflicto armado.", categoria: "social", coordenadas: { lat: 4.5981, lng: -74.0758 }, region: "Bogotá", importancia: "alta" },
];

const Mapas = () => {
  const [eventos] = useState(eventosHistoricos);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(eventosHistoricos[2]); // Toma del Palacio por defecto
  const [filtros, setFiltros] = useState({
    categoria: '',
    decada: '',
    periodo: ''
  });
  const [viewMode, setViewMode] = useState('street');
  const [modoViaje, setModoViaje] = useState(false);
  const [viajeIndex, setViajeIndex] = useState(0);
  const [viajeActivo, setViajeActivo] = useState(false);
  const [eventosViaje, setEventosViaje] = useState([]); // Eventos filtrados para el viaje
  const mapRef = useRef(null);
  const viajeIntervalRef = useRef(null);

  // Coordenadas de Colombia
  const COLOMBIA_CENTER = [4.5709, -74.2973];
  const ZOOM_DEFAULT = 6;

  useEffect(() => {
    // Configurar iconos de Leaflet
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
    
    // Inicializar eventos del viaje con todos los eventos
    setEventosViaje(eventosHistoricos);
  }, []);

  // Filtrar eventos cuando cambian los filtros
  useEffect(() => {
    const eventosFiltrados = filtrarEventos(eventos, filtros);
    setEventosViaje(eventosFiltrados);
    
    // Si hay un evento seleccionado que no está en los filtros, seleccionar el primero disponible
    if (eventoSeleccionado && !eventosFiltrados.some(e => e.id === eventoSeleccionado.id)) {
      if (eventosFiltrados.length > 0) {
        setEventoSeleccionado(eventosFiltrados[0]);
      } else {
        setEventoSeleccionado(null);
      }
    }
    
    // Si el viaje está activo y los eventos cambiaron, reiniciar el viaje
    if (viajeActivo) {
      reiniciarViajeConFiltros(eventosFiltrados);
    }
  }, [filtros]);

  // Función para filtrar eventos
  const filtrarEventos = (eventos, filtros) => {
    return eventos.filter(evento => {
      // Filtrar por categoría
      if (filtros.categoria && evento.categoria !== filtros.categoria) return false;
      
      // Filtrar por década
      if (filtros.decada) {
        const año = getAñoEvento(evento.fecha);
        const decadaInicio = parseInt(filtros.decada);
        return año >= decadaInicio && año < decadaInicio + 10;
      }
      
      // Filtrar por periodo histórico
      if (filtros.periodo) {
        const año = getAñoEvento(evento.fecha);
        switch(filtros.periodo) {
          case 'precolombina':
            return año < 1499;
          case 'colonia':
            return año >= 1499 && año < 1810;
          case 'independencia':
            return año >= 1810 && año < 1830;
          case 'sigloXIX':
            return año >= 1830 && año < 1900;
          case 'sigloXX':
            return año >= 1900 && año < 2000;
          case 'sigloXXI':
            return año >= 2000;
          default:
            return true;
        }
      }
      
      return true;
    });
  };

  // Función para reiniciar el viaje con nuevos filtros
  const reiniciarViajeConFiltros = (eventosFiltrados) => {
    if (viajeActivo) {
      pausarViaje();
      if (eventosFiltrados.length > 0) {
        setViajeIndex(0);
        iniciarViajeTemporal(eventosFiltrados);
      }
    }
  };

  // Crear iconos personalizados para Leaflet
  const crearIcono = (categoria, destacado = false) => {
    const icono = getIconoCategoria(categoria);
    const color = getCategoriaColor(categoria);
    const size = destacado ? 36 : 28;
    
    const html = `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: white;
        border: 3px solid ${color};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${destacado ? '1.2em' : '1em'};
        color: ${color};
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        transform: ${destacado ? 'scale(1.2)' : 'scale(1)'};
        transition: all 0.3s;
        cursor: pointer;
      ">
        ${icono}
      </div>
    `;
    
    return L.divIcon({
      html,
      className: 'custom-div-icon',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      popupAnchor: [0, -size/2]
    });
  };

  const getIconoCategoria = (categoria) => {
    const iconos = {
      politico: '🏛️',
      conflicto: '⚔️',
      social: '👥',
      cultural: '🎨',
      economico: '💰'
    };
    return iconos[categoria] || '📍';
  };

  const getCategoriaColor = (categoria) => {
    const colores = {
      politico: '#3B82F6',
      conflicto: '#EF4444',
      social: '#10B981',
      cultural: '#F59E0B',
      economico: '#8B5CF6'
    };
    return colores[categoria] || '#6B7280';
  };

  const getCategoriaNombre = (categoria) => {
    const nombres = {
      politico: 'Político',
      conflicto: 'Conflicto',
      social: 'Social',
      cultural: 'Cultural',
      economico: 'Económico'
    };
    return nombres[categoria] || 'General';
  };

  // INICIAR VIAJE TEMPORAL CON EVENTOS FILTRADOS
  const iniciarViajeTemporal = (eventosParaViajar = eventosViaje) => {
    if (eventosParaViajar.length === 0) {
      alert('No hay eventos que coincidan con los filtros seleccionados');
      return;
    }
    
    setModoViaje(true);
    setViajeActivo(true);
    setViajeIndex(0);
    
    // Ordenar eventos cronológicamente
    const eventosOrdenados = [...eventosParaViajar].sort((a, b) => 
      new Date(a.fecha) - new Date(b.fecha)
    );
    
    let index = 0;
    
    // Limpiar intervalo previo
    if (viajeIntervalRef.current) {
      clearInterval(viajeIntervalRef.current);
    }
    
    // Primera ubicación inmediatamente
    const primerEvento = eventosOrdenados[0];
    setEventoSeleccionado(primerEvento);
    if (mapRef.current && primerEvento.coordenadas) {
      mapRef.current.flyTo([primerEvento.coordenadas.lat, primerEvento.coordenadas.lng], 10, {
        duration: 1.5
      });
    }
    
    // Configurar intervalo para los siguientes eventos
    viajeIntervalRef.current = setInterval(() => {
      index++;
      
      if (index < eventosOrdenados.length) {
        const evento = eventosOrdenados[index];
        setEventoSeleccionado(evento);
        setViajeIndex(index);
        
        // Centrar mapa en el evento con animación
        if (mapRef.current && evento.coordenadas) {
          mapRef.current.flyTo([evento.coordenadas.lat, evento.coordenadas.lng], 10, {
            duration: 1.5
          });
        }
      } else {
        // Fin del viaje
        pausarViaje();
        setViajeIndex(0);
        alert('🎉 ¡Viaje temporal completado! Has recorrido todos los eventos con los filtros actuales.');
      }
    }, 8000); // 8 segundos por evento
  };

  const pausarViaje = () => {
    setViajeActivo(false);
    if (viajeIntervalRef.current) {
      clearInterval(viajeIntervalRef.current);
      viajeIntervalRef.current = null;
    }
  };

  const reanudarViaje = () => {
    if (eventosViaje.length === 0) {
      alert('No hay eventos para recorrer con los filtros actuales');
      return;
    }
    
    if (!modoViaje) {
      iniciarViajeTemporal();
    } else {
      // Si el viaje estaba pausado, continuar desde donde iba
      iniciarViajeTemporal(eventosViaje);
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAñoEvento = (fecha) => {
    return new Date(fecha).getFullYear();
  };

  const handleMarkerClick = (evento) => {
    setEventoSeleccionado(evento);
    if (viajeActivo) {
      pausarViaje();
    }
    
    // Centrar mapa en el evento
    if (mapRef.current && evento.coordenadas) {
      mapRef.current.flyTo([evento.coordenadas.lat, evento.coordenadas.lng], 10, {
        duration: 1
      });
    }
  };

  // Eventos filtrados para mostrar
  const eventosFiltrados = filtrarEventos(eventos, filtros);

  const decadas = [
    { valor: '', etiqueta: 'Todas las décadas' },
    { valor: '1800', etiqueta: '1800s' },
    { valor: '1810', etiqueta: '1810s' },
    { valor: '1820', etiqueta: '1820s' },
    { valor: '1830', etiqueta: '1830s' },
    { valor: '1840', etiqueta: '1840s' },
    { valor: '1850', etiqueta: '1850s' },
    { valor: '1860', etiqueta: '1860s' },
    { valor: '1870', etiqueta: '1870s' },
    { valor: '1880', etiqueta: '1880s' },
    { valor: '1890', etiqueta: '1890s' },
    { valor: '1900', etiqueta: '1900s' },
    { valor: '1910', etiqueta: '1910s' },
    { valor: '1920', etiqueta: '1920s' },
    { valor: '1930', etiqueta: '1930s' },
    { valor: '1940', etiqueta: '1940s' },
    { valor: '1950', etiqueta: '1950s' },
    { valor: '1960', etiqueta: '1960s' },
    { valor: '1970', etiqueta: '1970s' },
    { valor: '1980', etiqueta: '1980s' },
    { valor: '1990', etiqueta: '1990s' },
    { valor: '2000', etiqueta: '2000s' },
    { valor: '2010', etiqueta: '2010s' },
    { valor: '2020', etiqueta: '2020s' }
  ];

  const categorias = [
    { valor: '', etiqueta: 'Todas las categorías' },
    { valor: 'politico', etiqueta: 'Político' },
    { valor: 'conflicto', etiqueta: 'Conflicto' },
    { valor: 'social', etiqueta: 'Social' },
    { valor: 'cultural', etiqueta: 'Cultural' },
    { valor: 'economico', etiqueta: 'Económico' }
  ];

  const periodosHistoricos = [
    { valor: '', etiqueta: 'Todos los periodos' },
    { valor: 'precolombina', etiqueta: 'Época Precolombina' },
    { valor: 'colonia', etiqueta: 'Colonia Española' },
    { valor: 'independencia', etiqueta: 'Independencia' },
    { valor: 'sigloXIX', etiqueta: 'Siglo XIX' },
    { valor: 'sigloXX', etiqueta: 'Siglo XX' },
    { valor: 'sigloXXI', etiqueta: 'Siglo XXI' }
  ];

  // Calcular progreso del viaje
  const progresoViaje = eventosViaje.length > 0 ? ((viajeIndex + 1) / eventosViaje.length) * 100 : 0;

  return (
    <div className="mapas-container">
      {/* Header minimalista */}
      <div className="mapas-header">
        <div className="header-content">
          <h1>🗺️ Mapa Histórico de Colombia</h1>
          <p className="subtitle">
            {eventosFiltrados.length} eventos encontrados 
            {filtros.categoria && ` • ${getCategoriaNombre(filtros.categoria)}`}
            {filtros.decada && ` • Década ${filtros.decada}s`}
            {filtros.periodo && ` • ${periodosHistoricos.find(p => p.valor === filtros.periodo)?.etiqueta}`}
          </p>
        </div>
        
        <div className="header-controls">
          <div className="filtros-rapidos">
            <select 
              value={filtros.categoria}
              onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
              className="filtro-select"
            >
              {categorias.map(cat => (
                <option key={cat.valor} value={cat.valor}>
                  {cat.etiqueta}
                </option>
              ))}
            </select>
            
            <select 
              value={filtros.periodo}
              onChange={(e) => setFiltros({ ...filtros, periodo: e.target.value })}
              className="filtro-select"
            >
              {periodosHistoricos.map(per => (
                <option key={per.valor} value={per.valor}>
                  {per.etiqueta}
                </option>
              ))}
            </select>
            
            <select 
              value={filtros.decada}
              onChange={(e) => setFiltros({ ...filtros, decada: e.target.value })}
              className="filtro-select"
            >
              {decadas.map(dec => (
                <option key={dec.valor} value={dec.valor}>
                  {dec.etiqueta}
                </option>
              ))}
            </select>
            
            <div className="contador-eventos">
              📍 {eventosFiltrados.length} eventos
            </div>
          </div>
          
          <div className="controles-mapa">
            <div className="controles-viaje">
              <button 
                className={`control-btn ${modoViaje && viajeActivo ? 'active' : ''}`}
                onClick={viajeActivo ? pausarViaje : reanudarViaje}
                disabled={eventosViaje.length === 0}
              >
                {viajeActivo ? '⏸️ Pausar Viaje' : '▶️ Viaje Temporal'}
              </button>
              
              {modoViaje && (
                <div className="info-viaje">
                  <span className="viaje-contador">
                    {viajeIndex + 1} / {eventosViaje.length}
                  </span>
                  <span className="viaje-filtro">
                    {eventosViaje.length} eventos en ruta
                  </span>
                </div>
              )}
            </div>
            
            <div className="vista-botones">
              {['street', 'satellite'].map((mode) => (
                <button
                  key={mode}
                  className={`vista-btn ${viewMode === mode ? 'active' : ''}`}
                  onClick={() => setViewMode(mode)}
                >
                  {mode === 'satellite' ? '🛰️ Satélite' : '🗺️ Calles'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal - Mapa grande + panel lateral */}
      <div className="mapas-content">
        {/* Mapa (75% del ancho) */}
        <div className="mapa-principal">
          <div className="mapa-wrapper">
            {modoViaje && viajeActivo && (
              <div className="viaje-indicator">
                <div className="viaje-header">
                  <span className="viaje-titulo">🎬 Viaje Temporal Activo</span>
                  <span className="viaje-estado">
                    {eventosViaje.length > 0 ? 
                      `Recorriendo ${eventosViaje.length} eventos filtrados` : 
                      'No hay eventos con los filtros actuales'}
                  </span>
                </div>
                
                <div className="viaje-progreso">
                  <div 
                    className="viaje-progreso-bar"
                    style={{ width: `${progresoViaje}%` }}
                  ></div>
                </div>
                
                <div className="viaje-info">
                  <span className="viaje-text">
                    {viajeIndex + 1} de {eventosViaje.length} • 
                    {eventoSeleccionado && ` ${eventoSeleccionado.titulo}`}
                  </span>
                  <button 
                    className="viaje-saltar-btn"
                    onClick={() => {
                      if (viajeIndex < eventosViaje.length - 1) {
                        setViajeIndex(viajeIndex + 1);
                        const siguienteEvento = eventosViaje[viajeIndex + 1];
                        setEventoSeleccionado(siguienteEvento);
                        if (mapRef.current && siguienteEvento.coordenadas) {
                          mapRef.current.flyTo(
                            [siguienteEvento.coordenadas.lat, siguienteEvento.coordenadas.lng], 
                            10, 
                            { duration: 1 }
                          );
                        }
                      }
                    }}
                  >
                    ⏭️ Saltar
                  </button>
                </div>
              </div>
            )}
            
            <MapContainer
              center={COLOMBIA_CENTER}
              zoom={ZOOM_DEFAULT}
              className="leaflet-map"
              ref={mapRef}
              zoomControl={false}
            >
              {viewMode === 'satellite' ? (
                <TileLayer
                  attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              ) : (
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              )}

              <ZoomControl position="bottomright" />

              {/* Marcadores de eventos filtrados */}
              {eventosFiltrados.map(evento => (
                <Marker
                  key={evento.id}
                  position={[evento.coordenadas.lat, evento.coordenadas.lng]}
                  icon={crearIcono(evento.categoria, eventoSeleccionado?.id === evento.id)}
                  eventHandlers={{
                    click: () => handleMarkerClick(evento),
                  }}
                >
                  <Popup>
                    <div className="popup-content">
                      <h4>{evento.titulo}</h4>
                      <p>{getAñoEvento(evento.fecha)} • {getCategoriaNombre(evento.categoria)}</p>
                      {modoViaje && viajeActivo && (
                        <p className="popup-viaje-info">
                          🎬 En ruta de viaje temporal
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          {/* Leyenda minimalista */}
          <div className="leyenda-mapa">
            <div className="leyenda-titulo">Leyenda:</div>
            {categorias.slice(1).map(cat => (
              <div key={cat.valor} className="leyenda-item">
                <span 
                  className="leyenda-color"
                  style={{ backgroundColor: getCategoriaColor(cat.valor) }}
                ></span>
                <span className="leyenda-texto">
                  {getIconoCategoria(cat.valor)} {cat.etiqueta} 
                  <span className="leyenda-cantidad">
                    ({eventosFiltrados.filter(e => e.categoria === cat.valor).length})
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel lateral (25% del ancho) */}
        <div className="panel-lateral">
          {eventoSeleccionado ? (
            <motion.div
              key={eventoSeleccionado.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="detalle-evento"
            >
              <div className="detalle-header">
                <div className="categoria-badge" style={{ 
                  backgroundColor: getCategoriaColor(eventoSeleccionado.categoria) 
                }}>
                  {getCategoriaNombre(eventoSeleccionado.categoria)}
                </div>
                <span className="evento-año">{getAñoEvento(eventoSeleccionado.fecha)}</span>
              </div>
              
              <h2 className="evento-titulo">{eventoSeleccionado.titulo}</h2>
              
              <div className="evento-meta">
                <div className="meta-item">
                  <span className="meta-icon">📅</span>
                  <span className="meta-text">{formatearFecha(eventoSeleccionado.fecha)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">📍</span>
                  <span className="meta-text">{eventoSeleccionado.region}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">🎯</span>
                  <span className="meta-text importancia-alta">
                    {eventoSeleccionado.importancia === 'alta' ? 'Alta importancia' : 'Importancia media'}
                  </span>
                </div>
              </div>
              
              <div className="evento-descripcion">
                <h3>📖 Descripción Histórica</h3>
                <p>{eventoSeleccionado.descripcion}</p>
              </div>
              
              {modoViaje && viajeActivo && (
                <div className="evento-viaje-info">
                  <div className="viaje-indicador-activo">
                    <span className="viaje-emoji">🎬</span>
                    <span className="viaje-mensaje">
                      Este evento es parte del viaje temporal actual
                    </span>
                    <div className="viaje-posicion">
                      Posición {viajeIndex + 1} de {eventosViaje.length}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="evento-acciones">
                <button className="accion-btn primario" onClick={reanudarViaje}>
                  🎧 Iniciar Viaje desde aquí
                </button>
                <button 
                  className="accion-btn secundario"
                  onClick={() => {
                    if (viajeActivo) {
                      pausarViaje();
                    }
                  }}
                >
                  {viajeActivo ? '⏸️ Pausar Viaje' : '▶️ Reanudar Viaje'}
                </button>
              </div>
              
              {/* Navegación entre eventos filtrados */}
              <div className="navegacion-eventos">
                <h4>📋 Eventos filtrados ({eventosFiltrados.length})</h4>
                <div className="eventos-relacionados">
                  {eventosFiltrados
                    .filter(e => e.id !== eventoSeleccionado.id)
                    .slice(0, 3)
                    .map(evento => (
                      <div 
                        key={evento.id}
                        className="evento-relacionado"
                        onClick={() => handleMarkerClick(evento)}
                      >
                        <span className="relacionado-icono">
                          {getIconoCategoria(evento.categoria)}
                        </span>
                        <div className="relacionado-info">
                          <div className="relacionado-titulo">{evento.titulo}</div>
                          <div className="relacionado-año">{getAñoEvento(evento.fecha)}</div>
                        </div>
                        {modoViaje && viajeActivo && eventosViaje.some(e => e.id === evento.id) && (
                          <span className="relacionado-en-viaje">🎬</span>
                        )}
                      </div>
                    ))}
                </div>
                
                <div className="navegacion-rapida">
                  <button 
                    className="navegacion-btn"
                    onClick={() => {
                      const indexActual = eventosFiltrados.findIndex(e => e.id === eventoSeleccionado.id);
                      if (indexActual > 0) {
                        const anteriorEvento = eventosFiltrados[indexActual - 1];
                        handleMarkerClick(anteriorEvento);
                      }
                    }}
                    disabled={eventosFiltrados.findIndex(e => e.id === eventoSeleccionado.id) === 0}
                  >
                    ⏮️ Anterior
                  </button>
                  <button 
                    className="navegacion-btn"
                    onClick={() => {
                      const indexActual = eventosFiltrados.findIndex(e => e.id === eventoSeleccionado.id);
                      if (indexActual < eventosFiltrados.length - 1) {
                        const siguienteEvento = eventosFiltrados[indexActual + 1];
                        handleMarkerClick(siguienteEvento);
                      }
                    }}
                    disabled={eventosFiltrados.findIndex(e => e.id === eventoSeleccionado.id) === eventosFiltrados.length - 1}
                  >
                    Siguiente ⏭️
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="lista-eventos">
              <h3>📜 Eventos Históricos</h3>
              <p className="instruccion">
                {eventosFiltrados.length > 0 
                  ? `Selecciona un evento (${eventosFiltrados.length} disponibles)` 
                  : 'No hay eventos con los filtros actuales'}
              </p>
              
              {modoViaje && viajeActivo && (
                <div className="lista-viaje-info">
                  <div className="viaje-lista-header">
                    <span className="viaje-lista-titulo">🎬 Viaje Temporal Activo</span>
                    <span className="viaje-lista-contador">
                      {viajeIndex + 1} / {eventosViaje.length}
                    </span>
                  </div>
                  <div className="viaje-lista-progreso">
                    <div 
                      className="viaje-lista-bar"
                      style={{ width: `${progresoViaje}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="eventos-scroll">
                {eventosFiltrados
                  .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                  .map((evento, index) => (
                    <div
                      key={evento.id}
                      className={`evento-item ${eventoSeleccionado?.id === evento.id ? 'seleccionado' : ''} ${modoViaje && viajeActivo && eventosViaje.some(e => e.id === evento.id) ? 'en-viaje' : ''}`}
                      onClick={() => handleMarkerClick(evento)}
                    >
                      <div className="evento-item-icono">
                        {getIconoCategoria(evento.categoria)}
                      </div>
                      <div className="evento-item-contenido">
                        <div className="evento-item-titulo">{evento.titulo}</div>
                        <div className="evento-item-meta">
                          <span className="evento-item-año">{getAñoEvento(evento.fecha)}</span>
                          <span className="evento-item-region">{evento.region}</span>
                        </div>
                      </div>
                      {modoViaje && viajeActivo && eventosViaje.some(e => e.id === evento.id) && (
                        <div className="evento-item-viaje">
                          <span className="viaje-indicador">🎬</span>
                          <span className="viaje-orden">
                            {eventosViaje.findIndex(e => e.id === evento.id) + 1}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              
              {eventosFiltrados.length === 0 && (
                <div className="sin-eventos">
                  <p>⚠️ No se encontraron eventos con los filtros actuales</p>
                  <button 
                    className="limpiar-filtros-btn"
                    onClick={() => setFiltros({ categoria: '', decada: '', periodo: '' })}
                  >
                    🔄 Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mapas;