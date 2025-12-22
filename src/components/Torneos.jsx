import React, { useState, useEffect } from 'react';
import { triviaAPI } from '../services/api';
import './Torneos.css';
import {
  FaTrophy,
  FaUsers,
  FaCrown,
  FaMedal,
  FaFire,
  FaRegClock,
  FaLock,
  FaUserFriends,
  FaAward,
  FaStar,
  FaSync,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';
import {
  MdLeaderboard,
  MdEmojiEvents,
  MdTimer,
  MdGroup,
  MdCheckCircle,
  MdError,
  MdInfo
} from 'react-icons/md';

const Torneos = ({ usuario }) => {
  const [torneos, setTorneos] = useState([]);
  const [torneoActivo, setTorneoActivo] = useState(null);
  const [puntuacionTorneo, setPuntuacionTorneo] = useState(0);
  const [posicion, setPosicion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAccion, setLoadingAccion] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [misResultados, setMisResultados] = useState([]);
  const [mostrarLeaderboard, setMostrarLeaderboard] = useState(false);
  const [creandoTorneo, setCreandoTorneo] = useState(false);
  const [backendDisponible, setBackendDisponible] = useState(true);
  const [filtros, setFiltros] = useState({
    estado: '',
    tipo: '',
    dificultad: '',
    categoria: ''
  });

  const [nuevoTorneo, setNuevoTorneo] = useState({
    nombre: '',
    descripcion: '',
    maxParticipantes: 10,
    duracionHoras: 24,
    dificultad: 'mixta',
    categoria: '',
    esPrivado: false,
    codigoAcceso: '',
    tipo: 'puntos'
  });

  useEffect(() => {
    cargarTorneosDisponibles();
    if (usuario && backendDisponible) {
      cargarMisResultados();
    }
  }, [usuario, filtros, backendDisponible]);

  const cargarTorneosDisponibles = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Construir query params
      const params = {};
      if (filtros.estado) params.estado = filtros.estado;
      if (filtros.tipo) params.tipo = filtros.tipo;
      if (filtros.dificultad) params.dificultad = filtros.dificultad;
      if (filtros.categoria) params.categoria = filtros.categoria;
      
      const data = await triviaAPI.getTorneos(params);
      setTorneos(data);
      setBackendDisponible(true);
      
      // Buscar si el usuario está en algún torneo activo
      if (usuario && data.length > 0) {
        const torneoUsuario = data.find(t => 
          t.estado === 'activo' && 
          t.participantes && 
          t.participantes.some(p => p.usuarioId === usuario.id)
        );
        
        if (torneoUsuario) {
          setTorneoActivo(torneoUsuario);
          cargarLeaderboard(torneoUsuario._id);
        }
      }
    } catch (err) {
      console.error('Error al cargar torneos:', err);
      setBackendDisponible(false);
      setError('El backend de torneos no está disponible. Intenta más tarde.');
      setTorneos([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarLeaderboard = async (torneoId) => {
    try {
      if (!backendDisponible) return;
      
      const data = await triviaAPI.getLeaderboard(torneoId);
      setLeaderboard(data);
      
      // Encontrar posición del usuario actual
      if (usuario) {
        const usuarioPosicion = data.findIndex(p => p.usuarioId === usuario.id);
        if (usuarioPosicion !== -1) {
          setPosicion(usuarioPosicion + 1);
          setPuntuacionTorneo(data[usuarioPosicion].puntuacion || 0);
        }
      }
    } catch (err) {
      console.error('Error al cargar leaderboard:', err);
      setLeaderboard([]);
    }
  };

  const cargarMisResultados = async () => {
    try {
      if (!usuario || !backendDisponible) return;
      
      const data = await triviaAPI.getMisTorneos(usuario.id);
      setMisResultados(data || []);
    } catch (err) {
      console.error('Error al cargar resultados:', err);
      setMisResultados([]);
    }
  };

  const unirseTorneo = async (torneoId, codigo = '') => {
    try {
      if (!backendDisponible) {
        setError('El backend no está disponible. Intenta más tarde.');
        return;
      }
      
      setLoadingAccion(true);
      setError('');
      setSuccess('');
      
      if (!usuario) {
        setError('Debes iniciar sesión para unirte a un torneo');
        return;
      }
      
      const resultado = await triviaAPI.unirseTorneo(
        torneoId, 
        usuario.id, 
        usuario.nombre, 
        codigo
      );
      
      setSuccess(resultado.message || '¡Te has unido al torneo exitosamente!');
      
      // Actualizar datos
      await cargarTorneosDisponibles();
      await cargarLeaderboard(torneoId);
      
    } catch (err) {
      console.error('Error al unirse al torneo:', err);
      setError(err.message || 'Error al unirse al torneo');
    } finally {
      setLoadingAccion(false);
    }
  };

  const abandonarTorneo = async () => {
    try {
      if (!torneoActivo || !usuario || !backendDisponible) return;
      
      setLoadingAccion(true);
      setError('');
      setSuccess('');
      
      await triviaAPI.abandonarTorneo(torneoActivo._id, usuario.id);
      
      setSuccess('Has abandonado el torneo exitosamente');
      
      // Limpiar estado
      setTorneoActivo(null);
      setPuntuacionTorneo(0);
      setPosicion(null);
      setLeaderboard([]);
      
      // Actualizar lista
      await cargarTorneosDisponibles();
      
    } catch (err) {
      console.error('Error al abandonar torneo:', err);
      setError(err.message || 'Error al abandonar el torneo');
    } finally {
      setLoadingAccion(false);
    }
  };

  const crearNuevoTorneo = async () => {
    try {
      if (!backendDisponible) {
        setError('El backend no está disponible. No se puede crear torneos.');
        return;
      }
      
      setLoadingAccion(true);
      setError('');
      setSuccess('');
      
      if (!usuario) {
        setError('Debes iniciar sesión para crear un torneo');
        return;
      }
      
      // Validaciones
      if (!nuevoTorneo.nombre.trim()) {
        setError('El nombre del torneo es requerido');
        return;
      }
      
      if (nuevoTorneo.maxParticipantes < 2 || nuevoTorneo.maxParticipantes > 100) {
        setError('El número de participantes debe estar entre 2 y 100');
        return;
      }
      
      if (nuevoTorneo.esPrivado && !nuevoTorneo.codigoAcceso.trim()) {
        setError('Los torneos privados requieren un código de acceso');
        return;
      }
      
      const torneoData = {
        ...nuevoTorneo,
        creadorId: usuario.id,
        creadorNombre: usuario.nombre || 'Usuario Anónimo'
      };
      
      const torneoCreado = await triviaAPI.crearTorneo(torneoData);
      
      setSuccess(`¡Torneo "${torneoCreado.nombre}" creado con éxito!`);
      
      // Unirse automáticamente al torneo creado
      await unirseTorneo(torneoCreado._id, nuevoTorneo.codigoAcceso);
      
      // Resetear formulario
      setCreandoTorneo(false);
      setNuevoTorneo({
        nombre: '',
        descripcion: '',
        maxParticipantes: 10,
        duracionHoras: 24,
        dificultad: 'mixta',
        categoria: '',
        esPrivado: false,
        codigoAcceso: '',
        tipo: 'puntos'
      });
      
    } catch (err) {
      console.error('Error al crear torneo:', err);
      setError(err.message || 'Error al crear el torneo');
    } finally {
      setLoadingAccion(false);
    }
  };

  const renderEstadoTorneo = (torneo) => {
    if (!torneo || !torneo.estado) return null;
    
    const ahora = new Date();
    const inicio = torneo.fechaInicio ? new Date(torneo.fechaInicio) : new Date();
    const fin = torneo.fechaFin ? new Date(torneo.fechaFin) : new Date();
    
    if (ahora < inicio) {
      return <span className="badge badge-proximamente">Próximamente</span>;
    } else if (ahora > fin) {
      return <span className="badge badge-finalizado">Finalizado</span>;
    } else {
      return <span className="badge badge-activo">Activo</span>;
    }
  };

  const calcularTiempoRestante = (fechaFin) => {
    if (!fechaFin) return 'Sin fecha definida';
    
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

  const estaEnTorneo = (torneo) => {
    if (!usuario || !torneo.participantes) return false;
    return torneo.participantes.some(p => p.usuarioId === usuario.id);
  };

  // Si el backend no está disponible, mostrar mensaje
  if (!backendDisponible && !loading) {
    return (
      <div className="torneos-container">
        <div className="torneos-header">
          <h1>
            <FaTrophy style={{ marginRight: '10px', verticalAlign: 'middle' }} />
            Torneos y Competencias
          </h1>
          <p>Participa en competiciones contra otros jugadores</p>
        </div>
        
        <div className="backend-no-disponible">
          <MdError style={{ fontSize: '4rem', color: '#dc3545', marginBottom: '20px' }} />
          <h3>Backend no disponible</h3>
          <p>El sistema de torneos no está disponible en este momento.</p>
          <p>Por favor, intenta más tarde o contacta al administrador.</p>
          
          <div className="backend-acciones">
            <button 
              className="btn-reintentar"
              onClick={() => {
                setBackendDisponible(true);
                cargarTorneosDisponibles();
              }}
            >
              <FaSync style={{ marginRight: '8px' }} />
              Reintentar
            </button>
            
            <button 
              className="btn-modo-offline"
              onClick={() => {
                // Mostrar datos de ejemplo (solo para desarrollo)
                setTorneos([
                  {
                    _id: 'demo-1',
                    nombre: 'Torneo Demo - Historia Colombiana',
                    descripcion: 'Torneo de demostración mientras el backend se restablece',
                    estado: 'activo',
                    tipo: 'puntos',
                    dificultad: 'mixta',
                    participantesActuales: 5,
                    maxParticipantes: 20,
                    fechaInicio: new Date().toISOString(),
                    fechaFin: new Date(Date.now() + 86400000).toISOString(),
                    esPrivado: false
                  }
                ]);
                setBackendDisponible(false); // Forzar modo offline
                setLoading(false);
              }}
            >
              <MdInfo style={{ marginRight: '8px' }} />
              Usar datos de demostración
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="torneos-container">
        <div className="loading-card">
          <FaSpinner className="spinning" style={{ fontSize: '3rem', color: '#667eea', marginBottom: '20px' }} />
          <p>Cargando torneos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="torneos-container">
      <div className="torneos-header">
        <h1>
          <FaTrophy style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Torneos y Competencias
        </h1>
        <p>Participa en competiciones contra otros jugadores y demuestra tus conocimientos</p>
      </div>

      {/* Filtros */}
      <div className="filtros-torneos">
        <h3>
          <FaSync style={{ marginRight: '8px' }} />
          Filtros
        </h3>
        <div className="filtros-grid">
          <div className="filtro-group">
            <label>Estado:</label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
              className="filtro-select"
            >
              <option value="">Todos</option>
              <option value="activo">Activos</option>
              <option value="proximamente">Próximamente</option>
              <option value="finalizado">Finalizados</option>
            </select>
          </div>
          
          <div className="filtro-group">
            <label>Tipo:</label>
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
              className="filtro-select"
            >
              <option value="">Todos</option>
              <option value="puntos">Por puntos</option>
              <option value="tiempo">Contra reloj</option>
              <option value="eliminatoria">Eliminatoria</option>
            </select>
          </div>
          
          <div className="filtro-group">
            <label>Dificultad:</label>
            <select
              value={filtros.dificultad}
              onChange={(e) => setFiltros({...filtros, dificultad: e.target.value})}
              className="filtro-select"
            >
              <option value="">Todas</option>
              <option value="facil">Fácil</option>
              <option value="medio">Medio</option>
              <option value="dificil">Difícil</option>
              <option value="mixta">Mixta</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="error-message">
          <MdError style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          <MdCheckCircle style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          {success}
        </div>
      )}

      {/* Sección de torneo activo */}
      {torneoActivo && (
        <div className="torneo-activo-card">
          <div className="torneo-activo-header">
            <h3>
              <FaFire style={{ marginRight: '8px', color: '#FF6B35' }} />
              {torneoActivo.nombre}
              {torneoActivo.creadorNombre && (
                <span className="torneo-creador">
                  por {torneoActivo.creadorNombre}
                </span>
              )}
            </h3>
            {renderEstadoTorneo(torneoActivo)}
          </div>
          
          <div className="torneo-activo-info">
            <div className="info-item">
              <FaRegClock />
              <span>Tiempo restante: {calcularTiempoRestante(torneoActivo.fechaFin)}</span>
            </div>
            <div className="info-item">
              <FaUsers />
              <span>Participantes: {torneoActivo.participantesActuales || 0}/{torneoActivo.maxParticipantes || 0}</span>
            </div>
            <div className="info-item">
              <MdTimer />
              <span>Tipo: {torneoActivo.tipo === 'tiempo' ? 'Contra reloj' : 'Por puntos'}</span>
            </div>
            {posicion && (
              <div className="info-item">
                <FaCrown />
                <span>Tu posición: {posicion}°</span>
              </div>
            )}
          </div>

          {torneoActivo.descripcion && (
            <p className="torneo-descripcion">{torneoActivo.descripcion}</p>
          )}

          <div className="torneo-activo-stats">
            <div className="stat">
              <span className="stat-value">{puntuacionTorneo}</span>
              <span className="stat-label">Tus puntos</span>
            </div>
            <button 
              className="btn-ver-leaderboard"
              onClick={() => setMostrarLeaderboard(!mostrarLeaderboard)}
              disabled={loadingAccion || !backendDisponible}
            >
              <MdLeaderboard style={{ marginRight: '5px' }} />
              {mostrarLeaderboard ? 'Ocultar' : 'Ver'} Clasificación
            </button>
            <button 
              className="btn-abandonar"
              onClick={abandonarTorneo}
              disabled={loadingAccion || !backendDisponible}
            >
              {loadingAccion ? 'Abandonando...' : 'Abandonar Torneo'}
            </button>
          </div>

          {mostrarLeaderboard && leaderboard.length > 0 && (
            <div className="leaderboard-section">
              <h4>
                <MdLeaderboard style={{ marginRight: '8px' }} />
                Clasificación Actual
              </h4>
              <div className="leaderboard-table">
                <div className="leaderboard-header">
                  <div className="header-pos">#</div>
                  <div className="header-nombre">Jugador</div>
                  <div className="header-puntos">Puntos</div>
                  <div className="header-tiempo">Tiempo</div>
                </div>
                {leaderboard.map((jugador, index) => (
                  <div 
                    key={index} 
                    className={`leaderboard-row ${jugador.usuarioId === usuario?.id ? 'usuario-actual' : ''}`}
                  >
                    <div className="leaderboard-posicion">
                      {jugador.posicion <= 3 ? (
                        <FaMedal className={`medal-${jugador.posicion}`} />
                      ) : (
                        <span>#{jugador.posicion}</span>
                      )}
                    </div>
                    <div className="leaderboard-nombre">
                      {jugador.nombre || `Jugador ${index + 1}`}
                      {jugador.usuarioId === usuario?.id && <span className="you-badge">Tú</span>}
                    </div>
                    <div className="leaderboard-puntos">
                      {jugador.puntuacion || 0} pts
                    </div>
                    <div className="leaderboard-tiempo">
                      {jugador.tiempoPromedio || '0s'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botón para crear torneo */}
      {!creandoTorneo && usuario && backendDisponible && (
        <div className="crear-torneo-section">
          <button 
            className="btn-crear-torneo"
            onClick={() => setCreandoTorneo(true)}
            disabled={!backendDisponible}
          >
            <FaTrophy style={{ marginRight: '8px' }} />
            Crear Nuevo Torneo
          </button>
          <p className="crear-torneo-info">
            Crea tu propio torneo y reta a otros jugadores
          </p>
        </div>
      )}

      {/* Formulario para crear torneo */}
      {creandoTorneo && (
        <div className="crear-torneo-card">
          <div className="crear-torneo-header">
            <h3>Crear Nuevo Torneo</h3>
            <button 
              className="btn-cerrar-form"
              onClick={() => {
                setCreandoTorneo(false);
                setError('');
              }}
            >
              ×
            </button>
          </div>
          
          <div className="form-group">
            <label>Nombre del Torneo *</label>
            <input
              type="text"
              value={nuevoTorneo.nombre}
              onChange={(e) => setNuevoTorneo({...nuevoTorneo, nombre: e.target.value})}
              placeholder="Ej: Torneo de Historia Colombiana"
              className="form-input"
              required
              disabled={!backendDisponible}
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={nuevoTorneo.descripcion}
              onChange={(e) => setNuevoTorneo({...nuevoTorneo, descripcion: e.target.value})}
              placeholder="Describe el torneo, reglas, temas, etc..."
              className="form-textarea"
              rows="3"
              disabled={!backendDisponible}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Máximo de Participantes *</label>
              <input
                type="number"
                min="2"
                max="100"
                value={nuevoTorneo.maxParticipantes}
                onChange={(e) => setNuevoTorneo({...nuevoTorneo, maxParticipantes: parseInt(e.target.value) || 10})}
                className="form-input"
                required
                disabled={!backendDisponible}
              />
            </div>

            <div className="form-group">
              <label>Duración *</label>
              <select
                value={nuevoTorneo.duracionHoras}
                onChange={(e) => setNuevoTorneo({...nuevoTorneo, duracionHoras: parseInt(e.target.value) || 24})}
                className="form-select"
                required
                disabled={!backendDisponible}
              >
                <option value="1">1 hora</option>
                <option value="3">3 horas</option>
                <option value="6">6 horas</option>
                <option value="12">12 horas</option>
                <option value="24">24 horas</option>
                <option value="72">3 días</option>
                <option value="168">1 semana</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo de Torneo *</label>
              <select
                value={nuevoTorneo.tipo}
                onChange={(e) => setNuevoTorneo({...nuevoTorneo, tipo: e.target.value})}
                className="form-select"
                required
                disabled={!backendDisponible}
              >
                <option value="puntos">Por puntos</option>
                <option value="tiempo">Contra reloj</option>
                <option value="eliminatoria">Eliminatoria</option>
              </select>
            </div>

            <div className="form-group">
              <label>Dificultad *</label>
              <select
                value={nuevoTorneo.dificultad}
                onChange={(e) => setNuevoTorneo({...nuevoTorneo, dificultad: e.target.value})}
                className="form-select"
                required
                disabled={!backendDisponible}
              >
                <option value="mixta">Mixta</option>
                <option value="facil">Fácil</option>
                <option value="medio">Medio</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Categoría (opcional)</label>
            <input
              type="text"
              value={nuevoTorneo.categoria}
              onChange={(e) => setNuevoTorneo({...nuevoTorneo, categoria: e.target.value})}
              placeholder="Ej: Historia, Geografía, Cultura"
              className="form-input"
              disabled={!backendDisponible}
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={nuevoTorneo.esPrivado}
                onChange={(e) => setNuevoTorneo({
                  ...nuevoTorneo, 
                  esPrivado: e.target.checked,
                  codigoAcceso: e.target.checked ? nuevoTorneo.codigoAcceso : ''
                })}
                disabled={!backendDisponible}
              />
              <span>Torneo privado (requiere código de acceso)</span>
            </label>
          </div>

          {nuevoTorneo.esPrivado && (
            <div className="form-group">
              <label>Código de Acceso *</label>
              <input
                type="text"
                value={nuevoTorneo.codigoAcceso}
                onChange={(e) => setNuevoTorneo({...nuevoTorneo, codigoAcceso: e.target.value})}
                placeholder="Ej: HISTORIA2024"
                className="form-input"
                required={nuevoTorneo.esPrivado}
                disabled={!backendDisponible}
              />
              <small className="form-help">Los participantes necesitarán este código para unirse</small>
            </div>
          )}

          <div className="form-actions">
            <button 
              className="btn-cancelar"
              onClick={() => {
                setCreandoTorneo(false);
                setError('');
              }}
              disabled={loadingAccion || !backendDisponible}
            >
              Cancelar
            </button>
            <button 
              className="btn-crear"
              onClick={crearNuevoTorneo}
              disabled={loadingAccion || !backendDisponible}
            >
              {loadingAccion ? (
                <>
                  <FaSpinner className="spinning" style={{ marginRight: '8px' }} />
                  Creando...
                </>
              ) : (
                <>
                  <FaTrophy style={{ marginRight: '8px' }} />
                  Crear Torneo
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Lista de torneos disponibles */}
      <div className="torneos-disponibles">
        <div className="torneos-header-section">
          <h3>
            <MdEmojiEvents style={{ marginRight: '8px' }} />
            Torneos Disponibles
            <span className="torneos-count">({torneos.length})</span>
          </h3>
          <button 
            className="btn-refrescar"
            onClick={cargarTorneosDisponibles}
            disabled={loading || !backendDisponible}
          >
            <FaSync className={loading ? 'spinning' : ''} />
          </button>
        </div>
        
        {torneos.length === 0 ? (
          <div className="no-torneos">
            <FaExclamationTriangle style={{ fontSize: '3rem', color: '#666', marginBottom: '20px' }} />
            <p>No hay torneos disponibles con los filtros seleccionados</p>
            <button 
              className="btn-limpiar-filtros"
              onClick={() => setFiltros({
                estado: '',
                tipo: '',
                dificultad: '',
                categoria: ''
              })}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="torneos-grid">
            {torneos.map((torneo) => (
              <div key={torneo._id} className="torneo-card">
                <div className="torneo-card-header">
                  <h4>{torneo.nombre}</h4>
                  <div className="torneo-header-right">
                    {renderEstadoTorneo(torneo)}
                    {torneo.esPrivado && (
                      <span className="badge badge-privado">
                        <FaLock style={{ marginRight: '3px', fontSize: '0.8rem' }} />
                        Privado
                      </span>
                    )}
                  </div>
                </div>
                
                {torneo.descripcion && (
                  <p className="torneo-descripcion">{torneo.descripcion}</p>
                )}
                
                {torneo.creadorNombre && (
                  <div className="torneo-creador-info">
                    <span className="creador-label">Creado por:</span>
                    <span className="creador-nombre">{torneo.creadorNombre}</span>
                    {torneo.createdAt && (
                      <span className="creador-fecha">{formatearFecha(torneo.createdAt)}</span>
                    )}
                  </div>
                )}
                
                <div className="torneo-info">
                  <div className="info-item-small">
                    <MdTimer />
                    <span>{torneo.tipo === 'tiempo' ? 'Contra reloj' : 'Por puntos'}</span>
                  </div>
                  <div className="info-item-small">
                    <MdGroup />
                    <span>{torneo.participantesActuales || 0}/{torneo.maxParticipantes || 0}</span>
                  </div>
                  <div className="info-item-small">
                    <FaRegClock />
                    <span>{calcularTiempoRestante(torneo.fechaFin)}</span>
                  </div>
                </div>
                
                {torneo.premios && torneo.premios.length > 0 && (
                  <div className="torneo-premios">
                    <FaAward style={{ marginRight: '5px', color: '#FFD700' }} />
                    <span>Premios: </span>
                    {torneo.premios.slice(0, 2).map((premio, idx) => (
                      <span key={idx} className="premio-item">
                        {premio.posicion}°: {premio.premio}
                      </span>
                    ))}
                    {torneo.premios.length > 2 && (
                      <span className="premio-mas">+{torneo.premios.length - 2} más</span>
                    )}
                  </div>
                )}
                
                <div className="torneo-actions">
                  {estaEnTorneo(torneo) ? (
                    <button 
                      className="btn-en-torneo"
                      onClick={() => {
                        setTorneoActivo(torneo);
                        cargarLeaderboard(torneo._id);
                        setMostrarLeaderboard(true);
                      }}
                      disabled={!backendDisponible}
                    >
                      <FaUserFriends style={{ marginRight: '5px' }} />
                      Ya participas
                    </button>
                  ) : (
                    <button 
                      className="btn-unirse"
                      onClick={() => {
                        if (!usuario) {
                          setError('Debes iniciar sesión para unirte a un torneo');
                          return;
                        }
                        
                        if (!backendDisponible) {
                          setError('El backend no está disponible para unirse a torneos');
                          return;
                        }
                        
                        if (torneo.esPrivado) {
                          const codigo = prompt('Ingresa el código de acceso para este torneo:');
                          if (codigo !== null) {
                            unirseTorneo(torneo._id, codigo);
                          }
                        } else {
                          unirseTorneo(torneo._id);
                        }
                      }}
                      disabled={torneo.estado !== 'activo' || loadingAccion || !backendDisponible}
                    >
                      {torneo.estado === 'activo' ? 'Unirse al Torneo' : 'Próximamente'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial de torneos */}
      {misResultados.length > 0 && (
        <div className="historial-torneos">
          <h3>
            <MdLeaderboard style={{ marginRight: '8px' }} />
            Mi Historial de Torneos
          </h3>
          <div className="historial-grid">
            {misResultados.map((resultado, index) => (
              <div key={index} className="historial-card">
                <div className="historial-header">
                  <h5>{resultado.torneoNombre}</h5>
                  {resultado.posicion && (
                    <span className={`posicion-badge posicion-${resultado.posicion}`}>
                      {resultado.posicion}° Lugar
                    </span>
                  )}
                </div>
                <div className="historial-info">
                  <div className="historial-stat">
                    <span className="stat-value">{resultado.puntuacion || 0}</span>
                    <span className="stat-label">Puntos</span>
                  </div>
                  {resultado.fecha && (
                    <div className="historial-fecha">
                      {formatearFecha(resultado.fecha)}
                    </div>
                  )}
                </div>
                {resultado.premios && resultado.premios.length > 0 && (
                  <div className="historial-premios">
                    {resultado.premios.map((premio, idx) => (
                      <span key={idx} className="premio-badge">
                        <FaStar style={{ marginRight: '3px' }} />
                        {premio}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Torneos;