// src/components/Dashboard.jsx - Con iconos de react-icons
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
      <div className="dashboard-header">
        <h1>
          <FaChartBar style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Mi Dashboard
        </h1>
        <p>Resumen de tu progreso y estadísticas</p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="stats-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <FaBullseye style={{ fontSize: '2em', color: 'white' }} />
          </div>
          <div className="summary-info">
            <span className="summary-value">{estadisticas.triviasCompletadas}</span>
            <span className="summary-label">Trivias Completadas</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <MdTrendingUp style={{ fontSize: '2em', color: 'white' }} />
          </div>
          <div className="summary-info">
            <span className="summary-value">{promedioAcierto}%</span>
            <span className="summary-label">Promedio de Acierto</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <FaStar style={{ fontSize: '2em', color: 'white' }} />
          </div>
          <div className="summary-info">
            <span className="summary-value">{totalPuntos}</span>
            <span className="summary-label">Puntos Totales</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <FaFire style={{ fontSize: '2em', color: 'white' }} />
          </div>
          <div className="summary-info">
            <span className="summary-value">{estadisticas.racha || 0}</span>
            <span className="summary-label">Racha Actual</span>
          </div>
        </div>
      </div>

      {/* Gráfica de progreso */}
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

      {/* Historial reciente */}
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

      <style jsx>{`
        .dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          margin-bottom: 30px;
        }

        .dashboard-header h1 {
          color: #333;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }

        .dashboard-header p {
          color: #666;
          font-size: 1.1em;
        }

        .stats-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .summary-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: transform 0.3s;
        }

        .summary-card:hover {
          transform: translateY(-5px);
        }

        .summary-icon {
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #2a2a2aff 0%, #2d4dffff 100%);
          border-radius: 15px;
        }

        .summary-info {
          display: flex;
          flex-direction: column;
        }

        .summary-value {
          font-size: 2em;
          font-weight: bold;
          color: #333;
        }

        .summary-label {
          color: #666;
          font-size: 0.9em;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .chart-card, .stats-detailed-card, .recent-history {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .chart-card h3, .stats-detailed-card h3, .recent-history h3 {
          margin: 0 0 20px 0;
          color: #333;
          display: flex;
          align-items: center;
        }

        .chart-container {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          height: 300px;
          padding: 20px 0;
        }

        .bar-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .bar {
          width: 100%;
          min-height: 40px;
          border-radius: 8px 8px 0 0;
          position: relative;
          transition: all 0.3s;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 5px;
        }

        .bar:hover {
          opacity: 0.8;
          transform: scale(1.05);
        }

        .bar-value {
          font-size: 0.8em;
          font-weight: bold;
          color: white;
        }

        .bar-label {
          font-size: 0.85em;
          color: #666;
        }

        .detailed-stats {
          display: grid;
          gap: 15px;
        }

        .detailed-stat {
          display: flex;
          justify-content: space-between;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
          border-left: 4px solid #667eea;
        }

        .detailed-stat.success {
          border-left-color: #28a745;
        }

        .detailed-stat.error {
          border-left-color: #dc3545;
        }

        .detailed-stat .stat-label {
          color: #666;
          font-size: 0.95em;
          display: flex;
          align-items: center;
        }

        .detailed-stat .stat-value {
          font-weight: bold;
          font-size: 1.2em;
          color: #333;
        }

        .history-table {
          overflow-x: auto;
        }

        .history-header {
          display: grid;
          grid-template-columns: 60px 150px 100px 100px 100px 1fr;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }

        .history-row {
          display: grid;
          grid-template-columns: 60px 150px 100px 100px 100px 1fr;
          gap: 15px;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          margin-bottom: 10px;
          align-items: center;
          transition: all 0.3s;
        }

        .history-row:hover {
          border-color: #667eea;
          transform: translateX(5px);
        }

        .history-number {
          font-weight: bold;
          color: #667eea;
        }

        .history-date {
          color: #666;
          font-size: 0.9em;
        }

        .history-percentage {
          font-weight: bold;
          font-size: 1.1em;
        }

        .history-percentage.excelente {
          color: #28a745;
        }

        .history-percentage.bueno {
          color: #ffc107;
        }

        .history-percentage.regular {
          color: #dc3545;
        }

        .history-points {
          color: #667eea;
          font-weight: bold;
        }

        .history-status {
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.85em;
          font-weight: 600;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .history-status.excelente {
          background: #d4edda;
          color: #155724;
        }

        .history-status.bueno {
          background: #fff3cd;
          color: #856404;
        }

        .history-status.regular {
          background: #f8d7da;
          color: #721c24;
        }

        .no-data, .no-history {
          text-align: center;
          color: #999;
          padding: 40px;
          font-size: 1.1em;
        }

        .loading {
          text-align: center;
          padding: 60px;
          font-size: 1.2em;
          color: #666;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .history-header, .history-row {
            grid-template-columns: 50px 120px 80px 80px 80px 1fr;
            gap: 10px;
            font-size: 0.9em;
          }
        }

        @media (max-width: 768px) {
          .history-header, .history-row {
            grid-template-columns: 1fr;
            text-align: left;
          }

          .history-header span, .history-row span {
            display: flex;
            justify-content: space-between;
          }

          .history-header span::before, .history-row span::before {
            content: attr(data-label);
            font-weight: bold;
            color: #666;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;