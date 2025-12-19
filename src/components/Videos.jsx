// src/components/Videos.jsx - Con iconos de react-icons
import React, { useState, useEffect } from 'react';
import { videosAPI } from '../services/api';
import './Videos.css';
import { 
  FaVideo, 
  FaSearch, 
  FaPlay, 
  FaHeart, 
  FaRegHeart,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaPlus,
  FaEye,
  FaClock,
  FaThumbsUp,
  FaUserShield,
  FaUser,
  FaCheckCircle
} from 'react-icons/fa';
import { 
  MdTimer,
  MdPerson,
  MdGroup,
  MdSchool,
  MdTrendingUp,
  MdSettings,
  MdAdminPanelSettings,
  MdAdd,
  MdSave,
  MdClose,
  MdPlayArrow,
  MdVisibility,
  MdDelete,
  MdMovieFilter
} from 'react-icons/md';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [videoActual, setVideoActual] = useState(null);
  const [filtros, setFiltros] = useState({
    categoria: '',
    busqueda: ''
  });
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(new Set());
  const [modoAdmin, setModoAdmin] = useState(false);
  const [editandoVideo, setEditandoVideo] = useState(null);
  const [nuevoVideo, setNuevoVideo] = useState({
    titulo: '',
    descripcion: '',
    youtubeId: '',
    categoria: 'politico',
    duracion: 0
  });

  // Verificar si es admin (en un caso real, esto vendría del backend)
  const esAdmin = localStorage.getItem('userRole') === 'admin' || 
                  localStorage.getItem('isAdmin') === 'true' ||
                  true; // Para desarrollo

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
      // Datos de ejemplo para desarrollo
      setVideos(videosEjemplo);
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
      
      // Actualizar contador localmente
      setVideos(prevVideos => 
        prevVideos.map(video => {
          if (video._id === videoId) {
            const nuevoLikeCount = liked.has(videoId) 
              ? (video.likes || 0) - 1 
              : (video.likes || 0) + 1;
            return { ...video, likes: Math.max(0, nuevoLikeCount) };
          }
          return video;
        })
      );
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  // ADMIN FUNCTIONS
  const handleAgregarVideo = async (e) => {
    e.preventDefault();
    try {
      const nuevo = await videosAPI.create(nuevoVideo);
      setVideos([nuevo, ...videos]);
      setNuevoVideo({
        titulo: '',
        descripcion: '',
        youtubeId: '',
        categoria: 'politico',
        duracion: 0
      });
      alert('Video agregado exitosamente');
    } catch (error) {
      console.error('Error al agregar video:', error);
      alert('Error al agregar video');
    }
  };

  const handleEditarVideo = async (e) => {
    e.preventDefault();
    try {
      const actualizado = await videosAPI.update(editandoVideo._id, editandoVideo);
      setVideos(videos.map(v => v._id === editandoVideo._id ? actualizado : v));
      setEditandoVideo(null);
      if (videoActual?._id === editandoVideo._id) {
        setVideoActual(actualizado);
      }
      alert('Video actualizado exitosamente');
    } catch (error) {
      console.error('Error al editar video:', error);
      alert('Error al actualizar video');
    }
  };

  const handleEliminarVideo = async (videoId) => {
    if (!window.confirm('¿Estás seguro de eliminar este video?')) return;
    
    try {
      await videosAPI.delete(videoId);
      setVideos(videos.filter(v => v._id !== videoId));
      if (videoActual?._id === videoId) {
        setVideoActual(null);
      }
      alert('Video eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar video:', error);
      alert('Error al eliminar video');
    }
  };

  const iniciarEdicion = (video) => {
    setEditandoVideo({...video});
  };

  const cancelarEdicion = () => {
    setEditandoVideo(null);
  };

  const extractYoutubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const categorias = [
    { valor: 'politico', etiqueta: 'Historia Política', color: '#3B82F6' },
    { valor: 'conflicto', etiqueta: 'Conflicto Armado', color: '#EF4444' },
    { valor: 'social', etiqueta: 'Movimientos Sociales', color: '#10B981' },
    { valor: 'cultural', etiqueta: 'Cultura', color: '#F59E0B' },
    { valor: 'economico', etiqueta: 'Economía', color: '#8B5CF6' }
  ];

  const videosEjemplo = [];

  const videosFiltrados = videos.filter(video => {
    if (filtros.categoria && video.categoria !== filtros.categoria) return false;
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      return video.titulo.toLowerCase().includes(busqueda) || 
             video.descripcion.toLowerCase().includes(busqueda);
    }
    return true;
  });

  return (
    <div className="videos-container">
      {/* Header */}
      <div className="videos-header">
        <h1>
          <FaVideo className="header-icon" />
          Videos Educativos
        </h1>
        <p className="subtitle">Explora la historia de Colombia a través de contenido audiovisual</p>
        
        {esAdmin && (
          <button 
            className={`admin-toggle-btn ${modoAdmin ? 'active' : ''}`}
            onClick={() => setModoAdmin(!modoAdmin)}
          >
            {modoAdmin ? (
              <>
                <FaUser style={{ marginRight: '8px' }} />
                Modo Usuario
              </>
            ) : (
              <>
                <MdSettings style={{ marginRight: '8px' }} />
                Modo Administrador
              </>
            )}
          </button>
        )}
      </div>

      {/* Panel de Administración */}
      {modoAdmin && (
        <div className="admin-panel">
          <h2 className="admin-title">
            <MdAdminPanelSettings className="admin-icon" />
            Panel de Administración
          </h2>
          
          {/* Formulario para agregar nuevo video */}
          <div className="admin-section">
            <h3>
              <MdAdd style={{ marginRight: '8px' }} />
              Agregar Nuevo Video
            </h3>
            <form onSubmit={handleAgregarVideo} className="video-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Título del Video *</label>
                  <input
                    type="text"
                    value={nuevoVideo.titulo}
                    onChange={(e) => setNuevoVideo({...nuevoVideo, titulo: e.target.value})}
                    placeholder="Ej: La Independencia de Colombia"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>URL de YouTube *</label>
                  <input
                    type="url"
                    value={nuevoVideo.youtubeId}
                    onChange={(e) => {
                      const url = e.target.value;
                      const id = extractYoutubeId(url) || url;
                      setNuevoVideo({...nuevoVideo, youtubeId: id});
                    }}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                  {nuevoVideo.youtubeId && (
                    <div className="url-preview">
                      <span className="preview-label">ID detectado:</span>
                      <span className="preview-id">{nuevoVideo.youtubeId}</span>
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    value={nuevoVideo.categoria}
                    onChange={(e) => setNuevoVideo({...nuevoVideo, categoria: e.target.value})}
                  >
                    {categorias.map(cat => (
                      <option key={cat.valor} value={cat.valor}>
                        {cat.etiqueta}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group full-width">
                  <label>Descripción *</label>
                  <textarea
                    value={nuevoVideo.descripcion}
                    onChange={(e) => setNuevoVideo({...nuevoVideo, descripcion: e.target.value})}
                    placeholder="Descripción detallada del video..."
                    rows="4"
                    required
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  <FaSave style={{ marginRight: '8px' }} />
                  Guardar Video
                </button>
              </div>
            </form>
          </div>

          {/* Lista de videos para edición */}
          <div className="admin-section">
            <h3>
              <FaEdit style={{ marginRight: '8px' }} />
              Editar Videos Existentes ({videos.length})
            </h3>
            <div className="admin-videos-list">
              {videos.map(video => (
                <div key={video._id} className="admin-video-item">
                  {editandoVideo?._id === video._id ? (
                    <form onSubmit={handleEditarVideo} className="edit-form">
                      <div className="edit-form-grid">
                        <input
                          type="text"
                          value={editandoVideo.titulo}
                          onChange={(e) => setEditandoVideo({...editandoVideo, titulo: e.target.value})}
                          className="edit-input"
                          required
                        />
                        
                        <select
                          value={editandoVideo.categoria}
                          onChange={(e) => setEditandoVideo({...editandoVideo, categoria: e.target.value})}
                          className="edit-select"
                        >
                          {categorias.map(cat => (
                            <option key={cat.valor} value={cat.valor}>
                              {cat.etiqueta}
                            </option>
                          ))}
                        </select>
                        
                        <textarea
                          value={editandoVideo.descripcion}
                          onChange={(e) => setEditandoVideo({...editandoVideo, descripcion: e.target.value})}
                          className="edit-textarea"
                          rows="3"
                          required
                        />
                        
                        <div className="edit-actions">
                          <button type="submit" className="edit-save-btn">
                            <FaSave style={{ marginRight: '4px' }} />
                            Guardar
                          </button>
                          <button 
                            type="button" 
                            className="edit-cancel-btn"
                            onClick={cancelarEdicion}
                          >
                            <FaTimes style={{ marginRight: '4px' }} />
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="admin-video-info">
                        <div className="video-thumb-admin">
                          <img 
                            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                            alt={video.titulo}
                          />
                        </div>
                        <div className="video-details-admin">
                          <h4>{video.titulo}</h4>
                          <p className="video-category-admin">
                            <span 
                              className="category-dot"
                              style={{ backgroundColor: categorias.find(c => c.valor === video.categoria)?.color }}
                            ></span>
                            {categorias.find(c => c.valor === video.categoria)?.etiqueta}
                          </p>
                          <p className="video-stats-admin">
                            <span>
                              <FaEye style={{ marginRight: '4px' }} />
                              {video.vistas || 0} vistas
                            </span>
                            <span>
                              <FaHeart style={{ marginRight: '4px' }} />
                              {video.likes || 0} likes
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="admin-video-actions">
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => iniciarEdicion(video)}
                        >
                          <FaEdit style={{ marginRight: '4px' }} />
                          Editar
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleEliminarVideo(video._id)}
                        >
                          <FaTrash style={{ marginRight: '4px' }} />
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="filters-section">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar videos por título o descripción..."
            value={filtros.busqueda}
            onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
            className="search-input"
          />
          {filtros.busqueda && (
            <button 
              className="clear-search"
              onClick={() => setFiltros({ ...filtros, busqueda: '' })}
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        <div className="category-filters">
          <button
            className={`category-filter-btn ${filtros.categoria === '' ? 'active' : ''}`}
            onClick={() => setFiltros({ ...filtros, categoria: '' })}
          >
            Todas
          </button>
          {categorias.map(cat => (
            <button
              key={cat.valor}
              className={`category-filter-btn ${filtros.categoria === cat.valor ? 'active' : ''}`}
              onClick={() => setFiltros({ ...filtros, categoria: cat.valor })}
              style={{
                borderColor: filtros.categoria === cat.valor ? cat.color : '#e2e8f0',
                backgroundColor: filtros.categoria === cat.valor ? cat.color + '20' : 'white',
                color: filtros.categoria === cat.valor ? cat.color : '#64748b'
              }}
            >
              <span 
                className="filter-category-dot"
                style={{ backgroundColor: cat.color }}
              ></span>
              {cat.etiqueta}
            </button>
          ))}
        </div>
      </div>

      {/* Video Player (si hay video seleccionado) */}
      {videoActual && (
        <div className="video-player-container">
          <div className="video-player-header">
            <button 
              className="close-player-btn"
              onClick={() => setVideoActual(null)}
            >
              <FaTimes style={{ marginRight: '4px' }} />
              Cerrar
            </button>
            <h2 className="player-title">{videoActual.titulo}</h2>
          </div>
          
          <div className="video-wrapper">
            <div className="video-embed">
              <iframe
                src={`https://www.youtube.com/embed/${videoActual.youtubeId}?autoplay=1&rel=0`}
                title={videoActual.titulo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="video-details">
              <div className="video-meta">
                <div className="video-category-player">
                  <span 
                    className="category-badge-player"
                    style={{ 
                      backgroundColor: categorias.find(c => c.valor === videoActual.categoria)?.color + '20',
                      color: categorias.find(c => c.valor === videoActual.categoria)?.color,
                      borderColor: categorias.find(c => c.valor === videoActual.categoria)?.color
                    }}
                  >
                    {categorias.find(c => c.valor === videoActual.categoria)?.etiqueta}
                  </span>
                  <div className="video-stats-player">
                    <span className="stat-item">
                      <FaEye className="stat-icon" />
                      <span className="stat-number">{videoActual.vistas || 0}</span>
                    </span>
                  </div>
                </div>
                
                <button 
                  className={`like-btn-player ${liked.has(videoActual._id) ? 'liked' : ''}`}
                  onClick={() => handleLike(videoActual._id)}
                >
                  {liked.has(videoActual._id) ? (
                    <FaHeart className="like-icon" />
                  ) : (
                    <FaRegHeart className="like-icon" />
                  )}
                  <span className="like-text">
                    {liked.has(videoActual._id) ? 'Te gusta' : 'Me gusta'}
                  </span>
                  <span className="like-count">{videoActual.likes || 0}</span>
                </button>
              </div>
              
              <div className="video-description">
                <h3>Descripción</h3>
                <p>{videoActual.descripcion}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid de Videos */}
      <div className="videos-grid">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando videos...</p>
          </div>
        ) : videosFiltrados.length === 0 ? (
          <div className="empty-state">
            <MdMovieFilter className="empty-icon" style={{ fontSize: '64px', color: '#cbd5e1' }} />
            <h3>No se encontraron videos</h3>
            <p>Intenta con otros filtros de búsqueda</p>
          </div>
        ) : (
          videosFiltrados.map(video => (
            <div 
              key={video._id} 
              className="video-card"
              onClick={() => handleVideoClick(video)}
            >
              <div className="video-thumbnail">
                <img 
                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                  alt={video.titulo}
                  loading="lazy"
                />
                <div className="video-overlay">
                  <div className="play-button">
                    <FaPlay className="play-icon" />
                  </div>
                  <div className="video-duration">
                    {Math.floor(video.duracion / 60)}:{(video.duracion % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <div 
                  className="video-category-indicator"
                  style={{ backgroundColor: categorias.find(c => c.valor === video.categoria)?.color }}
                ></div>
              </div>
              
              <div className="video-card-content">
                <h3 className="video-title">{video.titulo}</h3>
                <p className="video-description-preview">
                  {video.descripcion.substring(0, 100)}...
                </p>
                
                <div className="video-card-footer">
                  <div className="video-stats-card">
                    <span className="stat">
                      <FaEye className="stat-icon" />
                      <span className="stat-number">{video.vistas || 0}</span>
                    </span>
                    <span className="stat">
                      <FaHeart className="stat-icon" />
                      <span className="stat-number">{video.likes || 0}</span>
                    </span>
                  </div>
                  
                  <div 
                    className="video-category-badge"
                    style={{ 
                      backgroundColor: categorias.find(c => c.valor === video.categoria)?.color + '20',
                      color: categorias.find(c => c.valor === video.categoria)?.color
                    }}
                  >
                    {categorias.find(c => c.valor === video.categoria)?.etiqueta}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de edición */}
      {editandoVideo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                <FaEdit style={{ marginRight: '8px' }} />
                Editar Video
              </h2>
              <button 
                className="modal-close"
                onClick={cancelarEdicion}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleEditarVideo} className="modal-form">
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  value={editandoVideo.titulo}
                  onChange={(e) => setEditandoVideo({...editandoVideo, titulo: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Categoría</label>
                <select
                  value={editandoVideo.categoria}
                  onChange={(e) => setEditandoVideo({...editandoVideo, categoria: e.target.value})}
                >
                  {categorias.map(cat => (
                    <option key={cat.valor} value={cat.valor}>
                      {cat.etiqueta}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={editandoVideo.descripcion}
                  onChange={(e) => setEditandoVideo({...editandoVideo, descripcion: e.target.value})}
                  rows="4"
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="modal-btn primary">
                  <FaSave style={{ marginRight: '8px' }} />
                  Guardar Cambios
                </button>
                <button 
                  type="button" 
                  className="modal-btn secondary"
                  onClick={cancelarEdicion}
                >
                  <FaTimes style={{ marginRight: '8px' }} />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;