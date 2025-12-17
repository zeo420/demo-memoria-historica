// src/components/Mapas.jsx - Mapas interactivos con Leaflet
import React, { useState, useEffect, useRef } from 'react';
import { eventosAPI } from '../services/api';

const Mapas = () => {
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [filtros, setFiltros] = useState({
    categoria: '',
    decada: ''
  });
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    cargarEventos();
  }, [filtros]);

  useEffect(() => {
    // Inicializar mapa después de cargar los datos
    if (eventos.length > 0 && !mapInstanceRef.current) {
      inicializarMapa();
    }
  }, [eventos]);

  const cargarEventos = async () => {
    setLoading(true);
    try {
      const data = await eventosAPI.getMapa(filtros);
      setEventos(data);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const inicializarMapa = () => {
    // Nota: Esta es una versión simplificada
    // En producción, necesitarías instalar: npm install leaflet react-leaflet
    console.log('Mapa inicializado con', eventos.length, 'eventos');
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
      politico: '#667eea',
      conflicto: '#dc3545',
      social: '#28a745',
      cultural: '#ffc107',
      economico: '#17a2b8'
    };
    return colores[categoria] || '#6c757d';
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const decadas = [
    { valor: '', etiqueta: 'Todas las épocas' },
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

  return (
    <div className="mapas-container">
      <div className="mapas-header">
        <h1>🗺️ Mapa Histórico de Colombia</h1>
        <p>Explora los eventos históricos ubicados en el territorio colombiano</p>
      </div>

      <div className="mapas-filtros">
        <select 
          value={filtros.categoria}
          onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
        >
          {categorias.map(cat => (
            <option key={cat.valor} value={cat.valor}>
              {cat.etiqueta}
            </option>
          ))}
        </select>

        <select 
          value={filtros.decada}
          onChange={(e) => setFiltros({ ...filtros, decada: e.target.value })}
        >
          {decadas.map(dec => (
            <option key={dec.valor} value={dec.valor}>
              {dec.etiqueta}
            </option>
          ))}
        </select>

        <div className="eventos-count">
          📍 {eventos.length} eventos encontrados
        </div>
      </div>

      <div className="mapas-content">
        <div className="mapa-section">
          <div className="mapa-placeholder" ref={mapRef}>
            {loading ? (
              <div className="loading">Cargando mapa...</div>
            ) : (
              <>
                <div className="mapa-overlay">
                  <h3>Mapa Interactivo</h3>
                  <p>Vista simplificada de eventos históricos en Colombia</p>
                  <div className="colombia-map">
                    <svg viewBox="0 0 400 500" className="colombia-svg">
                      {/* Contorno simplificado de Colombia */}
                      <path
                        d="M200,50 L250,100 L280,150 L290,200 L280,250 L260,300 L240,350 L220,400 L200,430 L180,400 L160,350 L140,300 L120,250 L110,200 L120,150 L150,100 Z"
                        fill="#e8f4f8"
                        stroke="#667eea"
                        strokeWidth="2"
                      />
                      
                      {/* Puntos de eventos */}
                      {eventos.map((evento, idx) => {
                        // Coordenadas simplificadas para demo
                        const x = 150 + (Math.random() * 100);
                        const y = 150 + (Math.random() * 200);
                        return (
                          <g 
                            key={evento._id}
                            onClick={() => setEventoSeleccionado(evento)}
                            style={{ cursor: 'pointer' }}
                          >
                            <circle
                              cx={x}
                              cy={y}
                              r="8"
                              fill={getCategoriaColor(evento.categoria)}
                              opacity="0.8"
                            />
                            <circle
                              cx={x}
                              cy={y}
                              r="12"
                              fill={getCategoriaColor(evento.categoria)}
                              opacity="0.3"
                            />
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  <div className="mapa-nota">
                    💡 Para una versión completa con Leaflet/OpenStreetMap, 
                    instala: npm install leaflet react-leaflet
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Leyenda */}
          <div className="mapa-leyenda">
            <h4>Leyenda</h4>
            {categorias.slice(1).map(cat => (
              <div key={cat.valor} className="leyenda-item">
                <span 
                  className="leyenda-color"
                  style={{ backgroundColor: getCategoriaColor(cat.valor) }}
                ></span>
                <span>{cat.etiqueta}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="eventos-sidebar">
          {eventoSeleccionado ? (
            <div className="evento-detalle">
              <button 
                className="cerrar-detalle"
                onClick={() => setEventoSeleccionado(null)}
              >
                ← Volver
              </button>

              <div className="evento-header">
                <span className="evento-icono">
                  {getIconoCategoria(eventoSeleccionado.categoria)}
                </span>
                <h3>{eventoSeleccionado.titulo}</h3>
              </div>

              <div className="evento-meta">
                <span className="evento-fecha">
                  📅 {formatearFecha(eventoSeleccionado.fecha)}
                </span>
                <span 
                  className="evento-categoria"
                  style={{ backgroundColor: getCategoriaColor(eventoSeleccionado.categoria) }}
                >
                  {eventoSeleccionado.categoria}
                </span>
              </div>

              <div className="evento-descripcion">
                <p>{eventoSeleccionado.descripcion}</p>
              </div>

              {eventoSeleccionado.imagen && (
                <div className="evento-imagen">
                  <img src={eventoSeleccionado.imagen} alt={eventoSeleccionado.titulo} />
                </div>
              )}

              {eventoSeleccionado.fuentes && eventoSeleccionado.fuentes.length > 0 && (
                <div className="evento-fuentes">
                  <h4>📚 Fuentes:</h4>
                  <ul>
                    {eventoSeleccionado.fuentes.map((fuente, idx) => (
                      <li key={idx}>
                        <a href={fuente} target="_blank" rel="noopener noreferrer">
                          Ver fuente {idx + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="eventos-lista">
              <h3>Eventos en el Mapa</h3>
              <p className="lista-instruccion">
                Haz clic en un punto del mapa o selecciona un evento de la lista
              </p>
              
              {eventos.map(evento => (
                <div 
                  key={evento._id}
                  className="evento-item"
                  onClick={() => setEventoSeleccionado(evento)}
                >
                  <span className="evento-item-icono">
                    {getIconoCategoria(evento.categoria)}
                  </span>
                  <div className="evento-item-info">
                    <h4>{evento.titulo}</h4>
                    <span className="evento-item-fecha">
                      {new Date(evento.fecha).getFullYear()}
                    </span>
                  </div>
                  <span 
                    className="evento-item-badge"
                    style={{ backgroundColor: getCategoriaColor(evento.categoria) }}
                  >
                    {evento.categoria}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .mapas-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 20px;
        }

        .mapas-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .mapas-header h1 {
          font-size: 2.5em;
          color: #333;
          margin-bottom: 10px;
        }

        .mapas-header p {
          color: #666;
          font-size: 1.1em;
        }

        .mapas-filtros {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          align-items: center;
          flex-wrap: wrap;
        }

        .mapas-filtros select {
          padding: 12px 20px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1em;
          cursor: pointer;
        }

        .eventos-count {
          padding: 12px 20px;
          background: #667eea;
          color: white;
          border-radius: 8px;
          font-weight: 600;
          margin-left: auto;
        }

        .mapas-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }

        .mapa-section {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .mapa-placeholder {
          width: 100%;
          height: 600px;
          position: relative;
          border-radius: 10px;
          overflow: hidden;
        }

        .mapa-overlay {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }

        .mapa-overlay h3 {
          color: #333;
          margin-bottom: 5px;
        }

        .mapa-overlay p {
          color: #666;
          margin-bottom: 20px;
        }

        .colombia-map {
          flex: 1;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .colombia-svg {
          max-width: 100%;
          max-height: 100%;
        }

        .mapa-nota {
          margin-top: 20px;
          padding: 15px;
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          border-radius: 5px;
          font-size: 0.9em;
          color: #856404;
        }

        .mapa-leyenda {
          margin-top: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .mapa-leyenda h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .leyenda-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .leyenda-color {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }

        .eventos-sidebar {
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          max-height: 660px;
          overflow-y: auto;
        }

        .eventos-lista h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .lista-instruccion {
          color: #666;
          font-size: 0.9em;
          margin-bottom: 20px;
        }

        .evento-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .evento-item:hover {
          border-color: #667eea;
          transform: translateX(5px);
        }

        .evento-item-icono {
          font-size: 1.5em;
        }

        .evento-item-info {
          flex: 1;
        }

        .evento-item-info h4 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 0.95em;
        }

        .evento-item-fecha {
          color: #666;
          font-size: 0.85em;
        }

        .evento-item-badge {
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.75em;
          color: white;
          font-weight: 600;
        }

        .evento-detalle {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .cerrar-detalle {
          padding: 10px 15px;
          background: #e0e0e0;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 20px;
        }

        .evento-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .evento-icono {
          font-size: 2.5em;
        }

        .evento-header h3 {
          margin: 0;
          color: #333;
          line-height: 1.3;
        }

        .evento-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .evento-fecha {
          color: #666;
        }

        .evento-categoria {
          padding: 5px 15px;
          border-radius: 15px;
          color: white;
          font-size: 0.85em;
          font-weight: 600;
        }

        .evento-descripcion {
          margin-bottom: 20px;
        }

        .evento-descripcion p {
          color: #555;
          line-height: 1.6;
        }

        .evento-imagen {
          margin-bottom: 20px;
          border-radius: 10px;
          overflow: hidden;
        }

        .evento-imagen img {
          width: 100%;
          height: auto;
        }

        .evento-fuentes h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .evento-fuentes ul {
          list-style: none;
          padding: 0;
        }

        .evento-fuentes li {
          margin-bottom: 8px;
        }

        .evento-fuentes a {
          color: #667eea;
          text-decoration: none;
        }

        .evento-fuentes a:hover {
          text-decoration: underline;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #999;
          font-size: 1.2em;
        }

        @media (max-width: 1024px) {
          .mapas-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Mapas;