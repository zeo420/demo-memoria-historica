import React, { useState, useEffect } from 'react';
import { videosAPI } from '../services/api';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [videoActual, setVideoActual] = useState(null);
  const [filtros, setFiltros] = useState({
    categoria: '',
    busqueda: ''
  });
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(new Set());

  useEffect(() => {
    cargarVideos();
  }, [filtros]);

  const cargarVideos = async () => {
    setLoading(true);
    try {
      const data = await videosAPI.getAll(filtros);
      setVideos(data);
    } catch (error) {
      console.error('Error al cargar videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = async (video) => {
    setVideoActual(video);
    try {
      await videosAPI.registrarVista(video._id);
    } catch (error) {
      console.error('Error al registrar vista:', error);
    }
  };

  const handleLike = async (videoId) => {
    try {
      await videosAPI.toggleLike(videoId);
      setLiked(prev => {
        const newSet = new Set(prev);
        if (newSet.has(videoId)) {
          newSet.delete(videoId);
        } else {
          newSet.add(videoId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const categorias = [
    { valor: '', etiqueta: 'Todas' },
    { valor: 'politico', etiqueta: 'Historia Política' },
    { valor: 'conflicto', etiqueta: 'Conflicto Armado' },
    { valor: 'social', etiqueta: 'Movimientos Sociales' },
    { valor: 'cultural', etiqueta: 'Cultura' },
    { valor: 'economico', etiqueta: 'Economía' }
  ];

  return (
    <div className="videos-container">
      <div className="videos-header">
        <h1>🎬 Videos Educativos</h1>
        <p>Explora la historia de Colombia a través de contenido audiovisual</p>
      </div>

      <div className="filtros-section">
        <div className="filtro-busqueda">
          <input
            type="text"
            placeholder="🔍 Buscar videos..."
            value={filtros.busqueda}
            onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
          />
        </div>

        <div className="filtro-categorias">
          {categorias.map(cat => (
            <button
              key={cat.valor}
              className={`categoria-btn ${filtros.categoria === cat.valor ? 'active' : ''}`}
              onClick={() => setFiltros({ ...filtros, categoria: cat.valor })}
            >
              {cat.etiqueta}
            </button>
          ))}
        </div>
      </div>

      {videoActual && (
        <div className="video-player-section">
          <button 
            className="cerrar-player"
            onClick={() => setVideoActual(null)}
          >
            ✕ Cerrar
          </button>
          
          <div className="video-player">
            <iframe
              width="100%"
              height="500"
              src={`https://www.youtube.com/embed/${videoActual.youtubeId}?autoplay=1`}
              title={videoActual.titulo}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="video-info">
            <h2>{videoActual.titulo}</h2>
            <div className="video-meta">
              <span>👁️ {videoActual.vistas || 0} vistas</span>
              <span>⏱️ {Math.floor(videoActual.duracion / 60)} min</span>
              <span className={`categoria-badge ${videoActual.categoria}`}>
                {videoActual.categoria}
              </span>
            </div>
            <p className="video-descripcion">{videoActual.descripcion}</p>
            
            <button 
              className={`like-btn ${liked.has(videoActual._id) ? 'liked' : ''}`}
              onClick={() => handleLike(videoActual._id)}
            >
              {liked.has(videoActual._id) ? '❤️' : '🤍'} Me gusta
            </button>
          </div>
        </div>
      )}

      <div className="videos-grid">
        {loading ? (
          <div className="loading">Cargando videos...</div>
        ) : videos.length === 0 ? (
          <div className="no-videos">
            <p>No se encontraron videos con estos filtros</p>
          </div>
        ) : (
          videos.map(video => (
            <div 
              key={video._id} 
              className="video-card"
              onClick={() => handleVideoClick(video)}
            >
              <div className="video-thumbnail">
                <img 
                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                  alt={video.titulo}
                />
                <div className="play-overlay">
                  <div className="play-button">▶</div>
                </div>
                <span className="duracion">
                  {Math.floor(video.duracion / 60)}:{(video.duracion % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="video-card-info">
                <h3>{video.titulo}</h3>
                <p>{video.descripcion.substring(0, 100)}...</p>
                <div className="video-stats">
                  <span>👁️ {video.vistas || 0}</span>
                  <span>❤️ {video.likes?.length || 0}</span>
                  <span className={`badge ${video.categoria}`}>
                    {video.categoria}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .videos-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .videos-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .videos-header h1 {
          font-size: 2.5em;
          color: #333;
          margin-bottom: 10px;
        }

        .videos-header p {
          color: #666;
          font-size: 1.1em;
        }

        .filtros-section {
          margin-bottom: 30px;
        }

        .filtro-busqueda {
          margin-bottom: 20px;
        }

        .filtro-busqueda input {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 1.1em;
        }

        .filtro-categorias {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .categoria-btn {
          padding: 10px 20px;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .categoria-btn:hover {
          border-color: #667eea;
          transform: translateY(-2px);
        }

        .categoria-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
        }

        .video-player-section {
          background: white;
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 40px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          position: relative;
        }

        .cerrar-player {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.7);
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
          z-index: 10;
        }

        .video-player {
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .video-info h2 {
          font-size: 1.8em;
          color: #333;
          margin-bottom: 15px;
        }

        .video-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .video-meta span {
          color: #666;
          font-size: 0.95em;
        }

        .categoria-badge {
          padding: 5px 15px;
          border-radius: 15px;
          font-weight: 600;
        }

        .categoria-badge.politico {
          background: #d1ecf1;
          color: #0c5460;
        }

        .categoria-badge.conflicto {
          background: #f8d7da;
          color: #721c24;
        }

        .categoria-badge.social {
          background: #d4edda;
          color: #155724;
        }

        .categoria-badge.cultural {
          background: #fff3cd;
          color: #856404;
        }

        .categoria-badge.economico {
          background: #e2e3e5;
          color: #383d41;
        }

        .video-descripcion {
          color: #555;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .like-btn {
          padding: 12px 25px;
          border: 2px solid #e0e0e0;
          background: white;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1.1em;
          transition: all 0.3s;
        }

        .like-btn.liked {
          background: #ffe0e0;
          border-color: #ff6b6b;
        }

        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
        }

        .video-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .video-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .video-thumbnail {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 */
          overflow: hidden;
        }

        .video-thumbnail img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .video-card:hover .play-overlay {
          opacity: 1;
        }

        .play-button {
          width: 60px;
          height: 60px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5em;
          color: #667eea;
        }

        .duracion {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.85em;
        }

        .video-card-info {
          padding: 15px;
        }

        .video-card-info h3 {
          font-size: 1.1em;
          color: #333;
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .video-card-info p {
          color: #666;
          font-size: 0.9em;
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .video-stats {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .video-stats span {
          color: #999;
          font-size: 0.85em;
        }

        .badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75em;
          font-weight: 600;
        }

        .loading, .no-videos {
          text-align: center;
          padding: 60px;
          color: #999;
          font-size: 1.2em;
          grid-column: 1 / -1;
        }
      `}</style>
    </div>
  );
};

export default Videos;