// src/components/Profile.jsx - Perfil de usuario con estadísticas
import React, { useState, useEffect } from 'react';
import { triviaAPI } from '../services/api';
import { userAPI } from '../services/api';

const Profile = ({ usuario, onUpdate }) => {
  const [profile, setProfile] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', avatar: '' });
  const [loading, setLoading] = useState(true);
  const [vistaActual, setVistaActual] = useState('estadisticas'); // estadisticas | medallas | historial

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
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

  if (loading) {
    return <div className="loading">Cargando perfil...</div>;
  }

  const userRank = ranking.findIndex(u => u._id === profile._id) + 1;
  const progressToNextLevel = (profile.puntos % (profile.nivel * 100));
  const puntosParaNivel = profile.nivel * 100;

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMedallaIcono = (tipo) => {
    const iconos = {
      nivel: '⭐',
      perfeccion: '💯',
      experto: '🎓',
      perseverante: '🏃',
      maestro: '👑',
      racha: '🔥'
    };
    return iconos[tipo.split('_')[0]] || '🏅';
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>👤 Mi Perfil</h1>
      </div>

      <div className="profile-grid">
        {/* Tarjeta de información del usuario */}
        <div className="profile-card">
          <div className="avatar-section">
            <div className="avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.nombre} />
              ) : (
                <span className="avatar-placeholder">
                  {profile.nombre.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="level-badge">Nivel {profile.nivel}</div>
          </div>

          {!editMode ? (
            <div className="info-section">
              <h2>{profile.nombre}</h2>
              <p className="email">{profile.email}</p>
              <div className="stats-quick">
                <div className="stat">
                  <span className="label">Puntos</span>
                  <span className="value">{profile.puntos}</span>
                </div>
                <div className="stat">
                  <span className="label">Ranking</span>
                  <span className="value">#{userRank}</span>
                </div>
              </div>
              <button 
                className="edit-btn"
                onClick={() => setEditMode(true)}
              >
                ✏️ Editar Perfil
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="edit-form">
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                placeholder="Nombre"
              />
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                placeholder="URL del avatar (opcional)"
              />
              <div className="form-buttons">
                <button type="submit" className="save-btn">💾 Guardar</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setEditMode(false)}
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Progreso al siguiente nivel */}
          <div className="level-progress">
            <div className="progress-header">
              <span>Progreso al Nivel {profile.nivel + 1}</span>
              <span>{progressToNextLevel}/{puntosParaNivel}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(progressToNextLevel / puntosParaNivel) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="profile-tabs">
          <button 
            className={vistaActual === 'estadisticas' ? 'active' : ''}
            onClick={() => setVistaActual('estadisticas')}
          >
            📊 Estadísticas
          </button>
          <button 
            className={vistaActual === 'medallas' ? 'active' : ''}
            onClick={() => setVistaActual('medallas')}
          >
            🏆 Medallas ({profile.medallas.length})
          </button>
          <button 
            className={vistaActual === 'historial' ? 'active' : ''}
            onClick={() => setVistaActual('historial')}
          >
            📜 Historial ({historial.length})
          </button>
        </div>

        {/* Estadísticas detalladas */}
        {vistaActual === 'estadisticas' && (
          <div className="stats-card">
            <h3>📊 Estadísticas Detalladas</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-icon">🎯</span>
                <div className="stat-info">
                  <span className="stat-label">Trivias Completadas</span>
                  <span className="stat-number">
                    {profile.estadisticas.triviasCompletadas}
                  </span>
                </div>
              </div>
              
              <div className="stat-item">
                <span className="stat-icon">✅</span>
                <div className="stat-info">
                  <span className="stat-label">Respuestas Correctas</span>
                  <span className="stat-number">
                    {profile.estadisticas.respuestasCorrectas}
                  </span>
                </div>
              </div>
              
              <div className="stat-item">
                <span className="stat-icon">❌</span>
                <div className="stat-info">
                  <span className="stat-label">Respuestas Incorrectas</span>
                  <span className="stat-number">
                    {profile.estadisticas.respuestasIncorrectas}
                  </span>
                </div>
              </div>
              
              <div className="stat-item">
                <span className="stat-icon">📈</span>
                <div className="stat-info">
                  <span className="stat-label">Tasa de Acierto</span>
                  <span className="stat-number">
                    {profile.estadisticas.respuestasCorrectas > 0
                      ? Math.round(
                          (profile.estadisticas.respuestasCorrectas /
                            (profile.estadisticas.respuestasCorrectas +
                              profile.estadisticas.respuestasIncorrectas)) *
                            100
                        )
                      : 0}%
                  </span>
                </div>
              </div>

              <div className="stat-item">
                <span className="stat-icon">🔥</span>
                <div className="stat-info">
                  <span className="stat-label">Racha Actual</span>
                  <span className="stat-number">
                    {profile.estadisticas.racha || 0}
                  </span>
                </div>
              </div>

              <div className="stat-item">
                <span className="stat-icon">💯</span>
                <div className="stat-info">
                  <span className="stat-label">Mejor Porcentaje</span>
                  <span className="stat-number">
                    {profile.estadisticas.mejorPorcentaje || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Medallas */}
        {vistaActual === 'medallas' && (
          <div className="medals-card">
            <h3>🏆 Medallas Desbloqueadas</h3>
            <div className="medals-grid">
              {profile.medallas.length > 0 ? (
                profile.medallas.slice().reverse().map((medalla, idx) => (
                  <div key={idx} className="medal-item">
                    <span className="medal-icon">{getMedallaIcono(medalla.tipo)}</span>
                    <span className="medal-name">{medalla.nombre || medalla.tipo}</span>
                    <span className="medal-date">{formatearFecha(medalla.fecha)}</span>
                  </div>
                ))
              ) : (
                <p className="no-medals">
                  Aún no tienes medallas. ¡Completa trivias para ganarlas!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Historial */}
        {vistaActual === 'historial' && (
          <div className="historial-card">
            <h3>📜 Historial de Trivias</h3>
            <div className="historial-lista">
              {historial.length > 0 ? (
                historial.map((item, idx) => (
                  <div key={item._id} className="historial-item">
                    <div className="historial-header">
                      <span className="historial-numero">#{historial.length - idx}</span>
                      <span className="historial-fecha">{formatearFecha(item.fecha)}</span>
                    </div>
                    <div className="historial-stats">
                      <div className="historial-stat">
                        <span className="label">Precisión:</span>
                        <span className={`valor ${item.porcentajeAcierto >= 80 ? 'excelente' : item.porcentajeAcierto >= 60 ? 'bueno' : 'regular'}`}>
                          {item.porcentajeAcierto}%
                        </span>
                      </div>
                      <div className="historial-stat">
                        <span className="label">Puntos:</span>
                        <span className="valor">{item.puntosTotales}</span>
                      </div>
                      <div className="historial-stat">
                        <span className="label">Preguntas:</span>
                        <span className="valor">{item.preguntasRespondidas.length}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-historial">
                  Aún no has completado ninguna trivia. ¡Empieza ahora!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Ranking global */}
        <div className="ranking-card">
          <h3>🌟 Top 10 Ranking Global</h3>
          <div className="ranking-list">
            {ranking.map((user, idx) => (
              <div 
                key={user._id} 
                className={`ranking-item ${user._id === profile._id ? 'current-user' : ''}`}
              >
                <span className="rank">#{idx + 1}</span>
                <div className="rank-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.nombre} />
                  ) : (
                    user.nombre.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="rank-name">{user.nombre}</span>
                <span className="rank-level">Nv.{user.nivel}</span>
                <span className="rank-points">{user.puntos} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .profile-header {
          margin-bottom: 30px;
        }

        .profile-header h1 {
          font-size: 2.5em;
          color: #333;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .profile-card, .stats-card, .medals-card, .ranking-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .avatar-section {
          text-align: center;
          margin-bottom: 20px;
        }

        .avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin: 0 auto 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          font-size: 3em;
          color: white;
          font-weight: bold;
        }

        .level-badge {
          display: inline-block;
          background: #ffd700;
          color: #333;
          padding: 8px 20px;
          border-radius: 20px;
          font-weight: bold;
        }

        .info-section h2 {
          text-align: center;
          margin: 15px 0 5px;
          color: #333;
        }

        .email {
          text-align: center;
          color: #666;
          margin-bottom: 20px;
        }

        .stats-quick {
          display: flex;
          justify-content: space-around;
          margin: 20px 0;
        }

        .stat {
          text-align: center;
        }

        .stat .label {
          display: block;
          color: #666;
          font-size: 0.9em;
          margin-bottom: 5px;
        }

        .stat .value {
          display: block;
          font-size: 1.8em;
          font-weight: bold;
          color: #667eea;
        }

        .edit-btn, .save-btn, .cancel-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 1em;
          cursor: pointer;
          margin-top: 10px;
        }

        .edit-btn {
          background: #667eea;
          color: white;
        }

        .save-btn {
          background: #28a745;
          color: white;
        }

        .cancel-btn {
          background: #dc3545;
          color: white;
        }

        .edit-form input {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
        }

        .form-buttons {
          display: flex;
          gap: 10px;
        }

        .level-progress {
          margin-top: 20px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 0.9em;
          color: #666;
        }

        .progress-bar {
          height: 10px;
          background: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s;
        }

        .stats-grid {
          display: grid;
          gap: 15px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .stat-icon {
          font-size: 2em;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.9em;
          color: #666;
        }

        .stat-number {
          font-size: 1.5em;
          font-weight: bold;
          color: #333;
        }

        .medals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 15px;
        }

        .medal-item {
          text-align: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .medal-icon {
          font-size: 2em;
          display: block;
          margin-bottom: 5px;
        }

        .medal-name {
          font-size: 0.85em;
          color: #666;
        }

        .no-medals {
          text-align: center;
          color: #999;
          padding: 20px;
        }

        .ranking-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ranking-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 10px;
          transition: transform 0.2s;
        }

        .ranking-item:hover {
          transform: translateX(5px);
        }

        .ranking-item.current-user {
          background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
          border: 2px solid #667eea;
        }

        .rank {
          font-weight: bold;
          color: #667eea;
          min-width: 30px;
        }

        .rank-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #667eea;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          overflow: hidden;
        }

        .rank-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .rank-name {
          flex: 1;
          font-weight: 500;
        }

        .rank-level {
          color: #666;
          font-size: 0.9em;
        }

        .rank-points {
          font-weight: bold;
          color: #667eea;
        }

        .loading {
          text-align: center;
          padding: 50px;
          font-size: 1.2em;
          color: #666;
        }

        .profile-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          grid-column: 1 / -1;
        }

        .profile-tabs button {
          flex: 1;
          padding: 15px;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 10px;
          font-size: 1em;
          cursor: pointer;
          transition: all 0.3s;
        }

        .profile-tabs button:hover {
          border-color: #667eea;
        }

        .profile-tabs button.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .historial-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          grid-column: 1 / -1;
        }

        .historial-lista {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .historial-item {
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          padding: 15px;
          transition: all 0.3s;
        }

        .historial-item:hover {
          border-color: #667eea;
          transform: translateX(5px);
        }

        .historial-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e0e0e0;
        }

        .historial-numero {
          font-weight: bold;
          color: #667eea;
        }

        .historial-fecha {
          color: #666;
          font-size: 0.9em;
        }

        .historial-stats {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .historial-stat {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .historial-stat .label {
          color: #666;
          font-size: 0.9em;
        }

        .historial-stat .valor {
          font-weight: bold;
          font-size: 1.1em;
        }

        .historial-stat .valor.excelente {
          color: #28a745;
        }

        .historial-stat .valor.bueno {
          color: #ffc107;
        }

        .historial-stat .valor.regular {
          color: #dc3545;
        }

        .no-historial {
          text-align: center;
          color: #999;
          padding: 40px;
          font-size: 1.1em;
        }

        .medal-date {
          display: block;
          font-size: 0.75em;
          color: #999;
          margin-top: 5px;
        }

        .medals-card, .stats-card, .historial-card {
          grid-column: 1 / -1;
        }
      `}</style>
    </div>
  );
};

export default Profile;