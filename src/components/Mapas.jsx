import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapas.css';
import {
  FaMap,
  FaMapMarkerAlt,
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaCalendarAlt,
  FaBullseye,
  FaBook,
  FaExclamationTriangle,
  FaRedo,
  FaFilm,
  FaGlobeAmericas,
  FaSatellite,
  FaHeadphones
} from 'react-icons/fa';
import {
  MdMovieCreation,
  MdSkipNext,
  MdSkipPrevious,
  MdList
} from 'react-icons/md';
import {
  GiCrossedSwords,
  GiPalette,
  GiTwoCoins
} from 'react-icons/gi';

const eventosHistoricos = [
  { 
    id: 1, 
    fecha: "1810-07-20", 
    titulo: "Grito de Independencia", 
    descripcion: "En la Plaza Mayor de Santafé (hoy Plaza de Bolívar), criollos liderados por Antonio Morales y José María Carbonell exigen un cabildo abierto tras el incidente del Florero de Llorente, iniciando formalmente el proceso independentista contra el dominio español en el Virreinato de la Nueva Granada. Este acto, aunque inicialmente buscaba mayor autonomía más que independencia total, desencadenó una serie de juntas provinciales que llevaron a la primera república.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 2, 
    fecha: "1819-08-07", 
    titulo: "Batalla de Boyacá", 
    descripcion: "En el puente de Boyacá, a 110 km de Bogotá, el ejército patriota comandado por Simón Bolívar y Francisco de Paula Santander derrota definitivamente a las fuerzas realistas del coronel José María Barreiro. Esta victoria estratégica aseguró la independencia de la Nueva Granada, permitió la captura de más de 1,600 soldados realistas y abrió el camino para la creación de la Gran Colombia. La batalla duró aproximadamente 2 horas y fue el punto culminante de la Campaña Libertadora que comenzó en los Llanos orientales.", 
    categoria: "conflicto", 
    coordenadas: { lat: 5.4545, lng: -73.3615 }, 
    region: "Boyacá", 
    importancia: "alta" 
  },
  { 
    id: 3, 
    fecha: "1830-12-17", 
    titulo: "Muerte de Simón Bolívar", 
    descripcion: "A los 47 años, en la Quinta de San Pedro Alejandrino en Santa Marta, fallece el Libertador Simón Bolívar, afectado por tuberculosis y desilusionado por la disolución de la Gran Colombia. Sus últimas semanas estuvieron marcadas por la amargura política y el exilio voluntario. Su muerte coincidió con el colapso de su proyecto unificador, dejando un legado controvertido pero fundamental para la identidad de seis naciones. Sus restos fueron inicialmente enterrados en la Catedral de Santa Marta antes de ser trasladados a Caracas en 1842.", 
    categoria: "politico", 
    coordenadas: { lat: 11.2408, lng: -74.1990 }, 
    region: "Magdalena", 
    importancia: "alta" 
  },
  { 
    id: 4, 
    fecha: "1948-04-09", 
    titulo: "El Bogotazo", 
    descripcion: "Tras el asesinato del líder liberal y candidato presidencial Jorge Eliécer Gaitán en el centro de Bogotá alrededor de la 1:05 PM, estalla una violenta revuelta popular que destruye aproximadamente 300 edificios, incluyendo iglesias, tranvías y comercios. La violencia se extendió por 10 horas, dejando entre 3,000 y 5,000 muertos. El Bogotazo marcó el inicio de 'La Violencia', un período de guerra civil no declarada entre liberales y conservadores que duró una década y dejó más de 200,000 víctimas. El evento coincidía con la Novena Conferencia Panamericana, con delegados internacionales como Fidel Castro presentes.", 
    categoria: "conflicto", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 5, 
    fecha: "1953-06-13", 
    titulo: "Golpe de Estado de Rojas Pinilla", 
    descripcion: "El general Gustavo Rojas Pinilla, con apoyo de sectores militares y políticos, derroca al presidente Laureano Gómez estableciendo un régimen militar que prometía pacificar el país tras 'La Violencia'. Inicialmente popular por su carisma y obras públicas como el Canal de Televisión Nacional, su gobierno se volvió autoritario, censurando prensa y reprimiendo protestas. Su caída en 1957 tras un paro nacional y presión bipartidista abrió camino al Frente Nacional. Rojas Pinilla fue el último dictador militar en Colombia hasta ese momento.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 6, 
    fecha: "1964-05-27", 
    titulo: "Creación de las FARC", 
    descripcion: "En la región de Marquetalia (Tolima), aproximadamente 48 campesinos liderados por Manuel Marulanda Vélez (alias 'Tirofijo') y Jacobo Arenas se organizan para resistir la Operación Marquetalia del ejército colombiano, dando origen formalmente a las Fuerzas Armadas Revolucionarias de Colombia. Inicialmente llamadas 'Bloque Sur', adoptaron el nombre FARC-EP (Ejército del Pueblo) en 1966. Este grupo guerrillero, de ideología marxista-leninista, se convirtió en el más grande y longevo del continente, con presencia en aproximadamente el 40% del territorio nacional en su apogeo y protagonizando más de 50 años de conflicto armado.", 
    categoria: "conflicto", 
    coordenadas: { lat: 2.9768, lng: -75.9011 }, 
    region: "Tolima", 
    importancia: "alta" 
  },
  { 
    id: 7, 
    fecha: "1970-04-19", 
    titulo: "Fraude electoral", 
    descripcion: "En elecciones presidenciales, el candidato de la Alianza Nacional Popular (ANAPO) Gustavo Rojas Pinilla pierde estrechamente contra Misael Pastrana Borrero del Frente Nacional. Sospechas de fraude electoral masivo en favor del candidato oficial generaron protestas masivas y la formación del movimiento guerrillero M-19. El llamado 'Fraude del 19 de abril' profundizó la desconfianza en el sistema político bipartidista y alimentó la insurgencia urbana. La noche electoral fue marcada por suspensión de conteos y denuncias de manipulación en mesas de votación.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 8, 
    fecha: "1982-10-21", 
    titulo: "Nobel a Gabriel García Márquez", 
    descripcion: "En Estocolmo, Suecia, el escritor colombiano Gabriel García Márquez recibe el Premio Nobel de Literatura por su obra cumbre 'Cien años de soledad' (1967) y su contribución al realismo mágico. García Márquez, nacido en Aracataca (Magdalena), fue el cuarto latinoamericano en recibir este galardón. En su discurso de aceptación, titulado 'La soledad de América Latina', reflexionó sobre la identidad del continente. El premio catapultó la literatura colombiana al reconocimiento mundial y consolidó a Macondo como un espacio literario universal.", 
    categoria: "cultural", 
    coordenadas: { lat: 10.9639, lng: -74.7964 }, 
    region: "Magdalena", 
    importancia: "alta" 
  },
  { 
    id: 9, 
    fecha: "1985-11-06", 
    titulo: "Toma del Palacio de Justicia", 
    descripcion: "A las 11:35 AM, 35 guerrilleros del M-19 toman el Palacio de Justicia en el centro de Bogotá, reteniendo a más de 300 rehenes, incluidos 24 magistrados de la Corte Suprema. La operación militar de rescate, que incluyó tanques y armamento pesado, culminó en un incendio que destruyó el edificio. El saldo oficial fue de 98 muertos (incluyendo 11 magistrados) y 11 desaparecidos. El evento representó uno de los mayores desafíos al Estado de derecho y generó décadas de controversia sobre responsabilidades, especialmente tras la desaparición forzada de empleados de la cafetería.", 
    categoria: "conflicto", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 10, 
    fecha: "1989-08-18", 
    titulo: "Asesinato de Luis Carlos Galán", 
    descripcion: "Durante un mitin político en la localidad de Soacha, el candidato presidencial liberal Luis Carlos Galán Sarmiento es asesinado a bala por sicarios del Cartel de Medellín. Galán, principal favorito para las elecciones de 1990, lideraba una campaña anticorrupción y antinarcóticos. Su muerte, ordenada por Pablo Escobar, marcó un punto de inflexión en la guerra contra el narcotráfico y llevó a la extradición de colombianos a EE.UU. y al establecimiento de la Constituyente de 1991. Galán se convirtió en símbolo de la lucha por la democracia amenazada por el narcoterrorismo.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5794, lng: -74.2161 }, 
    region: "Cundinamarca", 
    importancia: "alta" 
  },
  { 
    id: 11, 
    fecha: "1991-07-04", 
    titulo: "Nueva Constitución Política", 
    descripcion: "Tras un proceso democrático sin precedentes que incluyó una Asamblea Nacional Constituyente con 70 delegados (incluidos ex guerrilleros, indígenas y representantes religiosos), se promulga la Constitución de 1991. Reemplazó a la centenaria Carta de 1886, estableciendo Colombia como un Estado Social de Derecho, pluralista y participativo. Entre sus innovaciones destacan: la acción de tutela, la Corte Constitucional, la descentralización política, el reconocimiento de derechos fundamentales, y la protección de la diversidad étnica y cultural. Esta Constitución es considerada una de las más progresistas de América Latina.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 12, 
    fecha: "1993-12-02", 
    titulo: "Muerte de Pablo Escobar", 
    descripcion: "En un tejado del barrio Los Olivos en Medellín, Pablo Emilio Escobar Gaviria, líder del Cartel de Medellín y considerado el narcotraficante más poderoso del mundo en los años 80, muere en un enfrentamiento con el Bloque de Búsqueda. Escobar, conocido como 'El Patrón', había construido un imperio criminal responsable del 80% de la cocaína que entraba a EE.UU., orquestado cientos de asesinatos (incluidos políticos, jueces y periodistas) y ataques terroristas como el del avión de Avianca. Su muerte marcó el fin de una era de violencia narcoterrorista pero no del narcotráfico en Colombia.", 
    categoria: "conflicto", 
    coordenadas: { lat: 6.2442, lng: -75.5812 }, 
    region: "Antioquia", 
    importancia: "alta" 
  },
  { 
    id: 13, 
    fecha: "2000-01-01", 
    titulo: "Plan Colombia", 
    descripcion: "Inicia formalmente el Plan Colombia, un acuerdo bilateral con Estados Unidos por 7,500 millones de dólares para combatir el narcotráfico y fortalecer instituciones estatales. Originalmente concebido como ayuda para el desarrollo alternativo, se transformó en un programa principalmente militar que incluyó fumigación aérea con glifosato, entrenamiento de fuerzas especiales y entrega de equipamiento. El Plan redujo significativamente los cultivos de coca pero tuvo impactos ambientales y sociales controvertidos. También contribuyó al debilitamiento de las FARC, preparando el terreno para futuras negociaciones de paz.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 14, 
    fecha: "2002-08-07", 
    titulo: "Inicio del gobierno de Álvaro Uribe", 
    descripcion: "Álvaro Uribe Vélez asume la presidencia con el lema 'Mano firme, corazón grande', implementando la Política de Seguridad Democrática que priorizó el enfrentamiento militar a guerrillas y paramilitares. Su gobierno, caracterizado por alta popularidad, fortaleció las Fuerzas Armadas, recuperó control territorial y redujo secuestros y homicidios. Sin embargo, enfrentó escándalos como los 'falsos positivos' y parapolítica. Uribe fue el primer presidente en ser reelecto consecutivamente (2006) tras reforma constitucional, marcando un período de estabilidad política con profundas divisiones sociales.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 15, 
    fecha: "2008-03-01", 
    titulo: "Operación Fénix", 
    descripcion: "Fuerzas militares colombianas, con apoyo de inteligencia estadounidense, atacan un campamento de las FARC en Angostura, Ecuador, matando al comandante Raúl Reyes (segundo al mando de las FARC) y 24 personas más. La operación transfronteriza generó una grave crisis diplomática con Ecuador y Venezuela, que movilizaron tropas a sus fronteras. La incursión proporcionó computadores con valiosa inteligencia sobre la guerrilla pero cuestionó el principio de soberanía nacional. Reyes era el principal negociador internacional de las FARC y su muerte afectó la estructura de mando insurgente.", 
    categoria: "conflicto", 
    coordenadas: { lat: 0.8748, lng: -76.6311 }, 
    region: "Putumayo", 
    importancia: "alta" 
  },
  { 
    id: 16, 
    fecha: "2011-06-10", 
    titulo: "Ley de Víctimas y Restitución de Tierras", 
    descripcion: "El presidente Juan Manuel Santos sanciona la Ley 1448, considerada el marco jurídico más ambicioso de justicia transicional en América. La ley reconoció a más de 9 millones de colombianos como víctimas del conflicto armado, estableció mecanismos de reparación individual y colectiva, y creó la Unidad de Restitución de Tierras para devolver 6 millones de hectáreas despojadas. También estableció la Comisión de la Verdad y la Jurisdicción Especial para la Paz. Representó un cambio de paradigma en la atención estatal a víctimas tras décadas de negación.", 
    categoria: "social", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 17, 
    fecha: "2016-11-24", 
    titulo: "Firma del Acuerdo de Paz", 
    descripcion: "En el Teatro Colón de Bogotá, el presidente Juan Manuel Santos y el comandante de las FARC Rodrigo Londoño Echeverri (Timochenko) firman el Acuerdo Final para la Terminación del Conflicto y la Construcción de una Paz Estable y Duradera, tras 4 años de negociaciones en La Habana. El acuerdo de 310 páginas incluía: justicia transicional (Jurisdicción Especial para la Paz), desarme y reintegración de 13,000 guerrilleros, reforma rural integral, solución al problema de las drogas ilícitas, y participación política. Aunque inicialmente rechazado en plebiscito, fue ajustado y ratificado en el Congreso.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 18, 
    fecha: "2019-11-21", 
    titulo: "Paro Nacional 2019", 
    descripcion: "Inician las mayores protestas sociales en décadas, convocadas por centrales obreras, estudiantes y movimientos sociales contra reformas laborales, pensionales y educativas del gobierno de Iván Duque. Las marchas, caracterizadas por performances artísticas y cacerolazos, mantuvieron movilización constante por semanas. Aunque mayormente pacíficas, enfrentaron episodios de violencia policial documentados por organismos de derechos humanos. El paro forzó la retirada de varias iniciativas legislativas y evidenció el descontento de una generación que no vivió el conflicto armado pero sufre desigualdad y falta de oportunidades.", 
    categoria: "social", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 19, 
    fecha: "2021-04-28", 
    titulo: "Paro Nacional 2021", 
    descripcion: "Estalla un nuevo ciclo de protestas masivas inicialmente contra una reforma tributaria durante la pandemia, pero que rápidamente amplió demandas a salud, educación y contra la violencia policial. Caracterizado por bloqueos viales y concentraciones en el Portal de las Américas en Bogotá, el paro duró más de dos meses con participación mayoritaria de jóvenes. El informe de la CIDH documentó 83 muertes y 1,832 heridos, principalmente por intervención de la fuerza pública. El movimiento generó solidaridad internacional y forzó la retirada total de la reforma, pero dejó profundas divisiones políticas.", 
    categoria: "social", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 20, 
    fecha: "2022-06-19", 
    titulo: "Elección de Gustavo Petro", 
    descripcion: "En segunda vuelta electoral, Gustavo Petro Urrego, ex guerrillero del M-19, economista y senador, se convierte en el primer presidente de izquierda en la historia de Colombia con el 50.44% de los votos, derrotando al empresario Rodolfo Hernández. Su victoria representa un giro político histórico en un país tradicionalmente gobernado por élites liberales y conservadoras. Petro propuso una agenda de 'Cambio' enfocada en: reforma agraria, transición energética, reforma al sistema de salud y pensiones, y la implementación integral del acuerdo de paz. Su elección también marcó la primera vez que una mujer afrodescendiente, Francia Márquez, alcanzó la vicepresidencia.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 21, 
    fecha: "1903-11-03", 
    titulo: "Separación de Panamá", 
    descripcion: "Con apoyo naval de Estados Unidos, Panamá declara su independencia de Colombia, culminando décadas de tensiones por abandono estatal y el fracaso del Canal Francés. El presidente Roosevelt facilitó la separación para asegurar derechos de construcción del canal interoceánico. Colombia perdió un territorio estratégico de 75,517 km² y acceso a dos océanos. El reconocimiento colombiano llegó en 1922 con el Tratado Urrutia-Thomson y compensación de 25 millones de dólares. La separación debilitó la economía nacional y generó trauma histórico sobre la integridad territorial.", 
    categoria: "politico", 
    coordenadas: { lat: 8.5375, lng: -80.7821 }, 
    region: "Panamá", 
    importancia: "alta" 
  },
  { 
    id: 22, 
    fecha: "1928-12-06", 
    titulo: "Masacre de las Bananeras", 
    descripcion: "En la estación del ferrocarril de Ciénaga (Magdalena), el ejército colombiano al mando del general Carlos Cortés Vargas disparó contra una multitud de aproximadamente 3,000 trabajadores de la United Fruit Company que protestaban pacíficamente por mejores condiciones laborales. Aunque el parte oficial reportó 9 muertos, estimaciones históricas señalan entre 800 y 3,000 víctimas. El evento, inmortalizado por Gabriel García Márquez en 'Cien años de soledad', evidenció la influencia de empresas extranjeras y la represión estatal contra movimientos obreros. El silencio oficial posterior generó el eufemismo 'los sucesos de las bananeras'.", 
    categoria: "social", 
    coordenadas: { lat: 10.7639, lng: -74.1597 }, 
    region: "Magdalena", 
    importancia: "alta" 
  },
  { 
    id: 23, 
    fecha: "1958-08-07", 
    titulo: "Inicio del Frente Nacional", 
    descripcion: "Tras 10 años de 'La Violencia', liberales y conservadores firman el Pacto de Benidorm (1956) y luego el Frente Nacional, estableciendo alternancia presidencial cada 4 años y paridad burocrática por 16 años (1958-1974). El acuerdo, impulsado por Alberto Lleras Camargo y Laureano Gómez, buscaba pacificar el país pero excluyó otros movimientos políticos, generando resentimiento que alimentó insurgencias. Estabilizó la democracia pero institucionalizó el bipartidismo y el clientelismo. Marcó el fin de la violencia partidista pero abrió espacio para nuevos conflictos ideológicos.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 24, 
    fecha: "1984-03-28", 
    titulo: "Acuerdo de La Uribe", 
    descripcion: "En La Uribe (Meta), el gobierno de Belisario Betancur y las FARC firman los primeros acuerdos de cese al fuego, tregua y diálogo de paz, tras negociaciones iniciadas en 1982. Incluyó creación de la Comisión de Paz, cese de hostilidades bilateral y compromisos de reinserción. Aunque inicialmente promisorio, el proceso colapsó en 1987 por asesinatos de militantes de la Unión Patriótica, rearme de las FARC y toma del Palacio de Justicia. Representó el primer intento serio de paz con la guerrilla más antigua y estableció lecciones para futuras negociaciones.", 
    categoria: "conflicto", 
    coordenadas: { lat: 3.2542, lng: -75.2338 }, 
    region: "Meta", 
    importancia: "media" 
  },
  { 
    id: 25, 
    fecha: "2000-08-03", 
    titulo: "Masacre de El Salado", 
    descripcion: "Durante 5 días, más de 450 paramilitares de las AUC asesinan a más de 60 campesinos en El Salado (Bolívar), en una de las masacres más brutales del conflicto. Los habitantes fueron torturados, decapitados y sometidos a 'juegos' macabros mientras se transmitía música vallenata a alto volumen. La masacre, parte de la estrategia paramilitar para controlar zonas de influencia y rutas del narcotráfico, evidenció la connivencia de algunos agentes estatales. Simbolizó la degradación del conflicto y la victimización de comunidades rurales atrapadas entre actores armados.", 
    categoria: "conflicto", 
    coordenadas: { lat: 8.6256, lng: -75.0317 }, 
    region: "Bolívar", 
    importancia: "alta" 
  },
  { 
    id: 26, 
    fecha: "2010-08-07", 
    titulo: "Inicio del gobierno de Juan Manuel Santos", 
    descripcion: "Juan Manuel Santos Calderón, ex ministro de Defensa de Uribe, asume la presidencia con promesa de continuidad en seguridad pero sorprende iniciando diálogos secretos con las FARC en 2012. Su gobierno se caracterizó por el 'giro hacia la paz', políticas de innovación y ciencia, y el proceso de admisión a la OCDE. Aunque enfrentó paros agrarios y escándalos de corrupción, su mayor legado fue el acuerdo de paz que le mereció el Nobel de la Paz 2016. Santos representó la transición de la seguridad democrática a la construcción de paz.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 27, 
    fecha: "2017-09-01", 
    titulo: "Desarme de las FARC", 
    descripcion: "La Misión de Verificación de la ONU certifica la entrega de 8,994 armas por parte de las FARC en 26 zonas veredales, culminando el proceso de dejación de armas más grande en América Latina. Cada arma fue extraída de contenedores sellados y destruida, transformándose en monumentos de paz. El proceso, supervisado por 450 observadores internacionales, permitió la transición de 13,000 guerrilleros a la vida civil. Marcó el fin histórico de las FARC como grupo armado y el inicio de su transformación en partido político, aunque con desafíos en implementación y seguridad de excombatientes.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 28, 
    fecha: "1200-01-01", 
    titulo: "Fundación de la Ciudad Perdida", 
    descripcion: "En la Sierra Nevada de Santa Marta, a 1,200 metros sobre el nivel del mar, la civilización Tayrona inicia la construcción de Teyuna (Ciudad Perdida), un complejo urbano de aproximadamente 35 hectáreas con terrazas, plazas ceremoniales y caminos empedrados. Esta ciudad, redescubierta en 1975 por guaqueros, fue el centro político y ceremonial de una sociedad que desarrolló avanzados sistemas agrícolas, orfebrería en tumbaga y una cosmovisión basada en el equilibrio con la naturaleza. Su abandono hacia el siglo XVI, probablemente por conquista española y enfermedades, dejó un legado arqueológico que evidencia la complejidad de las sociedades precolombinas colombianas.", 
    categoria: "cultural", 
    coordenadas: { lat: 11.0396, lng: -73.9265 }, 
    region: "Magdalena", 
    importancia: "alta" 
  },
  { 
    id: 29, 
    fecha: "800-01-01", 
    titulo: "Apogeo de la Cultura Quimbaya", 
    descripcion: "En el Eje Cafetero actual, la cultura Quimbaya alcanza su máximo esplendor en orfebrería, produciendo poporos antropomorfos, narigueras y pectorales de una aleación de oro y cobre (tumbaga) con técnica de la cera perdida. Su arte, caracterizado por figuras humanas estilizadas y objetos utilitarios, reflejaba creencias chamánicas y organización social estratificada. Los Quimbayas dominaron la metalurgia prehispánica y el comercio regional. Su legado incluye el famoso 'Tesoro de los Quimbayas' regalado a la reina de España en 1892, símbolo de disputas sobre patrimonio cultural.", 
    categoria: "cultural", 
    coordenadas: { lat: 4.8133, lng: -75.6961 }, 
    region: "Quindío", 
    importancia: "alta" 
  },
  { 
    id: 30, 
    fecha: "600-01-01", 
    titulo: "Desarrollo de la Cultura San Agustín", 
    descripcion: "En el Macizo Colombiano, la cultura San Agustín desarrolla uno de los complejos funerarios y escultóricos más importantes de América precolombina, con más de 500 estatuas monolíticas de hasta 4 metros de altura. Estas esculturas, que representan deidades, chamanes y animales míticos, muestran sofisticación artística y cosmovisión compleja. El Parque Arqueológico, declarado Patrimonio de la Humanidad en 1995, incluye mesitas ceremoniales, tumbas y acueductos. San Agustín evidencia la diversidad cultural prehispánica y el desarrollo de sociedades agrícolas en el Alto Magdalena.", 
    categoria: "cultural", 
    coordenadas: { lat: 1.8800, lng: -76.2667 }, 
    region: "Huila", 
    importancia: "alta" 
  },
  { 
    id: 31, 
    fecha: "1000-01-01", 
    titulo: "Expansión de la Cultura Muisca", 
    descripcion: "En el altiplano cundiboyacense, la Confederación Muisca, organizada en dos grandes federaciones (Hunza y Bacatá), desarrolla una sociedad compleja con agricultura de terrazas, minería de sal y esmeraldas, y comercio de trueque. Conocidos por la Leyenda de El Dorado (ceremonia del cacique dorado en la laguna de Guatavita), los muiscas destacaron en tejidos, cerámica y orfebrería. Su sistema político de cacicazgos, lengua chibcha y calendario agrícola influyeron en la organización colonial temprana. Representaron la civilización prehispánica más poblada del actual territorio colombiano.", 
    categoria: "cultural", 
    coordenadas: { lat: 5.5469, lng: -73.3622 }, 
    region: "Boyacá", 
    importancia: "alta" 
  },
  { 
    id: 32, 
    fecha: "1499-01-01", 
    titulo: "Primer Viaje de Alonso de Ojeda", 
    descripcion: "Alonso de Ojeda, acompañado por el cartógrafo Américo Vespucio, realiza el primer viaje europeo documentado a la costa atlántica colombiana, explorando desde la península de La Guajira hasta el golfo de Urabá. El viaje, autorizado por la Corona española tras el descubrimiento de América, estableció contacto inicial con pueblos wayuu y estableció el nombre 'Venezuela' (pequeña Venecia). Marcó el inicio de la conquista española en territorio colombiano y generó los primeros registros cartográficos y etnográficos de la región, aunque también conflictos con indígenas que resistieron la invasión.", 
    categoria: "politico", 
    coordenadas: { lat: 11.2408, lng: -74.1990 }, 
    region: "La Guajira", 
    importancia: "alta" 
  },
  { 
    id: 33, 
    fecha: "1525-02-29", 
    titulo: "Fundación de Santa Marta", 
    descripcion: "El explorador español Rodrigo de Bastidas funda Santa Marta, primera ciudad permanente en territorio colombiano y una de las más antiguas de Sudamérica. Ubicada estratégicamente en bahía protegida, sirvió como base para expediciones al interior y centro de esclavización indígena. Aunque sufrió ataques piratas y enfermedades, mantuvo importancia como puerto exportador de oro y perlas. Su fundación inició el establecimiento colonial sistemático y la transformación demográfica y cultural del Caribe colombiano. La ciudad conserva el distrito histórico más antiguo del país.", 
    categoria: "politico", 
    coordenadas: { lat: 11.2408, lng: -74.1990 }, 
    region: "Magdalena", 
    importancia: "alta" 
  },
  { 
    id: 34, 
    fecha: "1536-04-06", 
    titulo: "Expedición de Gonzalo Jiménez de Quesada", 
    descripcion: "Partiendo de Santa Marta con 800 hombres, Jiménez de Quesada emprende la expedición más importante de conquista hacia el interior, remontando el río Magdalena en busca de El Dorado. Tras 9 meses de penurias, enfermedades y conflictos con indígenas, solo 170 hombres llegan al altiplano cundiboyacense. La expedición, caracterizada por crueldad hacia los muiscas, estableció las bases para la fundación de Bogotá y la dominación española del centro del país. Representó el encuentro violento entre dos mundos que transformaría irreversiblemente la sociedad indígena.", 
    categoria: "conflicto", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Cundinamarca", 
    importancia: "alta" 
  },
  { 
    id: 35, 
    fecha: "1538-08-06", 
    titulo: "Fundación de Santafé de Bogotá", 
    descripcion: "Gonzalo Jiménez de Quesada funda Santafé en el valle de los muiscas, sobre el antiguo poblado indígena de Bacatá. La ciudad se estableció como centro administrativo del Nuevo Reino de Granada, siguiendo el trazado español de plaza mayor y damero. Su ubicación estratégica en el altiplano facilitó control sobre territorios circundantes y rutas comerciales. Santafé se convirtió en sede de la Real Audiencia (1549) y posteriormente capital virreinal, concentrando poder político, religioso y económico durante la colonia y la república.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 36, 
    fecha: "1540-01-01", 
    titulo: "Creación de la Real Audiencia", 
    descripcion: "La Corona española establece la Real Audiencia del Nuevo Reino de Granada con sede en Santafé, órgano judicial y administrativo que gobernaba los actuales Colombia, Venezuela, Ecuador y Panamá. Presidida por un oidor, centralizó la administración colonial, aplicó las Leyes de Indias y resolvió disputas entre colonos. La Audiencia representó el establecimiento formal del dominio español institucionalizado, reemplazando el gobierno provisional de conquistadores. Su archivo conserva documentos fundamentales para la historia colonial colombiana.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 37, 
    fecha: "1564-01-01", 
    titulo: "Fundación de la Universidad Tomística", 
    descripcion: "La Orden Dominicana funda el Colegio-Universidad Santo Tomás de Aquino en Santafé, primera institución de educación superior en Colombia y una de las primeras en América. Inicialmente enfocada en teología y filosofía escolástica para formación del clero, expandió sus cátedras a derecho y medicina. Su creación reflejó la importancia de la Iglesia en la educación colonial y la transferencia del conocimiento europeo. Es antecedente directo de la Universidad Santo Tomás, la más antigua del país aún en funcionamiento.", 
    categoria: "cultural", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 38, 
    fecha: "1697-05-04", 
    titulo: "Ataque de Henry Morgan a Cartagena", 
    descripcion: "El pirata galés Henry Morgan, con 1,400 hombres y 38 navíos, saquea Cartagena durante 14 días tras superar las defensas del Fuerte San Felipe. El ataque, parte de las rivalidades imperiales anglo-españolas, demostró vulnerabilidades de la principal fortaleza española en el Caribe. Aunque Morgan se retiró tras cobrar rescate, el evento aceleró la construcción de murallas más fuertes y el sistema defensivo que haría de Cartagena la 'Ciudad Heroica'. Representó el constante asedio que sufrieron las posesiones españolas por potencias europeas competidoras.", 
    categoria: "conflicto", 
    coordenadas: { lat: 10.3910, lng: -75.4794 }, 
    region: "Bolívar", 
    importancia: "media" 
  },
  { 
    id: 39, 
    fecha: "1717-05-27", 
    titulo: "Creación del Virreinato de Nueva Granada", 
    descripcion: "El rey Felipe V establece el Virreinato de Nueva Granada, separándolo del Virreinato del Perú para mejorar administración y defensa. Con capital en Santafé, abarcó los actuales Colombia, Venezuela, Ecuador y Panamá. El virrey, representante directo del monarca, concentró poder ejecutivo, militar y judicial. El virreinato estimuló el comercio interno, el crecimiento urbano y la consolidación de élites criollas. Su restablecimiento definitivo en 1739 marcó el período de mayor estabilidad colonial hasta las independencias.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 40, 
    fecha: "1781-03-16", 
    titulo: "Rebelión de los Comuneros", 
    descripcion: "En el Socorro (Santander), Manuela Beltrán rompe el edicto de nuevos impuestos, desencadenando la rebelión más importante contra la Corona española antes de la Independencia. Liderados por Juan Francisco Berbeo, más de 20,000 comuneros marcharon hacia Santafé exigiendo eliminación de impuestos y reformas. Aunque las Capitulaciones de Zipaquirá fueron traicionadas por las autoridades, la rebelión demostró capacidad de movilización popular y sentó precedentes de lucha contra el abuso fiscal. Influenció los movimientos independentistas y se convirtió en símbolo de resistencia popular.", 
    categoria: "social", 
    coordenadas: { lat: 6.4684, lng: -73.2602 }, 
    region: "Santander", 
    importancia: "alta" 
  },
  { 
    id: 41, 
    fecha: "1809-08-10", 
    titulo: "Primer Grito de Independencia en América", 
    descripcion: "En Quito, criollos deponen al presidente de la Real Audiencia y forman una junta de gobierno autónoma, primer movimiento independentista exitoso en Hispanoamérica. Aunque sofocada en 1810, la revuelta inspiró a neogranadinos y circuló documentos que alimentaron el ideario independentista. Su lema 'Recuerdo de los inmortales hijos del 10 de agosto de 1809' fue retomado en Nueva Granada. Representó el inicio del ciclo independentista continental y la influencia de las ideas ilustradas y napoleónicas en las élites criollas.", 
    categoria: "politico", 
    coordenadas: { lat: -0.2202, lng: -78.5123 }, 
    region: "Ecuador", 
    importancia: "alta" 
  },
  { 
    id: 42, 
    fecha: "1815-08-06", 
    titulo: "Sitio de Cartagena", 
    descripcion: "El ejército realista de Pablo Morillo inicia asedio de 105 días a Cartagena, última ciudad patriota en resistencia. La población, liderada por Gabriel y Germán Gutiérrez de Piñeres, sufrió hambre, epidemias y bombardeos constantes. Tras caer la ciudad, Morillo ejecutó a líderes patriotas en la Huerta de Martínez. El Sitio, conocido como 'Heroica Resistencia', le valió a Cartagena el título de 'Ciudad Heroica' y fue conmemorado con el Escudo de la República. Representó el momento más dramático de la Reconquista española y el sacrificio por la causa independentista.", 
    categoria: "conflicto", 
    coordenadas: { lat: 10.3910, lng: -75.4794 }, 
    region: "Bolívar", 
    importancia: "alta" 
  },
  { 
    id: 43, 
    fecha: "1821-10-07", 
    titulo: "Congreso de Cúcuta", 
    descripcion: "En la Villa del Rosario de Cúcuta, 57 diputados (incluyendo 26 venezolanos) redactan la Constitución de la Gran Colombia y eligen a Simón Bolívar como presidente. El Congreso abolió la Inquisición, decretó libertad de vientres y centralizó el gobierno. Aunque la Gran Colombia duró solo 11 años, el Congreso representó el ideal bolivariano de unificación hispanoamericana y estableció instituciones republicanas. Su sede, la Casa Histórica, es monumento nacional que simboliza el esfuerzo constitucionalista tras la independencia.", 
    categoria: "politico", 
    coordenadas: { lat: 7.8939, lng: -72.5078 }, 
    region: "Norte de Santander", 
    importancia: "alta" 
  },
  { 
    id: 44, 
    fecha: "1828-09-25", 
    titulo: "Conspiración Septembrina", 
    descripcion: "En el Palacio de San Carlos (Bogotá), un grupo de conspiradores liderados por el coronel Agustín Horment intenta asesinar al Libertador Simón Bolívar, quien escapa saltando por una ventana ayudado por su amante Manuela Sáenz. La conspiración, alimentada por descontento con el autoritarismo bolivariano y la Constitución Vitalicia, incluyó a intelectuales como Francisco de Paula Santander (exiliado tras el juicio). Reflejó las profundas divisiones en la Gran Colombia y el fracaso del proyecto bolivariano de unidad bajo fuerte liderazgo ejecutivo.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 45, 
    fecha: "1832-04-29", 
    titulo: "Creación de la República de Nueva Granada", 
    descripcion: "Tras la disolución de la Gran Colombia, la Convención Granadina proclama la República de Nueva Granada, adoptando una constitución centralista bajo presidencia de Francisco de Paula Santander. La nueva república, con capital en Bogotá, enfrentó desafíos de construcción estatal, crisis fiscal y conflictos regionales. Estableció las bases del sistema político decimonónico colombiano, con divisiones entre centralistas y federalistas que marcarían el siglo XIX. Representó el inicio de Colombia como Estado-nación independiente, aunque con fronteras reducidas.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 46, 
    fecha: "1849-04-01", 
    titulo: "Abolición de la Esclavitud", 
    descripcion: "El presidente José Hilario López sanciona la Ley de Libertad de Vientres, que declaraba libres a los hijos de esclavas nacidos después de la ley y establecía la manumisión gradual. La ley, impulsada por el liberalismo radical y presión británica, afectó a aproximadamente 20,000 esclavos de un total de 50,000. Aunque limitada, representó el primer paso formal hacia la abolición total en un país donde la esclavitud había sido pilar económico desde la colonia. Generó resistencia de hacendados pero inició transformación social profunda.", 
    categoria: "social", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 47, 
    fecha: "1851-05-21", 
    titulo: "Abolición Total de la Esclavitud", 
    descripcion: "El presidente José Hilario López decreta la abolición definitiva de la esclavitud, liberando a los aproximadamente 16,472 esclavos restantes. Los dueños recibieron indemnización con bonos del Estado, aunque muchos nunca los cobraron. La abolición, adelantada por motivos humanitarios y económicos (transición a trabajo asalariado), generó rebeliones de esclavizados que aceleraron el proceso. Colombia fue uno de los últimos países americanos en abolir la esclavitud, completando un proceso que transformó relaciones laborales y sociales pero no eliminó discriminación racial.", 
    categoria: "social", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 48, 
    fecha: "1863-05-08", 
    titulo: "Constitución de Rionegro", 
    descripcion: "En Rionegro (Antioquia), la Convención Nacional promulga la Constitución más radicalmente federalista de Colombia, creando los Estados Unidos de Colombia. Estableció periodos presidenciales de 2 años, amplias libertades individuales (incluyendo de culto) y autonomía casi completa de los 9 estados soberanos. Aunque progresista en libertades, su extremo federalismo debilitó al gobierno central, generando inestabilidad política y conflictos interestatales. Regiría por 23 años hasta la Regeneración y representa el auge del liberalismo radical en el siglo XIX.", 
    categoria: "politico", 
    coordenadas: { lat: 6.1551, lng: -75.3737 }, 
    region: "Antioquia", 
    importancia: "alta" 
  },
  { 
    id: 49, 
    fecha: "1885-01-01", 
    titulo: "Guerra Civil de 1885", 
    descripcion: "Conflicto entre gobiernos federalistas liberales y el centralismo impulsado por Rafael Núñez y el Partido Conservador. La guerra, desatada por intento liberal de reformar la Constitución de Rionegro, culminó con victoria conservadora en la batalla de La Humareda. Condujo directamente a la Regeneración, movimiento que buscaba restaurar orden, moral católica y autoridad central. Marcó el fin del federalismo radical y preparó el terreno para la Constitución centralista de 1886, que regiría por 105 años.", 
    categoria: "conflicto", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Cundinamarca", 
    importancia: "media" 
  },
  { 
    id: 50, 
    fecha: "1886-08-05", 
    titulo: "Constitución de 1886", 
    descripcion: "Promulgada por Rafael Núñez y Miguel Antonio Caro, estableció un Estado centralista, confesional católico y presidencialista fuerte, regido por el lema 'Regeneración o Catástrofe'. Suprimió la soberanía de los estados, restringió libertades individuales y estableció periodo presidencial de 6 años. Aunque reformada múltiples veces, fue la constitución más longeva de Colombia (105 años), sobreviviendo a la Guerra de los Mil Días, La Violencia y el Frente Nacional. Su derogación en 1991 marcó el inicio del Estado Social de Derecho.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 51, 
    fecha: "1905-01-01", 
    titulo: "Separación del Departamento de Panamá", 
    descripcion: "Tras la separación de 1903, Colombia reorganiza sus divisiones territoriales, eliminando el Departamento de Panamá y estableciendo nuevas comisarías. Esta reorganización administrativa reflejó la necesidad de adaptar la estructura estatal tras la pérdida del istmo, que representaba el 10% del territorio nacional y principal acceso al Pacífico. La separación generó trauma nacional, debates sobre responsabilidades y redefinió la geopolítica colombiana hacia el interior andino. Panamá permanecería como tema recurrente en política exterior y memoria histórica.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 52, 
    fecha: "1910-07-20", 
    titulo: "Asamblea Nacional Constituyente", 
    descripcion: "Tras la dictadura de Rafael Reyes (1904-1909), una Asamblea Constituyente reforma la Carta de 1886, estableciendo período presidencial de 4 años, prohibición de reelección inmediata y creación de la Contraloría General. La reforma, impulsada por republicanos y conservadores históricos, buscaba evitar nuevas dictaduras y fortalecer controles institucionales. Representó la transición hacia el sistema político del siglo XX y el inicio de la Hegemonía Conservadora que dominaría hasta 1930, caracterizada por estabilidad institucional pero exclusión política de liberales.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 53, 
    fecha: "1914-08-15", 
    titulo: "Inauguración del Canal de Panamá", 
    descripcion: "Estados Unidos inaugura oficialmente el Canal de Panamá, obra de 77 km que conecta Atlántico y Pacífico, transformando el comercio mundial. Para Colombia, la inauguración fue recordatorio amargo de la pérdida territorial y oportunidad económica desaprovechada. El canal incrementó la importancia geopolítica de la región pero marginó a Colombia del comercio interoceánico directo. Su construcción, que costó aproximadamente 25,000 vidas, consolidó la influencia estadounidense en Centroamérica y redefinió rutas marítimas globales.", 
    categoria: "economico", 
    coordenadas: { lat: 9.0800, lng: -79.6800 }, 
    region: "Panamá", 
    importancia: "alta" 
  },
  { 
    id: 54, 
    fecha: "1922-03-24", 
    titulo: "Tratado Urrutia-Thomson", 
    descripcion: "Colombia y Estados Unidos firman tratado que reconoce la independencia de Panamá a cambio de 25 millones de dólares de indemnización y derechos preferenciales en el canal. El acuerdo, negociado por el canciller colombiano Marco Fidel Suárez, cerró décadas de tensiones bilaterales pero generó controversia nacional sobre 'venta de la patria'. Los fondos se destinaron a infraestructura como el Ferrocarril del Pacífico. Representó la pragmática aceptación de realidades geopolíticas y el inicio de relaciones más estables, aunque desiguales, con Estados Unidos.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 55, 
    fecha: "1930-02-09", 
    titulo: "Elección de Enrique Olaya Herrera", 
    descripcion: "Enrique Olaya Herrera gana las elecciones presidenciales, terminando con 44 años de Hegemonía Conservadora y restaurando el bipartidismo. Su victoria, con apoyo de liberales y conservadores disidentes, marcó transición pacífica en medio de crisis económica por la Gran Depresión. Su gobierno, de 'Concentración Nacional', impulsó obras públicas, reformas sociales moderadas y política exterior activa. Aunque breve (murió en 1934), estableció el patrón de alternancia liberal-conservadora que caracterizaría el período hasta 1946, con mayor inclusión política pero persistencia de violencia rural.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 56, 
    fecha: "1932-09-01", 
    titulo: "Guerra Colombo-Peruana", 
    descripcion: "Perú invade el puerto de Leticia en la Amazonía, desatando conflicto por el Trapecio Amazónico definido en el Tratado Salomón-Lozano (1922). Colombia, con apoyo diplomático de la Sociedad de Naciones y militar de Brasil, recupera el territorio tras combates navales en el río Putumayo. La guerra, que movilizó voluntarios nacionalistas, consolidó la soberanía colombiana sobre su acceso al Amazonas y modernizó las fuerzas armadas. El Protocolo de Río de Janeiro (1934) ratificó los límites, cerrando el último conflicto internacional armado de Colombia en el siglo XX.", 
    categoria: "conflicto", 
    coordenadas: { lat: -4.2153, lng: -69.9406 }, 
    region: "Amazonas", 
    importancia: "alta" 
  },
  { 
    id: 57, 
    fecha: "1936-08-01", 
    titulo: "Reforma Constitucional", 
    descripcion: "Durante la 'Revolución en Marcha' de Alfonso López Pumarejo, se reforma la Constitución de 1886 introduciendo derechos sociales, función social de la propiedad y regulación estatal de la economía. La reforma, inspirada en constituciones mexicanas y alemanas, respondía a demandas obreras y campesinas tras la Gran Depresión. Aunque moderada frente a proyectos socialistas, generó fuerte oposición conservadora y eclesiástica. Representó el momento más progresista del liberalismo colombiano y sentó bases para el Estado intervencionista, aunque su implementación fue limitada por resistencias políticas.", 
    categoria: "social", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 58, 
    fecha: "1945-07-10", 
    titulo: "Creación de las Naciones Unidas", 
    descripcion: "Colombia, representada por el canciller Alberto Lleras Camargo, es uno de los 51 países fundadores de la ONU en la Conferencia de San Francisco. La participación activa reflejó la política exterior multilateralista que caracterizaría al país, incluyendo contribuciones a fuerzas de paz y organismos especializados. Colombia ha sido miembro no permanente del Consejo de Seguridad en 7 ocasiones. La membresía fundacional consolidó el perfil internacional del país como actor responsable en sistema multilateral, aunque con tensiones entre soberanía y derechos humanos.", 
    categoria: "politico", 
    coordenadas: { lat: 40.7490, lng: -73.9680 }, 
    region: "Internacional", 
    importancia: "alta" 
  },
  { 
    id: 59, 
    fecha: "1951-11-09", 
    titulo: "Colombia en la Guerra de Corea", 
    descripcion: "El Batallón Colombia, con 5,100 soldados, llega a Corea como parte de fuerzas de la ONU, siendo el único país latinoamericano en enviar tropas. Participó en batallas clave como Old Baldy y demostró capacidad combativa, con 163 muertos y 448 heridos. La participación, decidida por Laureano Gómez, buscaba fortalecer relaciones con EE.UU. y ganar prestigio internacional. Aunque criticada por involucrar a Colombia en conflicto lejano, trajo beneficios como entrenamiento militar moderno y visibilidad en escenario global durante Guerra Fría.", 
    categoria: "conflicto", 
    coordenadas: { lat: 37.5665, lng: 126.9780 }, 
    region: "Corea", 
    importancia: "media" 
  },
  { 
    id: 60, 
    fecha: "1958-12-01", 
    titulo: "Inicio del Frente Nacional", 
    descripcion: "Tras plebiscito constitucional, inicia formalmente el Frente Nacional con Alberto Lleras Camargo como primer presidente bajo el sistema de alternación liberal-conservadora y paridad burocrática. El acuerdo, resultado del Pacto de Benidorm y Sitges, buscaba superar 'La Violencia' pero excluyó terceras fuerzas políticas, generando movimientos insurgentes. Aunque estabilizó la democracia y permitió desarrollo económico, institucionalizó el clientelismo bipartidista y retardó reformas sociales. Su final en 1974 abrió espacio para nuevos actores pero dejó herencia de exclusión política.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 61, 
    fecha: "1962-05-15", 
    titulo: "Primera Teletón en Colombia", 
    descripción: "Inicia la primera campaña Teletón en Colombia, maratón televisivo de 27 horas organizado por Caracol TV para recaudar fondos para niños con discapacidad. Inspirada en el modelo chileno, reunió a artistas, deportistas y políticos, recaudando 6 millones de pesos de la época. La Teletón institucionalizó la filantropía televisada y creó la Fundación Teletón para rehabilitación infantil. Aunque criticada por su enfoque asistencialista, movilizó solidaridad nacional y visibilizó necesidades de población discapacitada, realizándose periódicamente por décadas.", 
    categoria: "social", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 62, 
    fecha: "1967-07-20", 
    titulo: "Inauguración del Museo del Oro", 
    descripcion: "Se inaugura el nuevo edificio del Museo del Oro del Banco de la República en Bogotá, diseñado por el arquitecto Germán Samper. Alberga la colección de orfebrería prehispánica más grande del mundo (34,000 piezas de oro y tumbaga), incluyendo la famosa Balsa Muisca. El museo, resultado de décadas de investigación arqueológica, se convirtió en símbolo cultural nacional y atractivo turístico principal. Su arquitectura moderna y museografía innovadora lo posicionaron como institución de referencia mundial en preservación y divulgación del patrimonio precolombino.", 
    categoria: "cultural", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 63, 
    fecha: "1970-06-01", 
    titulo: "Primer Campeonato Mundial de Fútbol", 
    descripcion: "Colombia organiza y gana su primer Campeonato Mundial FIFA, el Mundial Sub-20 de 1970, venciendo en semifinal a la Unión Soviética y en final a México. La victoria, lograda con jugadores como Carlos 'El Pibe' Valderrama (aún juvenil) y Willington Ortíz, generó euforia nacional y demostró capacidad organizativa. El torneo, jugado en Bogotá, Cali y Medellín, mostró al país en escenario deportivo internacional y estimuló inversión en infraestructura. Aunque el fútbol profesional colombiano existía desde 1948, este título fue primer logro mundial reconocido.", 
    categoria: "cultural", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 64, 
    fecha: "1974-08-07", 
    titulo: "Fin del Frente Nacional", 
    descripcion: "Alfonso López Michelsen asume como presidente, siendo el primero elegido sin restricciones de alternación desde 1958, marcando el fin formal del Frente Nacional. Aunque mantuvo algunos elementos de coalición, su gobierno representó la apertura del sistema político a mayor competencia. Implementó el Estatuto de Seguridad para enfrentar insurgencia pero también impulsó descentralización y reformas económicas. El fin del Frente permitió emergencia de nuevos movimientos pero también intensificó conflicto armado y narcotráfico, en un contexto de crisis económica mundial.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 65, 
    fecha: "1975-12-12", 
    titulo: "Creación del Sistema Nacional de Salud", 
    descripcion: "Mediante el Decreto 056 se establece el Sistema Nacional de Salud (SNS), unificando servicios públicos de salud y creando el Instituto de Seguros Sociales como eje. El sistema, aunque fragmentado entre múltiples entidades, representó el primer esfuerzo integral de cobertura sanitaria, inspirado en modelos de seguridad social europeos. Expandió atención a trabajadores formales pero excluyó a mayoría rural e informal. Sentó bases para futuras reformas y evidenció desafíos crónicos de financiamiento, calidad y equidad que persistirían por décadas.", 
    categoria: "social", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 66, 
    fecha: "1980-02-27", 
    titulo: "Toma de la Embajada de República Dominicana", 
    descripcion: "El M-19 toma la embajada dominicana en Bogotá durante 61 días, reteniendo a 60 rehenes incluido el embajador de EE.UU. Diego Ascencio. La operación, dirigida por Rosemberg Pabón ('Comandante Uno'), exigía liberación de presos políticos y denuncia de violaciones de derechos humanos. La negociación, mediada por la OEA y Cuba, culminó con entrega de guerrilleros a Cuba y pago de rescate. Fue el secuestro más largo de la historia colombiana y demostró la capacidad del M-19 para acciones espectaculares que captaban atención internacional.", 
    categoria: "conflicto", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 67, 
    fecha: "1983-11-25", 
    titulo: "Narcotráfico invade el Palacio de Justicia", 
    descripcion: "Miembros del Cartel de Medellín, disfrazados de militares, toman brevemente el Palacio de Justicia en Bogotá buscando destruir expedientes de extradición. El ataque, menos de dos años antes de la toma del M-19, evidenció la audacia del narcotráfico para intimidar al Estado. Aunque rápidamente controlado, mostró la vulnerabilidad de instituciones y la escalada de narcoterrorismo. Prefiguró métodos que luego usarían contra la Corte Suprema, incluyendo sobornos y amenazas a magistrados, en la guerra contra el tratado de extradición con EE.UU.", 
    categoria: "conflicto", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 68, 
    fecha: "1985-11-13", 
    titulo: "Erupción del Nevado del Ruiz", 
    descripcion: "Tras 69 años de inactividad, el volcán Nevado del Ruiz entra en erupción, derritiendo el 10% de su glaciar y generando lahares (flujos de lodo) que viajan a 60 km/h por el río Lagunilla. A las 11:35 PM, una avalancha de 40 millones de metros cúbicos de material sepulta completamente el municipio de Armero (Tolima), matando a más de 23,000 de sus 29,000 habitantes. La tragedia, internacionalmente conocida por la agonía de 13-year-old Omayra Sánchez durante 3 días, expuso fallas en sistemas de alerta temprana y gestión de riesgos. Fue el cuarto desastre volcánico más mortal del siglo XX.", 
    categoria: "social", 
    coordenadas: { lat: 4.8950, lng: -75.3200 }, 
    region: "Tolima", 
    importancia: "alta" 
  },
  { 
    id: 69, 
    fecha: "1988-01-25", 
    titulo: "Asesinato de Jaime Pardo Leal", 
    descripcion: "En la vía Bogotá-La Mesa, es asesinado Jaime Pardo Leal, primer candidato presidencial de la Unión Patriótica (UP), partido surgido de los acuerdos de paz con las FARC. Su muerte inició el exterminio sistemático de la UP que dejaría más de 3,000 militantes asesinados, incluyendo 2 candidatos presidenciales, 8 congresistas y 70 concejales. El crimen, atribuido a paramilitares con posible connivencia estatal, simbolizó el fracaso de la reinserción política pactada en La Uribe y profundizó la desconfianza en procesos de paz.", 
    categoria: "conflicto", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 70, 
    fecha: "1989-12-06", 
    titulo: "Atentado al edificio del DAS", 
    descripcion: "Un camión bomba de 500 kg explota frente al edificio del Departamento Administrativo de Seguridad (DAS) en Bogotá, matando a 63 personas e hiriendo a 1,000. El atentado, ordenado por Pablo Escobar en represalia por extradiciones, fue el más mortífero del Cartel de Medellín en la capital. Destruyó completamente el bloque 6 del Centro Administrativo Nacional y dañó edificios circundantes. Representó la escalada máxima del narcoterrorismo en zonas urbanas y llevó a la ofensiva estatal que culminaría con la muerte de Escobar en 1993.", 
    categoria: "conflicto", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 71, 
    fecha: "1999-01-19", 
    titulo: "Inicio de Diálogos del Caguán", 
    descripcion: "El presidente Andrés Pastrana despeja militarmente 42,000 km² en Caquetá y Meta para iniciar diálogos de paz con las FARC en San Vicente del Caguán. La 'zona de despeje', controvertida por permitir libertad de acción guerrillera, albergó negociaciones que incluyeron agenda de 12 puntos. Aunque inicialmente esperanzadoras, las conversaciones se estancaron por secuestros continuados y falta de compromiso de las FARC. Colapsaron definitivamente en 2002 tras secuestro de un avión comercial, llevando a la política de seguridad democrática de Uribe.", 
    categoria: "politico", 
    coordenadas: { lat: 2.1769, lng: -74.7806 }, 
    region: "Caquetá", 
    importancia: "alta" 
  },
  { 
    id: 72, 
    fecha: "2002-02-20", 
    titulo: "Fin de los Diálogos del Caguán", 
    descripcion: "Tras el secuestro por las FARC del avión de Aires con el senador Jorge Eduardo Gechem a bordo, el presidente Pastrana ordena fin de la zona de despeje y ruptura de diálogos. El fracaso, tras 3 años de negociaciones y concesiones territoriales, generó desilusión nacional y respaldo a opciones militaristas. Las FARC aprovecharon la zona para fortalecimiento militar y narcotráfico. El colapso justificó la ofensiva militar del siguiente gobierno y mostró los límites de negociaciones sin cesación de hostilidades ni garantías de desmovilización.", 
    categoria: "politico", 
    coordenadas: { lat: 2.1769, lng: -74.7806 }, 
    region: "Caquetá", 
    importancia: "alta" 
  },
  { 
    id: 73, 
    fecha: "2003-07-01", 
    titulo: "Desmovilización de las AUC", 
    descripcion: "En Santa Fe de Ralito (Córdoba), líderes paramilitares de las Autodefensas Unidas de Colombia firman acuerdo de desmovilización con el gobierno de Álvaro Uribe, iniciando proceso que desarmaría a 31,671 combatientes. El acuerdo, bajo Ley de Justicia y Paz, ofrecía penas reducidas a cambio de verdad y reparación. Aunque redujo violencia en algunas regiones, fue criticado por impunidad, reinicio de actividades criminales (bandas emergentes) y limitada reparación a víctimas. Representó el mayor proceso de desmovilización colectiva pero con resultados mixtos en justicia transicional.", 
    categoria: "politico", 
    coordenadas: { lat: 7.9680, lng: -75.2140 }, 
    region: "Córdoba", 
    importancia: "alta" 
  },
  { 
    id: 74, 
    fecha: "2008-07-02", 
    titulo: "Operación Jaque", 
    descripcion: "El ejército colombiano rescata a 15 secuestrados (incluyendo a la excandidata presidencial Ingrid Betancourt, 3 contratistas estadounidenses y 11 militares) en el Guaviare, infiltrando a agentes que se hicieron pasar por miembros de una ONG y helicópteros de las FARC. La operación, planificada por 22 meses sin disparar un solo tiro, fue celebrada internacionalmente como modelo de inteligencia y precisión. Simbolizó el debilitamiento de las FARC y mejoró la imagen del gobierno Uribe. Betancourt, secuestrada por 6 años, se convirtió en símbolo mundial de la lucha contra el secuestro.", 
    categoria: "conflicto", 
    coordenadas: { lat: 2.6333, lng: -72.7333 }, 
    region: "Guaviare", 
    importancia: "alta" 
  },
  { 
    id: 75, 
    fecha: "2011-09-04", 
    titulo: "Ley de Tierras y Víctimas", 
    descripcion: "El presidente Juan Manuel Santos sanciona la Ley 1448 de Víctimas y Restitución de Tierras, marco jurídico más ambicioso de justicia transicional en América. Reconoció a más de 9 millones de víctimas del conflicto, estableció reparación integral y creó la Unidad de Restitución de Tierras para devolver 6 millones de hectáreas despojadas. Aunque enfrentó obstáculos en implementación y resistencia de poderes regionales, representó cambio paradigmático en reconocimiento estatal del daño causado por conflicto armado. Sentó bases institucionales para el postconflicto.", 
    categoria: "social", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 76, 
    fecha: "2012-10-18", 
    titulo: "Inicio de Diálogos de Paz en La Habana", 
    descripcion: "Tras meses de contactos secretos en Cuba, gobierno de Santos y FARC anuncian públicamente inicio de negociaciones formales en Oslo, continuando en La Habana. La agenda de 6 puntos incluía: reforma rural, participación política, fin del conflicto, solución al narcotráfico, víctimas e implementación. A diferencia del Caguán, no hubo cese al fuego ni zona desmilitarizada. El proceso, mediado por Cuba y Noruega, se caracterizó por metodología gradual y comunicados conjuntos. Marcó el giro del gobierno Santos hacia la solución política tras una década de ofensiva militar.", 
    categoria: "politico", 
    coordenadas: { lat: 23.1136, lng: -82.3666 }, 
    region: "Cuba", 
    importancia: "alta" 
  },
  { 
    id: 77, 
    fecha: "2015-09-23", 
    titulo: "Acuerdo de Paz con las FARC", 
    descripcion: "En ceremonia histórica en La Habana, el presidente Santos y Timochenko anuncian haber alcanzado acuerdo sobre el primer punto de la agenda (política de desarrollo agrario integral) tras casi 3 años de negociaciones. El momento, transmitido en cadena nacional, generó esperanza de fin próximo del conflicto aunque quedaban puntos cruciales como justicia transicional. El acuerdo incluyó programas de sustitución de cultivos, formalización de tierras y desarrollo rural con enfoque territorial. Mostró la viabilidad del proceso a pesar de escepticismos iniciales y ataques de opositores.", 
    categoria: "politico", 
    coordenadas: { lat: 23.1136, lng: -82.3666 }, 
    region: "Cuba", 
    importancia: "alta" 
  },
  { 
    id: 78, 
    fecha: "2016-10-02", 
    titulo: "Plebiscito por la Paz", 
    descripcion: "En consulta popular, el acuerdo de paz es rechazado por estrecho margen (50.21% 'No' vs 49.78% 'Sí') con participación del 37.4%. El resultado, sorpresivo para encuestas, reflejó divisiones regionales (ganó 'Sí' en zonas afectadas por conflicto), desinformación y rechazo a aspectos como justicia transicional. La derrota forzó renegociación de puntos críticos con opositores y generó crisis política. Aunque el acuerdo fue posteriormente ratificado por Congreso, el plebiscito mostró profundas fracturas sociales y el desafío de construir consenso sobre memoria y perdón.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 79, 
    fecha: "2017-09-26", 
    titulo: "Firma del Acuerdo de Paz Final", 
    descripcion: "En Cartagena, ante jefes de Estado y 2,500 invitados, el gobierno y las FARC firman el acuerdo final revisado tras el plebiscito. La ceremonia, simbólica por realizarse en ciudad históricamente sitiada, incluyó acto de perdón de Timochenko a víctimas. El documento de 310 páginas incorporó 500 cambios solicitados por el 'No', principalmente en justicia transicional y género. Aunque ratificado por Congreso y no sometido a nueva consulta, mantuvo esencia del acuerdo original. Marcó el cierre formal de negociaciones y inicio de implementación legislativa.", 
    categoria: "politico", 
    coordenadas: { lat: 10.3910, lng: -75.4794 }, 
    region: "Bolívar", 
    importancia: "alta" 
  },
  { 
    id: 80, 
    fecha: "2019-11-25", 
    titulo: "Paro Nacional más grande de la historia", 
    descripcion: "Más de 1.5 millones de colombianos salen a las calles en 120 municipios en la movilización más masiva desde 1977, convocada por centrales obreras, estudiantes y organizaciones sociales. Las protestas, inicialmente contra reformas laborales y pensionales, ampliaron a demandas contra corrupción, asesinato de líderes sociales y cumplimiento de acuerdos de paz. Caracterizadas por performances artísticas y cacerolazos, mantuvieron presión por semanas hasta logar retiro de iniciativas legislativas. Mostraron capacidad de movilización intergeneracional y nuevas formas de protesta digital.", 
    categoria: "social", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 81, 
    fecha: "1985-11-13", 
    titulo: "Desastre de Armero", 
    descripcion: "Tras 69 años de inactividad, el volcán Nevado del Ruiz entra en erupción, derritiendo el 10% de su glaciar y generando lahares (flujos de lodo) que viajan a 60 km/h por el río Lagunilla. A las 11:35 PM, una avalancha de 40 millones de metros cúbicos de material sepulta completamente el municipio de Armero (Tolima), matando a más de 23,000 de sus 29,000 habitantes. La tragedia, internacionalmente conocida por la agonía de 13-year-old Omayra Sánchez durante 3 días, expuso fallas en sistemas de alerta temprana y gestión de riesgos. Fue el cuarto desastre volcánico más mortal del siglo XX.", 
    categoria: "social", 
    coordenadas: { lat: 4.9667, lng: -74.9000 }, 
    region: "Tolima", 
    importancia: "alta" 
  },
  { 
    id: 82, 
    fecha: "1999-12-15", 
    titulo: "Terremoto del Eje Cafetero", 
    descripcion: "Un sismo de 6.2 grados Richter con epicentro en Córdoba (Quindío) destruye el 60% de Armenia, afecta gravemente a Pereira y Manizales, dejando 1,230 muertos, 5,000 heridos y 200,000 damnificados. El terremoto, ocurrido a las 13:19 horas, colapsó edificios mal construidos y expuso deficiencias en normas sismo-resistentes. La reconstrucción, con inversión de 2,000 millones de dólares y apoyo internacional, transformó urbanísticamente la región pero generó endeudamiento municipal. Marcó un hito en gestión de desastres y renovación urbana del Eje Cafetero.", 
    categoria: "social", 
    coordenadas: { lat: 4.5333, lng: -75.6833 }, 
    region: "Quindío", 
    importancia: "alta" 
  },
  { 
    id: 83, 
    fecha: "2010-12-06", 
    titulo: "Invierno más fuerte de la historia", 
    descripcion: "La ola invernal 2010-2011, causada por el fenómeno de La Niña, afecta a 2.2 millones de personas en 28 departamentos, con 420 muertos, 500,000 damnificados y pérdidas por 6,000 millones de dólares. Inundaciones persistentes colapsaron infraestructura vial, destruyeron cultivos y generaron emergencia humanitaria prolongada. La crisis expuso vulnerabilidad climática del país y deficiencias en prevención de desastres. Llevó a creación del Fondo de Adaptación y replanteamiento de políticas de ordenamiento territorial, aunque con implementación limitada frente a recurrentes emergencias invernales.", 
    categoria: "social", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 84, 
    fecha: "2017-04-01", 
    titulo: "Tragedia de Mocoa", 
    descripcion: "Torrenciales lluvias desbordan los ríos Mocoa, Mulato y Sangoyaco, generando avalancha de lodo y piedras que arrasa barrios enteros de la capital del Putumayo a la 1:00 AM. La tragedia deja 332 muertos, 400 heridos y 22,000 afectados, en el peor desastre natural desde Armero. Causado por deforestación, urbanización en laderas y falta de sistemas de alerta, evidenció vulnerabilidad de poblaciones amazónicas ante eventos climáticos extremos. La respuesta estatal, con apoyo internacional, incluyó reconstrucción pero persistieron riesgos no mitigados en la región.", 
    categoria: "social", 
    coordenadas: { lat: 1.1528, lng: -76.6525 }, 
    region: "Putumayo", 
    importancia: "alta" 
  },
  { 
    id: 85, 
    fecha: "1948-06-13", 
    titulo: "Asesinato de Jorge Eliécer Gaitán", 
    descripcion: "A las 1:05 PM, frente al edificio Agustín Nieto en el centro de Bogotá, es asesinado el caudillo liberal Jorge Eliécer Gaitán, favorito para las elecciones presidenciales de 1950. El crimen, cometido por Juan Roa Sierra (linchado por la multitud), desencadenó inmediatamente El Bogotazo y una década de 'La Violencia' bipartidista. Gaitán, populista que movilizó masas campesinas y obreras, representaba amenaza para élites tradicionales. Su muerte truncó posibilidad de reformas sociales profundas y marcó el país con trauma político que alimentaría insurgencias futuras.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 86, 
    fecha: "1962-08-30", 
    titulo: "Primera transmisión de televisión a color", 
    descripcion: "Inauguraciones TV presenta la primera transmisión experimental a color en Colombia desde los estudios de la Universidad Nacional, utilizando sistema NTSC donado por Japón. Aunque la televisión comercial a color regular comenzaría en 1974, este hito tecnológico mostró la modernización de medios de comunicación. La TV a color transformó consumo cultural, publicidad y producción nacional, aunque inicialmente era privilegio de élites por alto costo de receptores. Marcó la integración de Colombia a tendencias tecnológicas globales en era de masificación mediática.", 
    categoria: "cultural", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 87, 
    fecha: "1975-08-01", 
    titulo: "Lanzamiento de 'Cien años de soledad' en español", 
    descripcion: "La Editorial Sudamericana de Buenos Aires publica la primera edición en español de 'Cien años de soledad' de Gabriel García Márquez, novela escrita durante 18 meses en México. La obra, que fusiona realidad histórica colombiana con realismo mágico, se agotó en una semana y definiría la literatura latinoamericana del Boom. Su éxito internacional, con traducciones a 35 idiomas y ventas de 50 millones de copias, proyectó a Colombia como potencia cultural. Macondo se convirtió en metáfora universal del destino latinoamericano y del aislamiento humano.", 
    categoria: "cultural", 
    coordenadas: { lat: -34.6037, lng: -58.3816 }, 
    region: "Argentina", 
    importancia: "alta" 
  },
  { 
    id: 88, 
    fecha: "1990-06-18", 
    titulo: "Colombia en el Mundial de Italia", 
    descripcion: "La selección colombiana debuta en Copa Mundial de Fútbol en Italia '90, venciendo 2-0 a Emiratos Árabes y empatando 1-1 con Alemania Federal, avanzando a octavos de final donde cae ante Camerún. El equipo, dirigido por Francisco Maturana con jugadores como Carlos Valderrama y René Higuita, mostró el 'fútbol champagne' ofensivo que cautivó aficionados mundiales. Aunque eliminada tempranamente, la participación legitimó a Colombia en elite futbolística y proyectó imagen positiva internacional, contrastando con violencia interna. Preparó el terreno para el histórico Mundial de 1994.", 
    categoria: "cultural", 
    coordenadas: { lat: 41.9028, lng: 12.4964 }, 
    region: "Italia", 
    importancia: "media" 
  },
  { 
    id: 89, 
    fecha: "1995-07-04", 
    titulo: "Título de Miss Universo", 
    descripcion: "En Miami, la colombiana Luz Marina Zuluaga gana el certamen Miss Universo 1958, siendo la primera y única colombiana en lograr este título hasta 2023. Su victoria, en pleno Frente Nacional, generó orgullo nacional y proyectó imagen de belleza y gracia colombiana. Zuluaga, de Manizales, representaba ideal de mujer latina educada y elegante. Aunque criticado por algunos como concurso superficial, el título impulsó industria de belleza nacional y estableció tradición de participación exitosa en certámenes internacionales que continuaría por décadas.", 
    categoria: "cultural", 
    coordenadas: { lat: 25.7617, lng: -80.1918 }, 
    region: "EE.UU.", 
    importancia: "media" 
  },
  { 
    id: 90, 
    fecha: "2001-08-11", 
    titulo: "Primer título mundial de boxeo", 
    descripcion: "Miguel 'Happy' Lora gana el título mundial de peso gallo del CMB al vencer al mexicano Alberto Dávila, siendo el primer boxeador colombiano en conquistar campeonato mundial de una organización reconocida. Su victoria, en plena crisis de violencia, generó esperanza y demostró talento deportivo nacional en disciplina individual. Lora defendió exitosamente su título y abrió camino para generaciones de boxeadores colombianos como Antonio Cervantes 'Kid Pambelé' (ya campeón pero en época menos mediática). El boxeo se consolidó como deporte de oportunidades para jóvenes de barrios populares.", 
    categoria: "cultural", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 91, 
    fecha: "1919-12-14", 
    titulo: "Primer vuelo comercial en Colombia", 
    descripcion: "La Sociedad Colombo-Alemana de Transportes Aéreos (SCADTA), fundada por alemanes y colombianos, realiza el primer vuelo comercial entre Barranquilla y Puerto Colombia, transportando correo. SCADTA, precursora de Avianca, fue la segunda aerolínea comercial más antigua del mundo en operación continua. Su creación revolucionó transporte en país de geografía difícil, conectando regiones aisladas y estimulando comercio. La aviación comercial transformó movilidad, integración nacional y proyección internacional de Colombia, aunque inicialmente era servicio de élites por alto costo.", 
    categoria: "economico", 
    coordenadas: { lat: 4.4525, lng: -75.7664 }, 
    region: "Caldas", 
    importancia: "media" 
  },
  { 
    id: 92, 
    fecha: "1938-08-06", 
    titulo: "Inauguración del Ferrocarril del Pacífico", 
    descripcion: "Se completa el Ferrocarril del Pacífico que conecta Buenaventura (principal puerto del Pacífico) con Cali y el interior del país, obra de 467 km construida durante 40 años. El ferrocarril, financiado con capital británico y nacional, revolucionó exportaciones de café hacia Europa y Asia, integró la economía del Valle del Cauca y estimuló industrialización regional. Aunque posteriormente reemplazado por carreteras, fue columna vertebral del desarrollo económico de mediados del siglo XX y símbolo de modernización infraestructural bajo gobiernos liberales.", 
    categoria: "economico", 
    coordenadas: { lat: 3.8833, lng: -77.0333 }, 
    region: "Valle del Cauca", 
    importancia: "media" 
  },
  { 
    id: 93, 
    fecha: "1969-04-28", 
    titulo: "Creación del Pacto Andino", 
    descripcion: "Colombia, junto a Bolivia, Chile, Ecuador y Perú, firma el Acuerdo de Cartagena que establece la Comunidad Andina (CAN), proceso de integración subregional más antiguo de América Latina. El pacto, impulsado por visión de mercados ampliados y desarrollo industrial conjunto, incluyó arancel externo común y programas sectoriales. Aunque afectado por crisis económicas y cambios políticos, la CAN facilitó comercio intrarregional, coordinación política y creación de instituciones como el Parlamento Andino. Representó el compromiso colombiano con integración latinoamericana frente a hegemonía estadounidense.", 
    categoria: "economico", 
    coordenadas: { lat: -12.0464, lng: -77.0428 }, 
    region: "Perú", 
    importancia: "alta" 
  },
  { 
    id: 94, 
    fecha: "1974-01-01", 
    titulo: "Descubrimiento de Caño Limón", 
    descripcion: "En Arauca, se descubre el yacimiento petrolífero Caño Limón, uno de los mayores del país con reservas iniciales de 1,100 millones de barriles. Su explotación, iniciada en 1986 por Ecopetrol y Occidental Petroleum, transformó la economía nacional, generando hasta el 20% de producción petrolera colombiana. El boom petrolero generó ingresos fiscales pero también conflictos sociales, ambientales y de seguridad por presencia guerrillera. Marcó el inicio de Colombia como exportador neto de petróleo y redefinió política energética, con impactos duraderos en desarrollo regional y relaciones con EE.UU.", 
    categoria: "economico", 
    coordenadas: { lat: 7.0333, lng: -71.5667 }, 
    region: "Arauca", 
    importancia: "alta" 
  },
  { 
    id: 95, 
    fecha: "1991-11-27", 
    titulo: "Apertura económica", 
    descripcion: "El gobierno de César Gaviria implementa la Apertura Económica, eliminando restricciones comerciales, reduciendo aranceles promedio del 40% al 12% y liberalizando mercados. La reforma, inspirada en Consenso de Washington, buscaba modernizar economía proteccionista pero generó crisis industrial con quiebra de 8,000 empresas. Aunque aumentó importaciones y diversificación exportadora, profundizó desigualdad y desempleo. Representó el fin del modelo de sustitución de importaciones y la integración acelerada a globalización, con efectos controvertidos en desarrollo industrial y empleo formal.", 
    categoria: "economico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 96, 
    fecha: "2000-01-01", 
    titulo: "Implementación del Plan Colombia", 
    descripcion: "Inicia formalmente el Plan Colombia, acuerdo bilateral con EE.UU. por 7,500 millones de dólares para combatir narcotráfico, fortalecer instituciones y promover desarrollo alternativo. Aunque inicialmente concebido con balance entre componentes militares y sociales, predominó enfoque militar con fumigación aérea con glifosato y entrenamiento de fuerzas especiales. Redujo cultivos de coca en 50% pero tuvo impactos ambientales y en salud pública controvertidos. Fortaleció capacidad militar estatal contra guerrillas y paramilitares, preparando condiciones para ofensivas posteriores y eventuales negociaciones de paz.", 
    categoria: "economico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 97, 
    fecha: "2011-11-08", 
    titulo: "Tratado de Libre Comercio con EE.UU.", 
    descripcion: "Tras 6 años de negociaciones y controversias políticas, entra en vigor el TLC entre Colombia y Estados Unidos, el acuerdo comercial más importante de la historia colombiana. El tratado, que eliminó aranceles para 80% de productos, incrementó exportaciones agrícolas e industriales pero afectó sectores sensibles como lácteos y textiles. Generó debates sobre pérdida de soberanía, estándares laborales y ambiental. Consolidó la relación económica bilateral (EE.UU. es principal socio comercial) y profundizó el modelo de apertura económica iniciado en 1990, con impactos desiguales por sectores y regiones.", 
    categoria: "economico", 
    coordenadas: { lat: 38.9072, lng: -77.0369 }, 
    region: "EE.UU.", 
    importancia: "alta" 
  },
  { 
    id: 98, 
    fecha: "1942-03-24", 
    titulo: "Fundación del Instituto Caro y Cuervo", 
    descripcion: "Por decreto presidencial se crea el Instituto Caro y Cuervo, centro de investigación filológica y lingüística en honor a los gramáticos Miguel Antonio Caro y Rufino José Cuervo. La institución, con sede en Bogotá y posteriormente en Yerbabuena, se dedicó a estudio del español de Colombia, publicación de clásicos y elaboración del Diccionario de Construcción y Régimen. Su trabajo preservó patrimonio lexicográfico y promovió estudios del lenguaje como elemento identitario. Representó el compromiso estatal con cultura académica en medio de conflictos políticos del siglo XX.", 
    categoria: "cultural", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 99, 
    fecha: "1969-12-21", 
    titulo: "Llegada del Hombre a la Luna", 
    descripcion: "Millones de colombianos siguen por televisión y radio la transmisión del alunizaje del Apolo 11, evento tecnológico que simbolizó la modernidad global alcanzable. Aunque Colombia no participó directamente, la cobertura mediática masiva inspiró generaciones hacia ciencia y tecnología. El evento coincidió con crecimiento económico nacional y expectativas de desarrollo. En contexto de Guerra Fría, mostró supremacía tecnológica occidental pero también posibilidades ilimitadas del progreso humano. Quedó en memoria colectiva como hito generacional de asombro ante avances científicos.", 
    categoria: "cultural", 
    coordenadas: { lat: 0.6741, lng: 23.4729 }, 
    region: "Luna", 
    importancia: "media" 
  },
  { 
    id: 100, 
    fecha: "1985-04-16", 
    titulo: "Primer trasplante de corazón", 
    descripcion: "En la Fundación Cardioinfantil de Bogotá, el equipo del doctor Alberto Villegas Peralta realiza el primer trasplante cardíaco exitoso en Colombia a un paciente de 32 años. El procedimiento, que requirió coordinación multidisciplinaria y tecnología de punta, colocó a Colombia en el mapa de la cirugía cardiovascular latinoamericana. Aunque los trasplantes eran realizados desde 1973 (riñón), el cardíaco representó mayor complejidad. Estimuló desarrollo de programas de trasplantes nacionales y legislación sobre donación de órganos, salvando miles de vidas posteriormente.", 
    categoria: "social", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 101, 
    fecha: "2007-03-07", 
    titulo: "Lanzamiento del satélite Libertad 1", 
    descripcion: "Desde el cosmódromo de Baikonur (Kazajistán), es lanzado el primer satélite colombiano, Libertad 1, desarrollado por la Universidad Sergio Arboleda. El cubesat de 1 kg transmitió señales durante un mes, demostrando capacidad tecnológica nacional en espacio. Aunque modesto comparado con satélites comerciales, su desarrollo por estudiantes e investigadores marcó inicio del programa espacial colombiano. Estimuló creación de la Comisión Colombiana del Espacio y proyectos posteriores como el satélite de observación terrestre FACSAT. Representó la incursión de Colombia en la era espacial con fines científicos y educativos.", 
    categoria: "cultural", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 102, 
    fecha: "1961-09-05", 
    titulo: "Creación del Movimiento de Países No Alineados", 
    descripcion: "En la Conferencia de Belgrado, Colombia participa en la fundación del Movimiento de Países No Alineados (MNOAL) junto a 24 países, buscando neutralidad activa en la Guerra Fría. Aunque tradicionalmente aliado de EE.UU., Colombia bajo Alberto Lleras Camargo buscó diversificar relaciones internacionales. La participación, más simbólica que sustantiva, reflejó tensiones entre alineamiento occidental y aspiraciones tercermundistas. El MNOAL, que llegó a 120 miembros, representó alternativa para países en desarrollo frente a bipolaridad Este-Oeste, aunque Colombia mantendría estrechos vínculos con Occidente.", 
    categoria: "politico", 
    coordenadas: { lat: 44.7872, lng: 20.4573 }, 
    region: "Serbia", 
    importancia: "media" 
  },
  { 
    id: 103, 
    fecha: "1978-11-21", 
    titulo: "Colombia en el Consejo de Seguridad de la ONU", 
    descripcion: "Por primera vez en su historia, Colombia es elegida miembro no permanente del Consejo de Seguridad de la ONU para el periodo 1979-1980, obteniendo 156 votos en la Asamblea General. Durante su membresía, participó en debates sobre conflictos en Medio Oriente, África del Sur y Afganistán. La elección reflejó prestigio diplomático acumulado desde fundación de la ONU y activa participación en misiones de paz. Colombia ha servido en el Consejo en 7 ocasiones, mostrando compromiso con seguridad internacional aunque con tensiones entre principios y realpolitik.", 
    categoria: "politico", 
    coordenadas: { lat: 40.7490, lng: -73.9680 }, 
    region: "EE.UU.", 
    importancia: "media" 
  },
  { 
    id: 104, 
    fecha: "2018-06-12", 
    titulo: "Colombia en la Cumbre de Singapur", 
    descripcion: "El presidente Iván Duque asiste como observador a la histórica cumbre entre Donald Trump y Kim Jong-un en Singapur, siendo el único líder latinoamericano presente. La participación, simbólica, buscaba proyectar a Colombia como aliado confiable de EE.UU. y actor global responsable en no proliferación nuclear. Aunque sin rol activo en negociaciones, mostró la continuidad de la relación especial bilateral y aspiración colombiana a mayor protagonismo en escenarios multilaterales de alta visibilidad, en contraste con tradicional bajo perfil diplomático.", 
    categoria: "politico", 
    coordenadas: { lat: 1.3521, lng: 103.8198 }, 
    region: "Singapur", 
    importancia: "media" 
  },
  { 
    id: 105, 
    fecha: "2023-02-13", 
    titulo: "Primer diálogo de paz con el ELN en gobiernos", 
    descripcion: "En Caracas, el gobierno de Gustavo Petro y el Ejército de Liberación Nacional (ELN) reinician diálogos de paz suspendidos desde 2019, estableciendo agenda de 6 puntos que incluye participación sociedad civil y cese al fuego bilateral. Las negociaciones, mediadas por Venezuela, Cuba y Noruega, representaron el primer intento serio de paz con la última guerrilla activa significativa. Aunque con avances limitados y violaciones recurrentes del cese al fuego, mantuvieron esperanza de solución política integral al conflicto armado colombiano después del acuerdo con las FARC.", 
    categoria: "politico", 
    coordenadas: { lat: 23.1136, lng: -82.3666 }, 
    region: "Cuba", 
    importancia: "alta" 
  },
  { 
    id: 106, 
    fecha: "2023-08-07", 
    titulo: "Reformas estructurales de Petro", 
    descripcion: "En su primer año de gobierno, Gustavo Petro presenta al Congreso el paquete de reformas estructurales más ambicioso en décadas: reforma a la salud (unificar sistemas), pensiones (sistema público solidario), trabajo (reducir jornada) y tierras (reforma agraria integral). Las propuestas, basadas en su programa de 'Cambio', generaron intensos debates sobre financiamiento, viabilidad constitucional y modelos de desarrollo. Aunque enfrentaron resistencia empresarial y limitaciones de mayoría legislativa, redefinieron agenda pública hacia Estado de bienestar y justicia social tras décadas de políticas neoliberales.", 
    categoria: "politico", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  },
  { 
    id: 107, 
    fecha: "2024-03-10", 
    titulo: "Protestas por reforma a la salud", 
    descripcion: "Miles de médicos, trabajadores de salud y ciudadanos marchan en principales ciudades contra la reforma al sistema de salud propuesta por el gobierno Petro, que buscaba eliminar las EPS y centralizar administración en el Estado. Los manifestantes, encabezados por gremios médicos, alertaron sobre riesgos de colapso, politización y pérdida de calidad. Las protestas, mayormente pacíficas, reflejaron desconfianza en capacidad estatal para gestionar sistema complejo y defensa de logros de la Ley 100 de 1993. El debate evidenció polarización sobre modelo de salud deseable y desafíos de reforma sectorial profunda.", 
    categoria: "social", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "media" 
  },
  { 
    id: 108, 
    fecha: "2024-06-20", 
    titulo: "Informe final de la Comisión de la Verdad", 
    descripcion: "La Comisión para el Esclarecimiento de la Verdad, creada por el acuerdo de paz, presenta su informe final 'Hay futuro si hay verdad' tras 4 años de investigación con 30,000 testimonios. El documento de 800 páginas documenta causas y consecuencias del conflicto armado, responsabilidades de todos los actores, y recomendaciones para no repetición. Aunque alabado por profundidad y enfoque victimocéntrico, generó controversia por críticas a fuerzas militares y empresarios. Su publicación marcó hito en proceso de verdad histórica, aunque con recepción polarizada en sociedad aún dividida sobre memoria del conflicto.", 
    categoria: "social", 
    coordenadas: { lat: 4.5981, lng: -74.0758 }, 
    region: "Bogotá", 
    importancia: "alta" 
  }
];

const Mapas = () => {
 const [eventos] = useState(eventosHistoricos);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(eventosHistoricos[2]); 
  const [filtros, setFiltros] = useState({
    categoria: '',
    decada: '',
    periodo: ''
  });
  const [viewMode, setViewMode] = useState('street');
  const [modoViaje, setModoViaje] = useState(false);
  const [viajeIndex, setViajeIndex] = useState(0);
  const [viajeActivo, setViajeActivo] = useState(false);
  const [eventosViaje, setEventosViaje] = useState([]); 
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
        alert('¡Viaje temporal completado! Has recorrido todos los eventos con los filtros actuales.');
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
      <div className="mapas-header">
        <div className="header-content">
          <h1>
            <FaMap style={{ marginRight: '12px', verticalAlign: 'middle' }} />
            Mapa Histórico de Colombia
          </h1>
          <p className="subtitle">
            <FaMapMarkerAlt style={{ marginRight: '6px', verticalAlign: 'middle' }} />
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
              <FaMapMarkerAlt style={{ marginRight: '6px' }} />
              {eventosFiltrados.length} eventos
            </div>
          </div>
          
          <div className="controles-mapa">
            <div className="controles-viaje">
              <button 
                className={`control-btn ${modoViaje && viajeActivo ? 'active' : ''}`}
                onClick={viajeActivo ? pausarViaje : reanudarViaje}
                disabled={eventosViaje.length === 0}
              >
                {viajeActivo ? (
                  <>
                    <FaPause style={{ marginRight: '6px' }} />
                    Pausar Viaje
                  </>
                ) : (
                  <>
                    <FaPlay style={{ marginRight: '6px' }} />
                    Viaje Temporal
                  </>
                )}
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
                  {mode === 'satellite' ? (
                    <>
                      <FaSatellite style={{ marginRight: '6px' }} />
                      Satélite
                    </>
                  ) : (
                    <>
                      <FaMap style={{ marginRight: '6px' }} />
                      Calles
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mapas-content">
        <div className="mapa-principal">
          <div className="mapa-wrapper">
            {modoViaje && viajeActivo && (
              <div className="viaje-indicator">
                <div className="viaje-header">
                  <span className="viaje-titulo">
                    <FaFilm style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Viaje Temporal Activo
                  </span>
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
                    <MdSkipNext style={{ marginRight: '4px' }} />
                    Saltar
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
                          <FaFilm style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          En ruta de viaje temporal
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
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
                  <FaCalendarAlt className="meta-icon" />
                  <span className="meta-text">{formatearFecha(eventoSeleccionado.fecha)}</span>
                </div>
                <div className="meta-item">
                  <FaMapMarkerAlt className="meta-icon" />
                  <span className="meta-text">{eventoSeleccionado.region}</span>
                </div>
                <div className="meta-item">
                  <FaBullseye className="meta-icon" />
                  <span className="meta-text importancia-alta">
                    {eventoSeleccionado.importancia === 'alta' ? 'Alta importancia' : 'Importancia media'}
                  </span>
                </div>
              </div>
              
              <div className="evento-descripcion">
                <h3>
                  <FaBook style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Descripción Histórica
                </h3>
                <p>{eventoSeleccionado.descripcion}</p>
              </div>
              
              {modoViaje && viajeActivo && (
                <div className="evento-viaje-info">
                  <div className="viaje-indicador-activo">
                    <FaFilm className="viaje-emoji" />
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
                  <FaHeadphones style={{ marginRight: '6px' }} />
                  Iniciar Viaje desde aquí
                </button>
                <button 
                  className="accion-btn secundario"
                  onClick={() => {
                    if (viajeActivo) {
                      pausarViaje();
                    }
                  }}
                >
                  {viajeActivo ? (
                    <>
                      <FaPause style={{ marginRight: '6px' }} />
                      Pausar Viaje
                    </>
                  ) : (
                    <>
                      <FaPlay style={{ marginRight: '6px' }} />
                      Reanudar Viaje
                    </>
                  )}
                </button>
              </div>
              
              <div className="navegacion-eventos">
                <h4>
                  <MdList style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Eventos filtrados ({eventosFiltrados.length})
                </h4>
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
                          <FaFilm className="relacionado-en-viaje" />
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
                    <MdSkipPrevious style={{ marginRight: '4px' }} />
                    Anterior
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
                    Siguiente
                    <MdSkipNext style={{ marginLeft: '4px' }} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="lista-eventos">
              <h3>
                <FaBook style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Eventos Históricos
              </h3>
              <p className="instruccion">
                {eventosFiltrados.length > 0 
                  ? `Selecciona un evento (${eventosFiltrados.length} disponibles)` 
                  : 'No hay eventos con los filtros actuales'}
              </p>
              
              {modoViaje && viajeActivo && (
                <div className="lista-viaje-info">
                  <div className="viaje-lista-header">
                    <span className="viaje-lista-titulo">
                      <FaFilm style={{ marginRight: '6px' }} />
                      Viaje Temporal Activo
                    </span>
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
                          <FaFilm className="viaje-indicador" />
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
                  <p>
                    <FaExclamationTriangle style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    No se encontraron eventos con los filtros actuales
                  </p>
                  <button 
                    className="limpiar-filtros-btn"
                    onClick={() => setFiltros({ categoria: '', decada: '', periodo: '' })}
                  >
                    <FaRedo style={{ marginRight: '6px' }} />
                    Limpiar filtros
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