import React, { useState, useEffect } from 'react';
import { triviaAPI, userAPI } from '../services/api';
import './Profile.css';
import {
  FaUser,
  FaTrophy,
  FaStar,
  FaBullseye,
  FaEdit,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaFire,
  FaClock,
  FaChartLine,
  FaMedal,
  FaScroll,
  FaCrown,
  FaUsers,
  FaAward,
  FaRegClock,
  FaCalendarAlt,
  FaChevronRight,
  FaCaretUp,
  FaCaretDown
} from 'react-icons/fa';
import {
  MdTrendingUp,
  MdBarChart,
  MdEmojiEvents,
  MdLeaderboard,
  MdTimer
} from 'react-icons/md';

const Profile = ({ usuario, onUpdate }) => {
  const [profile, setProfile] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [torneoActivo, setTorneoActivo] = useState(null);
  const [torneoStats, setTorneoStats] = useState(null);
  const [misTorneos, setMisTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTorneos, setLoadingTorneos] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', avatar: '' });
  const [vistaActual, setVistaActual] = useState('estadisticas');
  const [showIntro, setShowIntro] = useState(true);
  const [avatarGradient, setAvatarGradient] = useState('');

  const generarGradienteAleatorio = () => {
    const colores = [
      ['#FF3D00', '#FF6B6B'],
      ['#D50000', '#4A00E0'],
      ['#304FFE', '#FF9E00'],
      ['#C51162', '#000000ff'],
      ['#6200EA', '#00B4D8'],
      ['#00C853', '#FF005C'],
      ['#FF9100', '#2E7D32'],
      ['#7c1900ff', '#0044ffff'],
      ['#5D4037', '#9C27B0'],
    ];
    const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
    return `linear-gradient(135deg, ${colorAleatorio[0]}, ${colorAleatorio[1]})`;
  };

  useEffect(() => {
    loadProfileData();
    setAvatarGradient(generarGradienteAleatorio());
  }, []);

  const loadProfileData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const [profileData, rankingData, historialData] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getRanking(),
        triviaAPI.getHistorial()
      ]);
      setProfile(profileData);
      setRanking(rankingData);
      setHistorial(historialData);
      setFormData({
        nombre: profileData.nombre,
        avatar: profileData.avatar || ''
      });

      // Cargar datos de torneos
      if (usuario) {
        await cargarDatosTorneos();
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
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
    if (!misTorneos || misTorneos.length === 0) {
      setTorneoStats({
        totalTorneos: 0,
        torneosGanados: 0,
        mejorPosicion: null,
        promedioPosicion: null,
        puntosTotalesTorneos: 0,
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
      podios: misTorneos.filter(t => t.posicion && t.posicion <= 3).length
    };

    setTorneoStats(stats);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearFechaCorta = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short'
    });
  };

  const calcularTiempoRestante = (fechaFin) => {
    if (!fechaFin) return 'Sin fecha';
    
    const fin = new Date(fechaFin);
    const ahora = new Date();
    const diferencia = fin - ahora;
    
    if (diferencia <= 0) return 'Finalizado';
    
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    
    if (horas > 24) {
      const dias = Math.floor(horas / 24);
      return `${dias}d`;
    }
    
    return `${horas}h ${minutos}m`;
  };

  const getMedallaIcono = (tipo) => {
    const iconos = {
      nivel: <FaStar style={{ color: '#FFD700' }} />,
      perfeccion: <FaCheckCircle style={{ color: '#10B981' }} />,
      experto: <FaTrophy style={{ color: '#F59E0B' }} />,
      perseverante: <FaFire style={{ color: '#EF4444' }} />,
      maestro: <FaMedal style={{ color: '#8B5CF6' }} />,
      racha: <FaFire style={{ color: '#F97316' }} />,
      torneo: <FaCrown style={{ color: '#FFD700' }} />,
      podio: <FaAward style={{ color: '#C0C0C0' }} />
    };
    return iconos[tipo.split('_')[0]] || <FaMedal style={{ color: '#6B7280' }} />;
  };

  const getColorPorcentaje = (porcentaje) => {
    if (porcentaje >= 90) return '#10b981';
    if (porcentaje >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const obtenerIniciales = (nombre) => {
    if (!nombre) return 'U';
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return nombre[0].toUpperCase();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await userAPI.updateProfile(formData);
      setProfile(updated);
      setEditMode(false);
      onUpdate(updated);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  };

  if (loading || !profile) {
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

  const userRank = ranking.findIndex(u => u._id === profile._id) + 1;
  const progresoPuntos = profile.puntos % 1000;
  const totalParaNivel = 1000;
  const porcentajeProgreso = (progresoPuntos / totalParaNivel) * 100;

  return (
    <div className="profile-compact">
      <div className="profile-header-compact">
        <h1 className="profile-title">
          <FaUser style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Mi Perfil
        </h1>
        <div className="header-stats">
          <div className="header-stat">
            <FaTrophy className="stat-icon" />
            <span className="stat-text">Rank #{userRank}</span>
          </div>
          <div className="header-stat">
            <FaStar className="stat-icon" />
            <span className="stat-text">Nivel {profile.nivel}</span>
          </div>
          <div className="header-stat">
            <FaBullseye className="stat-icon" />
            <span className="stat-text">{profile.puntos} pts</span>
          </div>
        </div>
      </div>

      <div className="profile-layout">
        <div className="profile-left">
          <div className="user-card-compact">
            <div className="user-header">
              <div className="avatar-container">
                {profile.avatar = (
                  <div
                    className="avatar-circle-gradient avatar-circle-gradient1"
                    style={{ background: avatarGradient }}
                    onClick={() => setAvatarGradient(generarGradienteAleatorio())}
                  >
                    <span className="avatar-initials">
                      {obtenerIniciales(profile.nombre)}
                    </span>
                  </div>
                )}
                <div className="level-badge-compact">
                  <span className="level-number">{profile.nivel}</span>
                </div>
              </div>

              {!editMode ? (
                <div className="user-info">
                  <h2 className="user-name">{profile.nombre}</h2>
                  <p className="user-email">{profile.email}</p>
                  <button
                    className="edit-profile-btn"
                    onClick={() => setEditMode(true)}
                  >
                    <FaEdit className="edit-icon" />
                    Editar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdate} className="edit-form-compact">
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Nombre"
                    className="edit-input"
                  />
                  <div className="edit-actions">
                    <button type="submit" className="save-btn-compact">
                      <FaSave style={{ marginRight: '4px' }} />
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="cancel-btn-compact"
                      onClick={() => setEditMode(false)}
                    >
                      <FaTimes style={{ marginRight: '4px' }} />
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="progress-compact">
              <div className="progress-info">
                <span className="progress-label">Progreso al Nivel {profile.nivel + 1}</span>
                <span className="progress-numbers">{progresoPuntos}/{totalParaNivel}</span>
              </div>
              <div className="progress-bar-compact">
                <div
                  className="progress-fill-compact"
                  style={{ width: `${porcentajeProgreso}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sección compacta de torneo activo */}
          {torneoActivo && (
            <div className="torneo-activo-compact">
              <div className="torneo-activo-header-compact">
                <h4>
                  <FaCrown style={{ marginRight: '8px', color: '#FFD700' }} />
                  Torneo Activo
                </h4>
                <span className="torneo-tiempo-compact">
                  <FaRegClock style={{ marginRight: '4px', fontSize: '0.8em' }} />
                  {calcularTiempoRestante(torneoActivo.fechaFin)}
                </span>
              </div>
              
              <div className="torneo-info-compact">
                <div className="torneo-nombre-compact">
                  {torneoActivo.nombre}
                </div>
                
                <div className="torneo-stats-compact">
                  <div className="torneo-stat-compact">
                    <FaUsers style={{ fontSize: '0.8em', color: '#667eea' }} />
                    <span>{torneoActivo.participantesActuales || 0}</span>
                  </div>
                  
                  <div className="torneo-stat-compact">
                    <MdTimer style={{ fontSize: '0.8em', color: '#f59e0b' }} />
                    <span>{torneoActivo.tipo === 'tiempo' ? 'Contra reloj' : 'Puntos'}</span>
                  </div>
                </div>
                
                {torneoActivo.descripcion && (
                  <div className="torneo-desc-compact">
                    {torneoActivo.descripcion.substring(0, 60)}...
                  </div>
                )}
                
                <button className="btn-ver-torneo-compact">
                  <FaChevronRight style={{ fontSize: '0.9em' }} />
                  Ver torneo
                </button>
              </div>
            </div>
          )}

          <div className="tabs-compact">
            <button
              className={`tab-btn ${vistaActual === 'estadisticas' ? 'active' : ''}`}
              onClick={() => setVistaActual('estadisticas')}
            >
              <MdBarChart className="tab-icon" />
              <span className="tab-text">Estadísticas</span>
            </button>
            <button
              className={`tab-btn ${vistaActual === 'torneos' ? 'active' : ''}`}
              onClick={() => setVistaActual('torneos')}
            >
              <MdEmojiEvents className="tab-icon" />
              <span className="tab-text">Torneos</span>
              {torneoStats && torneoStats.totalTorneos > 0 && (
                <span className="tab-badge">{torneoStats.totalTorneos}</span>
              )}
            </button>
            <button
              className={`tab-btn ${vistaActual === 'medallas' ? 'active' : ''}`}
              onClick={() => setVistaActual('medallas')}
            >
              <FaTrophy className="tab-icon" />
              <span className="tab-text">Medallas</span>
              <span className="tab-badge">{profile.medallas.length}</span>
            </button>
            <button
              className={`tab-btn ${vistaActual === 'historial' ? 'active' : ''}`}
              onClick={() => setVistaActual('historial')}
            >
              <FaScroll className="tab-icon" />
              <span className="tab-text">Historial</span>
              <span className="tab-badge">{historial.length}</span>
            </button>
          </div>

          <div className="tab-content">
            {vistaActual === 'estadisticas' && (
              <div className="stats-compact">
                <div className="stats-grid-compact">
                  <div className="stat-card">
                    <FaBullseye className="stat-card-icon" />
                    <div className="stat-card-content">
                      <div className="stat-card-value">{profile.estadisticas.triviasCompletadas}</div>
                      <div className="stat-card-label">Trivias</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <FaCheckCircle className="stat-card-icon" />
                    <div className="stat-card-content">
                      <div className="stat-card-value">{profile.estadisticas.respuestasCorrectas}</div>
                      <div className="stat-card-label">Correctas</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <MdTrendingUp className="stat-card-icon" />
                    <div className="stat-card-content">
                      <div className="stat-card-value" style={{
                        color: getColorPorcentaje(
                          profile.estadisticas.respuestasCorrectas > 0
                            ? Math.round(
                              (profile.estadisticas.respuestasCorrectas /
                                (profile.estadisticas.respuestasCorrectas +
                                  profile.estadisticas.respuestasIncorrectas)) *
                              100
                            )
                            : 0
                        )
                      }}>
                        {profile.estadisticas.respuestasCorrectas > 0
                          ? Math.round(
                            (profile.estadisticas.respuestasCorrectas /
                              (profile.estadisticas.respuestasCorrectas +
                                profile.estadisticas.respuestasIncorrectas)) *
                            100
                          )
                          : 0}%
                      </div>
                      <div className="stat-card-label">Acierto</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <FaFire className="stat-card-icon" />
                    <div className="stat-card-content">
                      <div className="stat-card-value">{profile.estadisticas.racha || 0}</div>
                      <div className="stat-card-label">Racha</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <FaCheckCircle className="stat-card-icon" style={{ fontSize: '2em' }} />
                    <div className="stat-card-content">
                      <div className="stat-card-value" style={{ color: getColorPorcentaje(profile.estadisticas.mejorPorcentaje || 0) }}>
                        {profile.estadisticas.mejorPorcentaje || 0}%
                      </div>
                      <div className="stat-card-label">Mejor</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <FaClock className="stat-card-icon" />
                    <div className="stat-card-content">
                      <div className="stat-card-value">{profile.estadisticas.respuestasIncorrectas}</div>
                      <div className="stat-card-label">Fallos</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {vistaActual === 'torneos' && (
              <div className="torneos-compact">
                {loadingTorneos ? (
                  <div className="loading-torneos">
                    <FaTrophy className="spinning" style={{ fontSize: '2em', color: '#667eea' }} />
                    <p>Cargando torneos...</p>
                  </div>
                ) : (
                  <>
                    {torneoStats && torneoStats.totalTorneos > 0 ? (
                      <>
                        {/* Estadísticas de Torneos */}
                        <div className="torneo-stats-grid-compact">
                          <div className="torneo-stat-card destacado">
                            <div className="torneo-stat-content">
                              <FaTrophy className="torneo-stat-icon" style={{ color: '#FFD700' }} />
                              <div>
                                <div className="torneo-stat-value">{torneoStats.totalTorneos}</div>
                                <div className="torneo-stat-label">Torneos</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="torneo-stat-card">
                            <div className="torneo-stat-content">
                              <FaCrown className="torneo-stat-icon" style={{ color: '#FFD700' }} />
                              <div>
                                <div className="torneo-stat-value">{torneoStats.torneosGanados}</div>
                                <div className="torneo-stat-label">Victorias</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="torneo-stat-card">
                            <div className="torneo-stat-content">
                              <FaMedal className="torneo-stat-icon" style={{ color: '#C0C0C0' }} />
                              <div>
                                <div className="torneo-stat-value">{torneoStats.podios}</div>
                                <div className="torneo-stat-label">Podios</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="torneo-stat-card">
                            <div className="torneo-stat-content">
                              <FaAward className="torneo-stat-icon" style={{ color: '#f59e0b' }} />
                              <div>
                                <div className="torneo-stat-value">{torneoStats.promedioPosicion}°</div>
                                <div className="torneo-stat-label">Promedio</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Historial reciente de torneos */}
                        <div className="historial-torneos-compact">
                          <h5 className="historial-torneos-title">
                            <FaCalendarAlt style={{ marginRight: '6px' }} />
                            Últimos Torneos
                          </h5>
                          
                          <div className="historial-torneos-list">
                            {misTorneos.slice(0, 3).map((torneo, index) => (
                              <div key={index} className="historial-torneo-item">
                                <div className="torneo-item-header">
                                  <span className="torneo-item-nombre">
                                    {torneo.torneoNombre || `Torneo ${index + 1}`}
                                  </span>
                                  <span className={`torneo-item-posicion posicion-${torneo.posicion}`}>
                                    {torneo.posicion === 1 ? (
                                      <><FaCrown style={{ marginRight: '2px', fontSize: '0.8em' }} /> 1°</>
                                    ) : torneo.posicion === 2 ? (
                                      <><FaMedal style={{ marginRight: '2px', fontSize: '0.8em', color: '#C0C0C0' }} /> 2°</>
                                    ) : torneo.posicion === 3 ? (
                                      <><FaMedal style={{ marginRight: '2px', fontSize: '0.8em', color: '#CD7F32' }} /> 3°</>
                                    ) : (
                                      `#${torneo.posicion}`
                                    )}
                                  </span>
                                </div>
                                
                                <div className="torneo-item-info">
                                  <span className="torneo-item-fecha">
                                    {formatearFechaCorta(torneo.fecha)}
                                  </span>
                                  <span className="torneo-item-puntos">
                                    {torneo.puntuacion || 0} pts
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {misTorneos.length > 3 && (
                            <button className="btn-ver-mas-torneos">
                              Ver todos los torneos ({misTorneos.length})
                              <FaChevronRight style={{ marginLeft: '4px', fontSize: '0.8em' }} />
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="empty-state-torneos">
                        <MdEmojiEvents style={{ fontSize: '3em', color: '#cbd5e1', marginBottom: '10px' }} />
                        <p className="empty-text">Aún no has participado en torneos</p>
                        <p className="empty-subtext">¡Únete a un torneo y compite!</p>
                        <button className="btn-unirse-torneo">
                          <FaTrophy style={{ marginRight: '6px' }} />
                          Ver Torneos Disponibles
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {vistaActual === 'medallas' && (
              <div className="medals-compact">
                {profile.medallas.length > 0 ? (
                  <div className="medals-grid-compact">
                    {profile.medallas.map((medalla, idx) => (
                      <div key={idx} className="medal-card">
                        <div className="medal-icon-card">
                          {getMedallaIcono(medalla.tipo)}
                        </div>
                        <div className="medal-info">
                          <div className="medal-name">{medalla.nombre || medalla.tipo}</div>
                          <div className="medal-date">
                            {new Date(medalla.fecha).toLocaleDateString('es-CO', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <FaTrophy className="empty-icon" style={{ fontSize: '3em', color: '#cbd5e1' }} />
                    <p className="empty-text">Aún no tienes medallas</p>
                    <p className="empty-subtext">¡Completa trivias para ganarlas!</p>
                  </div>
                )}
              </div>
            )}

            {vistaActual === 'historial' && (
              <div className="history-compact">
                {historial.length > 0 ? (
                  <div className="history-list-compact">
                    {historial.map((item, idx) => (
                      <div key={item._id} className="history-item-compact">
                        <div className="history-item-header">
                          <span className="history-item-number">#{idx + 1}</span>
                          <span className="history-item-date">{formatearFecha(item.fecha)}</span>
                        </div>
                        <div className="history-item-stats">
                          <div className="history-stat">
                            <span className="history-stat-label">Precisión</span>
                            <span
                              className="history-stat-value"
                              style={{ color: getColorPorcentaje(item.porcentajeAcierto) }}
                            >
                              {item.porcentajeAcierto}%
                            </span>
                          </div>
                          <div className="history-stat">
                            <span className="history-stat-label">Puntos</span>
                            <span className="history-stat-value">{item.puntosTotales}</span>
                          </div>
                          <div className="history-stat">
                            <span className="history-stat-label">Preguntas</span>
                            <span className="history-stat-value">{item.preguntasRespondidas?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <FaScroll className="empty-icon" style={{ fontSize: '3em', color: '#cbd5e1' }} />
                    <p className="empty-text">Aún no tienes historial</p>
                    <p className="empty-subtext">¡Empieza a jugar ahora!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="profile-right">
          <div className="ranking-card-compact">
            <div className="ranking-header">
              <h3 className="ranking-title">
                <FaTrophy style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Top 10 Ranking
              </h3>
              <div className="ranking-user-position">
                <span className="position-label">Tu posición:</span>
                <span className="position-value">#{userRank}</span>
              </div>
            </div>

            <div className="ranking-list-compact">
              {ranking.slice(0, 10).map((user, idx) => (
                <div
                  key={user._id}
                  className={`ranking-item-compact ${user._id === profile._id ? 'current' : ''}`}
                >
                  <div className="rank-position">
                    <span className={`rank-number ${idx < 3 ? 'top-rank' : ''}`}>
                      {idx + 1}
                    </span>
                  </div>

                  <div className="rank-user">
                    <div className="avatar-circle-gradient" style={{ background: avatarGradient }}>
                      <span className="avatar-initials">
                        {obtenerIniciales(user.nombre)}
                      </span>
                    </div>
                    <div className="rank-info">
                      <span className="rank-name">{user.nombre}</span>
                      <span className="rank-level">Nv.{user.nivel}</span>
                    </div>
                  </div>

                  <div className="rank-points">
                    <span className="points-value">{user.puntos}</span>
                    <span className="points-label">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjeta de logros en torneos */}
          {torneoStats && torneoStats.torneosGanados > 0 && (
            <div className="torneo-logros-card">
              <div className="torneo-logros-header">
                <h4 className="torneo-logros-title">
                  <FaCrown style={{ marginRight: '8px', color: '#FFD700' }} />
                  Logros en Torneos
                </h4>
              </div>
              
              <div className="torneo-logros-list">
                {torneoStats.mejorPosicion === 1 && (
                  <div className="torneo-logro-item destacado">
                    <div className="logro-icon">
                      <FaCrown style={{ color: '#FFD700', fontSize: '1.2em' }} />
                    </div>
                    <div className="logro-info">
                      <div className="logro-title">Campeón de Torneo</div>
                      <div className="logro-subtitle">{torneoStats.torneosGanados} victoria{torneoStats.torneosGanados > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                )}
                
                {torneoStats.podios > 0 && (
                  <div className="torneo-logro-item">
                    <div className="logro-icon">
                      <FaAward style={{ color: '#C0C0C0', fontSize: '1.2em' }} />
                    </div>
                    <div className="logro-info">
                      <div className="logro-title">Maestro del Podio</div>
                      <div className="logro-subtitle">{torneoStats.podios} podio{torneoStats.podios > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                )}
                
                {torneoStats.promedioPosicion <= 5 && (
                  <div className="torneo-logro-item">
                    <div className="logro-icon">
                      <MdTrendingUp style={{ color: '#10b981', fontSize: '1.2em' }} />
                    </div>
                    <div className="logro-info">
                      <div className="logro-title">Consistencia</div>
                      <div className="logro-subtitle">Promedio: {torneoStats.promedioPosicion}°</div>
                    </div>
                  </div>
                )}
                
                {torneoStats.totalTorneos >= 5 && (
                  <div className="torneo-logro-item">
                    <div className="logro-icon">
                      <FaUsers style={{ color: '#667eea', fontSize: '1.2em' }} />
                    </div>
                    <div className="logro-info">
                      <div className="logro-title">Competidor Activo</div>
                      <div className="logro-subtitle">{torneoStats.totalTorneos} torneo{torneoStats.totalTorneos > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;