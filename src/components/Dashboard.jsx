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
  FaBook
} from 'react-icons/fa';
import {
  MdTrendingUp,
  MdSchedule
} from 'react-icons/md';
import './Dashboard.css';

const Dashboard = ({ usuario }) => {
  const [historial, setHistorial] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const [historialData, profile] = await Promise.all([
        triviaAPI.getHistorial(),
        userAPI.getProfile()
      ]);
      setHistorial(historialData);
      setEstadisticas(profile.estadisticas);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
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

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
      </div>

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