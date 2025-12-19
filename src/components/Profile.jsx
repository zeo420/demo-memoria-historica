// src/components/Profile.jsx - Con iconos de react-icons
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
  FaScroll
} from 'react-icons/fa';
import {
  MdTrendingUp,
  MdBarChart
} from 'react-icons/md';

const Profile = ({ usuario, onUpdate }) => {
  const [profile, setProfile] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [vistaActual, setVistaActual] = useState('estadisticas');
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    loadProfileData();
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
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      // Datos de ejemplo para desarrollo
      setProfile({
        _id: '1',
        nombre: 'Usuario Demo',
        email: 'demo@example.com',
        puntos: 1560,
        nivel: 4,
        avatar: 'https://ui-avatars.com/api/?name=Usuario+Demo&background=667eea&color=fff',
        estadisticas: {
          triviasCompletadas: 24,
          respuestasCorrectas: 168,
          respuestasIncorrectas: 72,
          racha: 8,
          mejorPorcentaje: 95
        },
        medallas: [
          { tipo: 'nivel', nombre: 'Principiante', fecha: '2024-01-10' },
          { tipo: 'perfeccion', nombre: 'Perfecto x10', fecha: '2024-01-15' },
          { tipo: 'experto', nombre: 'Historiador Novato', fecha: '2024-01-20' },
          { tipo: 'perseverante', nombre: 'Racha de 5', fecha: '2024-02-01' },
          { tipo: 'maestro', nombre: 'Maestro del Siglo XX', fecha: '2024-02-05' }
        ]
      });
      setRanking([
        { _id: '1', nombre: 'Usuario Demo', puntos: 1560, nivel: 4, avatar: null },
        { _id: '2', nombre: 'Historiador Pro', puntos: 2340, nivel: 7, avatar: null },
        { _id: '3', nombre: 'Ana García', puntos: 1890, nivel: 6, avatar: null },
        { _id: '4', nombre: 'Carlos Ruiz', puntos: 1670, nivel: 5, avatar: null },
        { _id: '5', nombre: 'María López', puntos: 1450, nivel: 4, avatar: null },
        { _id: '6', nombre: 'Pedro Martínez', puntos: 1320, nivel: 4, avatar: null },
        { _id: '7', nombre: 'Laura Díaz', puntos: 1280, nivel: 4, avatar: null },
        { _id: '8', nombre: 'Javier Gómez', puntos: 1150, nivel: 3, avatar: null },
        { _id: '9', nombre: 'Sofía Ramírez', puntos: 980, nivel: 3, avatar: null },
        { _id: '10', nombre: 'David Castro', puntos: 850, nivel: 2, avatar: null }
      ]);
      setHistorial([
        { _id: '1', fecha: '2024-02-10T14:30:00', porcentajeAcierto: 90, puntosTotales: 150, preguntasRespondidas: 10 },
        { _id: '2', fecha: '2024-02-08T16:45:00', porcentajeAcierto: 80, puntosTotales: 120, preguntasRespondidas: 10 },
        { _id: '3', fecha: '2024-02-05T11:20:00', porcentajeAcierto: 70, puntosTotales: 105, preguntasRespondidas: 10 },
        { _id: '4', fecha: '2024-02-01T09:15:00', porcentajeAcierto: 95, puntosTotales: 142, preguntasRespondidas: 10 }
      ]);
    } finally {
      setLoading(false);
    }
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
          <div className="intro-overlay">
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
          </div>
        )}
      </div>
    );
  }

  const userRank = ranking.findIndex(u => u._id === profile._id) + 1;
  const progresoPuntos = profile.puntos % 1000;
  const totalParaNivel = 1000;
  const porcentajeProgreso = (progresoPuntos / totalParaNivel) * 100;

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMedallaIcono = (tipo) => {
    const iconos = {
      nivel: <FaStar style={{ color: '#FFD700' }} />,
      perfeccion: <FaCheckCircle style={{ color: '#10B981' }} />,
      experto: <FaTrophy style={{ color: '#F59E0B' }} />,
      perseverante: <FaFire style={{ color: '#EF4444' }} />,
      maestro: <FaMedal style={{ color: '#8B5CF6' }} />,
      racha: <FaFire style={{ color: '#F97316' }} />
    };
    return iconos[tipo.split('_')[0]] || <FaMedal style={{ color: '#6B7280' }} />;
  };

  const getColorPorcentaje = (porcentaje) => {
    if (porcentaje >= 90) return '#10b981';
    if (porcentaje >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="profile-compact">
      {/* Header compacto */}
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
        {/* Columna izquierda - Información del usuario */}
        <div className="profile-left">
          <div className="user-card-compact">
            <div className="user-header">
              <div className="avatar-container">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.nombre} className="user-avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {profile.nombre.charAt(0).toUpperCase()}
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
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
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

            {/* Progreso compacto */}
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

          {/* Tabs de navegación */}
          <div className="tabs-compact">
            <button 
              className={`tab-btn ${vistaActual === 'estadisticas' ? 'active' : ''}`}
              onClick={() => setVistaActual('estadisticas')}
            >
              <MdBarChart className="tab-icon" />
              <span className="tab-text">Estadísticas</span>
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

          {/* Contenido según tab seleccionado */}
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
                      <div className="stat-card-value" style={{ color: getColorPorcentaje(
                        profile.estadisticas.respuestasCorrectas > 0
                          ? Math.round(
                              (profile.estadisticas.respuestasCorrectas /
                                (profile.estadisticas.respuestasCorrectas +
                                  profile.estadisticas.respuestasIncorrectas)) *
                                100
                            )
                          : 0
                      ) }}>
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

        {/* Columna derecha - Ranking */}
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
                    <div className="rank-avatar-compact">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.nombre} />
                      ) : (
                        <span className="rank-avatar-initial">
                          {user.nombre.charAt(0).toUpperCase()}
                        </span>
                      )}
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

          {/* Stats resumen */}
          <div className="summary-card">
            <h3 className="summary-title">
              <FaChartLine style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Resumen Semanal
            </h3>
            <div className="summary-stats">
              <div className="summary-stat">
                <div className="summary-stat-value">+245</div>
                <div className="summary-stat-label">Puntos ganados</div>
              </div>
              <div className="summary-stat">
                <div className="summary-stat-value">8</div>
                <div className="summary-stat-label">Trivias jugadas</div>
              </div>
              <div className="summary-stat">
                <div className="summary-stat-value" style={{ color: '#10b981' }}>85%</div>
                <div className="summary-stat-label">Promedio acierto</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;