import React, { useState, useEffect } from 'react';
import { triviaAPI, userAPI } from '../services/api';
import {
  FaChartBar,
  FaBullseye,
  FaStar,
  FaFire,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaThumbsUp,
  FaBook,
  FaMedal,
  FaCrown,
  FaUsers,
  FaAward,
  FaRegClock,
  FaLock,
  FaCalendarAlt
} from 'react-icons/fa';
import {
  MdTrendingUp,
  MdSchedule,
  MdEmojiEvents,
  MdLeaderboard,
  MdTimer,
  MdGroup
} from 'react-icons/md';
import './Dashboard.css';

const Dashboard = ({ usuario }) => {
  const [historial, setHistorial] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [torneoActivo, setTorneoActivo] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [misTorneos, setMisTorneos] = useState([]);
  const [torneoStats, setTorneoStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTorneos, setLoadingTorneos] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      const [historialData, profile] = await Promise.all([
        triviaAPI.getHistorial(),
        userAPI.getProfile()
      ]);
      setHistorial(historialData);
      setEstadisticas(profile.estadisticas);
      
      // Cargar datos de torneos si hay usuario
      if (usuario) {
        await cargarDatosTorneos();
      }
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarDatosTorneos = async () => {
    try {
      setLoadingTorneos(true);
      
      // Cargar torneo activo
      const torneosActivos = await triviaAPI.getTorneos({ estado: 'activo' });
      if (torneosActivos.length > 0 && usuario) {
        const torneoUsuario = torneosActivos.find(t => 
          t.participantes && t.participantes.some(p => p.usuarioId === usuario.id)
        );
        
        if (torneoUsuario) {
          setTorneoActivo(torneoUsuario);
          // Cargar leaderboard del torneo activo
          const leaderboardData = await triviaAPI.getLeaderboard(torneoUsuario._id);
          setLeaderboard(leaderboardData);
        }
      }
      
      // Cargar historial de torneos del usuario
      if (usuario) {
        const historialTorneos = await triviaAPI.getMisTorneos(usuario.id);
        setMisTorneos(historialTorneos || []);
      }
      
      // Calcular estadísticas de torneos
      calcularEstadisticasTorneos();
      
    } catch (error) {
      console.error('Error al cargar datos de torneos:', error);
    } finally {
      setLoadingTorneos(false);
    }
  };

  const calcularEstadisticasTorneos = () => {
    if (misTorneos.length === 0) {
      setTorneoStats({
        totalTorneos: 0,
        torneosGanados: 0,
        mejorPosicion: null,
        promedioPosicion: null,
        puntosTotalesTorneos: 0,
        rachaVictorias: 0,
        podios: 0
      });
      return;
    }

    const stats = {
      totalTorneos: misTorneos.length,
      torneosGanados: misTorneos.filter(t => t.posicion === 1).length,
      mejorPosicion: Math.min(...misTorneos.map(t => t.posicion || 999)),
      promedioPosicion: Math.round(
        misTorneos.reduce((sum, t) => sum + (t.posicion || 999), 0) / misTorneos.length
      ),
      puntosTotalesTorneos: misTorneos.reduce((sum, t) => sum + (t.puntuacion || 0), 0),
      rachaVictorias: calcularRachaVictorias(misTorneos),
      podios: misTorneos.filter(t => t.posicion && t.posicion <= 3).length
    };

    setTorneoStats(stats);
  };

  const calcularRachaVictorias = (torneos) => {
    if (!torneos || torneos.length === 0) return 0;
    
    // Ordenar por fecha descendente
    const torneosOrdenados = [...torneos].sort((a, b) => 
      new Date(b.fecha) - new Date(a.fecha)
    );
    
    let racha = 0;
    for (let torneo of torneosOrdenados) {
      if (torneo.posicion === 1) {
        racha++;
      } else {
        break;
      }
    }
    return racha;
  };

  const formatearTiempoRestante = (fechaFin) => {
    if (!fechaFin) return 'Sin fecha';
    
    const fin = new Date(fechaFin);
    const ahora = new Date();
    const diferencia = fin - ahora;
    
    if (diferencia <= 0) return 'Finalizado';
    
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    
    if (horas > 24) {
      const dias = Math.floor(horas / 24);
      return `${dias}d ${horas % 24}h`;
    }
    
    return `${horas}h ${minutos}m`;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        {showIntro && (
          <div className="intro-content">
            <h1 className="intro-title">MEMORIA HISTÓRICA DE COLOMBIA</h1>
            <div className="intro-subtitle">
            </div>

            <div className="creative-loader globe-loader">
              <div className="loader-circle">
                <div className="loader-orbit">
                  <div className="orbit-dot"></div>
                </div>
                <div className="loader-core">
                  <div className="core-pulse"></div>
                </div>
                <div className="loader-connections">
                  <div className="connection"></div>
                  <div className="connection"></div>
                  <div className="connection"></div>
                  <div className="connection"></div>
                </div>
                <div className="latitude-line"></div>
                <div className="longitude-line"></div>
              </div>
              <div className="loader-text">
                <span className="text-char">C</span>
                <span className="text-char">A</span>
                <span className="text-char">R</span>
                <span className="text-char">G</span>
                <span className="text-char">A</span>
                <span className="text-char">N</span>
                <span className="text-char">D</span>
                <span className="text-char">O</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const promedioAcierto = historial.length > 0
    ? Math.round(historial.reduce((sum, h) => sum + h.porcentajeAcierto, 0) / historial.length)
    : 0;

  const totalPuntos = historial.reduce((sum, h) => sum + h.puntosTotales, 0);

  return (
    <div className="dashboard-container">
      <div className="dashboard-top-section">
        <div className="dashboard-header">
          <h1>
            <FaChartBar style={{ marginRight: '12px', verticalAlign: 'middle' }} />
            Mi Dashboard
          </h1>
          <p>Resumen de tu progreso y estadísticas</p>
        </div>

        <div className="stats-summary">
          <div className="summary-card-dash">
            <div className="summary-icon">
              <FaBullseye style={{ fontSize: '2em', color: 'white' }} />
            </div>
            <div className="summary-info">
              <span className="summary-value">{estadisticas.triviasCompletadas}</span>
              <span className="summary-label">Trivias Completadas</span>
            </div>
          </div>

          <div className="summary-card-dash">
            <div className="summary-icon">
              <MdTrendingUp style={{ fontSize: '2em', color: 'white' }} />
            </div>
            <div className="summary-info">
              <span className="summary-value">{promedioAcierto}%</span>
              <span className="summary-label">Promedio de Acierto</span>
            </div>
          </div>

          <div className="summary-card-dash">
            <div className="summary-icon">
              <FaStar style={{ fontSize: '2em', color: 'white' }} />
            </div>
            <div className="summary-info">
              <span className="summary-value">{totalPuntos}</span>
              <span className="summary-label">Puntos Totales</span>
            </div>
          </div>

          <div className="summary-card-dash">
            <div className="summary-icon">
              <FaFire style={{ fontSize: '2em', color: 'white' }} />
            </div>
            <div className="summary-info">
              <span className="summary-value">{estadisticas.racha || 0}</span>
              <span className="summary-label">Racha Actual</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Torneos Activos */}
      {torneoActivo && (
        <div className="torneo-activo-section">
          <div className="section-header">
            <h3>
              <FaTrophy style={{ marginRight: '8px', verticalAlign: 'middle', color: '#FFD700' }} />
              Torneo Activo
            </h3>
            <span className="torneo-tiempo-restante">
              <FaRegClock style={{ marginRight: '5px' }} />
              {formatearTiempoRestante(torneoActivo.fechaFin)}
            </span>
          </div>
          
          <div className="torneo-activo-card-dash">
            <div className="torneo-info-dash">
              <div className="torneo-nombre">
                <h4>{torneoActivo.nombre}</h4>
                <span className="torneo-tipo">
                  {torneoActivo.tipo === 'tiempo' ? 'Contra reloj' : 'Por puntos'}
                </span>
              </div>
              
              <div className="torneo-stats-dash">
                <div className="torneo-stat">
                  <FaUsers style={{ marginRight: '5px', color: '#667eea' }} />
                  <span>{torneoActivo.participantesActuales || 0} / {torneoActivo.maxParticipantes || 0}</span>
                </div>
                <div className="torneo-stat">
                  <FaMedal style={{ marginRight: '5px', color: '#FFD700' }} />
                  <span>
                    {leaderboard.findIndex(p => p.usuarioId === usuario?.id) + 1 || '?'}° Posición
                  </span>
                </div>
                {torneoActivo.creadorNombre && (
                  <div className="torneo-stat">
                    <FaCrown style={{ marginRight: '5px', color: '#FF6B35' }} />
                    <span>Creador: {torneoActivo.creadorNombre}</span>
                  </div>
                )}
              </div>
              
              {torneoActivo.descripcion && (
                <p className="torneo-descripcion-dash">{torneoActivo.descripcion}</p>
              )}
              
              <div className="torneo-premios-dash">
                {torneoActivo.premios && torneoActivo.premios.length > 0 && (
                  <>
                    <FaAward style={{ marginRight: '8px', color: '#FFD700' }} />
                    <span>Premios: </span>
                    {torneoActivo.premios.slice(0, 3).map((premio, idx) => (
                      <span key={idx} className="premio-item-dash">
                        {premio.posicion}°: {premio.premio}
                      </span>
                    ))}
                  </>
                )}
              </div>
            </div>
            
            <div className="torneo-leaderboard-dash">
              <h5>
                <MdLeaderboard style={{ marginRight: '8px' }} />
                Top 3 del Torneo
              </h5>
              <div className="leaderboard-mini">
                {leaderboard.slice(0, 3).map((jugador, index) => (
                  <div key={index} className={`leaderboard-row-mini ${jugador.usuarioId === usuario?.id ? 'usuario-actual' : ''}`}>
                    <div className="leaderboard-posicion-mini">
                      {index === 0 ? <FaMedal className="medal-1" /> :
                       index === 1 ? <FaMedal className="medal-2" /> :
                       index === 2 ? <FaMedal className="medal-3" /> : <span>#{index + 1}</span>}
                    </div>
                    <div className="leaderboard-nombre-mini">
                      {jugador.nombre || `Jugador ${index + 1}`}
                    </div>
                    <div className="leaderboard-puntos-mini">
                      {jugador.puntuacion || 0} pts
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="chart-card">
          <h3>
            <FaChartBar style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Progreso Reciente
          </h3>
          <div className="chart-container">
            {historial.slice(0, 10).reverse().map((item, idx) => (
              <div key={item._id} className="bar-container">
                <div
                  className="bar"
                  style={{
                    height: `${item.porcentajeAcierto}%`,
                    backgroundColor: item.porcentajeAcierto >= 80 ? '#28a745' :
                      item.porcentajeAcierto >= 60 ? '#ffc107' : '#dc3545'
                  }}
                >
                  <span className="bar-value">{item.porcentajeAcierto}%</span>
                </div>
                <span className="bar-label">#{historial.length - idx}</span>
              </div>
            ))}
          </div>
          {historial.length === 0 && (
            <p className="no-data">
              Completa tu primera trivia para ver tu progreso aquí
            </p>
          )}
        </div>

        <div className="stats-detailed-card">
          <h3>
            <MdTrendingUp style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Estadísticas Detalladas
          </h3>
          <div className="detailed-stats">
            <div className="detailed-stat">
              <span className="stat-label">Total de Respuestas</span>
              <span className="stat-value">
                {estadisticas.respuestasCorrectas + estadisticas.respuestasIncorrectas}
              </span>
            </div>

            <div className="detailed-stat success">
              <span className="stat-label">
                <FaCheckCircle style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Correctas
              </span>
              <span className="stat-value">{estadisticas.respuestasCorrectas}</span>
            </div>

            <div className="detailed-stat error">
              <span className="stat-label">
                <FaTimesCircle style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Incorrectas
              </span>
              <span className="stat-value">{estadisticas.respuestasIncorrectas}</span>
            </div>

            <div className="detailed-stat">
              <span className="stat-label">Tasa de Éxito Global</span>
              <span className="stat-value">
                {estadisticas.respuestasCorrectas > 0
                  ? Math.round(
                    (estadisticas.respuestasCorrectas /
                      (estadisticas.respuestasCorrectas + estadisticas.respuestasIncorrectas)) *
                    100
                  )
                  : 0}%
              </span>
            </div>

            <div className="detailed-stat">
              <span className="stat-label">Mejor Resultado</span>
              <span className="stat-value">{estadisticas.mejorPorcentaje || 0}%</span>
            </div>

            <div className="detailed-stat">
              <span className="stat-label">Peor Resultado</span>
              <span className="stat-value">
                {historial.length > 0
                  ? Math.min(...historial.map(h => h.porcentajeAcierto))
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Estadísticas de Torneos */}
        {torneoStats && torneoStats.totalTorneos > 0 && (
          <div className="torneo-stats-card">
            <h3>
              <MdEmojiEvents style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Estadísticas de Torneos
            </h3>
            <div className="torneo-stats-detailed">
              <div className="torneo-stat-item destacado">
                <span className="stat-label-torneo">Torneos Jugados</span>
                <span className="stat-value-torneo">{torneoStats.totalTorneos}</span>
              </div>
              
              <div className="torneo-stat-item">
                <span className="stat-label-torneo">Victorias</span>
                <span className="stat-value-torneo">{torneoStats.torneosGanados}</span>
              </div>
              
              <div className="torneo-stat-item">
                <span className="stat-label-torneo">Podios (Top 3)</span>
                <span className="stat-value-torneo">{torneoStats.podios}</span>
              </div>
              
              <div className="torneo-stat-item">
                <span className="stat-label-torneo">Mejor Posición</span>
                <span className="stat-value-torneo">
                  {torneoStats.mejorPosicion === 1 ? (
                    <FaCrown style={{ color: '#FFD700', fontSize: '1.2em' }} />
                  ) : (
                    `#${torneoStats.mejorPosicion}`
                  )}
                </span>
              </div>
              
              <div className="torneo-stat-item">
                <span className="stat-label-torneo">Posición Promedio</span>
                <span className="stat-value-torneo">#{torneoStats.promedioPosicion}</span>
              </div>
              
              <div className="torneo-stat-item">
                <span className="stat-label-torneo">Puntos en Torneos</span>
                <span className="stat-value-torneo">{torneoStats.puntosTotalesTorneos}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Historial Reciente de Torneos */}
      {misTorneos.length > 0 && (
        <div className="torneo-history-section">
          <h3>
            <FaCalendarAlt style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Historial de Torneos
          </h3>
          <div className="torneo-history-table">
            <div className="torneo-history-header">
              <span>Torneo</span>
              <span>Fecha</span>
              <span>Posición</span>
              <span>Puntos</span>
              <span>Premios</span>
            </div>
            {misTorneos.slice(0, 5).map((torneo, index) => (
              <div key={index} className="torneo-history-row">
                <span className="torneo-history-nombre">
                  {torneo.torneoNombre || `Torneo ${index + 1}`}
                </span>
                <span className="torneo-history-fecha">
                  {formatearFecha(torneo.fecha)}
                </span>
                <span className={`torneo-history-posicion posicion-${torneo.posicion}`}>
                  {torneo.posicion === 1 ? (
                    <><FaCrown style={{ marginRight: '4px' }} /> 1°</>
                  ) : torneo.posicion === 2 ? (
                    <><FaMedal style={{ marginRight: '4px', color: '#C0C0C0' }} /> 2°</>
                  ) : torneo.posicion === 3 ? (
                    <><FaMedal style={{ marginRight: '4px', color: '#CD7F32' }} /> 3°</>
                  ) : (
                    `#${torneo.posicion}`
                  )}
                </span>
                <span className="torneo-history-puntos">
                  {torneo.puntuacion || 0} pts
                </span>
                <span className="torneo-history-premios">
                  {torneo.premios && torneo.premios.length > 0 ? (
                    <FaAward style={{ color: '#FFD700' }} />
                  ) : (
                    '-'
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="recent-history">
        <h3>
          <MdSchedule style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Historial Reciente (Últimas 10 trivias)
        </h3>
        <div className="history-table">
          <div className="history-header">
            <span>#</span>
            <span>Fecha</span>
            <span>Precisión</span>
            <span>Puntos</span>
            <span>Preguntas</span>
            <span>Estado</span>
          </div>
          {historial.slice(0, 10).map((item, idx) => (
            <div key={item._id} className="history-row">
              <span className="history-number">{historial.length - idx}</span>
              <span className="history-date">{formatearFecha(item.fecha)}</span>
              <span className={`history-percentage ${item.porcentajeAcierto >= 80 ? 'excelente' :
                item.porcentajeAcierto >= 60 ? 'bueno' : 'regular'
                }`}>
                {item.porcentajeAcierto}%
              </span>
              <span className="history-points">+{item.puntosTotales}</span>
              <span className="history-questions">{item.preguntasRespondidas.length}</span>
              <span className={`history-status ${item.porcentajeAcierto >= 80 ? 'excelente' :
                item.porcentajeAcierto >= 60 ? 'bueno' : 'regular'
                }`}>
                {item.porcentajeAcierto >= 80 ? (
                  <>
                    <FaTrophy style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    Excelente
                  </>
                ) : item.porcentajeAcierto >= 60 ? (
                  <>
                    <FaThumbsUp style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    Bien
                  </>
                ) : (
                  <>
                    <FaBook style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    Mejorable
                  </>
                )}
              </span>
            </div>
          ))}
          {historial.length === 0 && (
            <p className="no-history">
              No has completado ninguna trivia aún. ¡Empieza ahora!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;