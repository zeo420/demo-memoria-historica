import React, { useState, useEffect } from 'react';
import { narrativasAPI } from '../services/api';

// Importar iconos necesarios
import {
  FaBook,
  FaTimes,
  FaHeadphones,
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaFlag,
  FaGlobe,
  FaGlobeAmericas,
  FaFilter,
  FaClock,
  FaFileAlt
} from 'react-icons/fa';

const Narrativas = () => {
  const [narrativas, setNarrativas] = useState([]);
  const [narrativaActual, setNarrativaActual] = useState(null);
  const [capituloActual, setCapituloActual] = useState(0);
  const [filtros, setFiltros] = useState({
    ambito: '',
    categoria: ''
  });
  const [loading, setLoading] = useState(true);
  const [conteoAmbitos, setConteoAmbitos] = useState({
    '': 0,
    'nacional': 0,
    'latinoamerica': 0,
    'mundial': 0
  });

  useEffect(() => {
    cargarNarrativas();
  }, [filtros]);

  useEffect(() => {
    calcularConteos();
  }, [narrativas]);

  const cargarNarrativas = async () => {
    setLoading(true);
    try {
      const data = await narrativasAPI.getAll(filtros);
      setNarrativas(data);
    } catch (error) {
      console.error('Error al cargar narrativas:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularConteos = () => {
    const conteos = {
      '': narrativas.length,
      'nacional': narrativas.filter(n => n.ambito === 'nacional').length,
      'latinoamerica': narrativas.filter(n => n.ambito === 'latinoamerica').length,
      'mundial': narrativas.filter(n => n.ambito === 'mundial').length
    };
    setConteoAmbitos(conteos);
  };

  const handleNarrativaClick = async (id) => {
    try {
      const data = await narrativasAPI.getById(id);
      setNarrativaActual(data);
      setCapituloActual(data.progresoUsuario?.ultimoCapitulo || 0);
    } catch (error) {
      console.error('Error al cargar narrativa:', error);
    }
  };

  const handleCompletarCapitulo = async () => {
    try {
      await narrativasAPI.actualizarProgreso(narrativaActual._id, capituloActual + 1);
      
      if (capituloActual < narrativaActual.capitulos.length - 1) {
        setCapituloActual(capituloActual + 1);
      }
    } catch (error) {
      console.error('Error al actualizar progreso:', error);
    }
  };

  const calcularProgreso = (narrativa) => {
    const completados = narrativa.progresoUsuario?.capitulosCompletados?.length || 0;
    const total = narrativa.capitulos?.length || 1;
    return Math.round((completados / total) * 100);
  };

  const ambitos = [
    { valor: '', etiqueta: 'Todos', icono: <FaFilter />, activo: filtros.ambito === '' },
    { valor: 'nacional', etiqueta: 'Colombia', icono: <FaFlag />, activo: filtros.ambito === 'nacional' },
    { valor: 'latinoamerica', etiqueta: 'Latinoamérica', icono: <FaGlobeAmericas />, activo: filtros.ambito === 'latinoamerica' },
    { valor: 'mundial', etiqueta: 'Mundial', icono: <FaGlobe />, activo: filtros.ambito === 'mundial' }
  ];

  const handleAmbitoClick = (ambito) => {
    setFiltros({
      ...filtros,
      ambito: filtros.ambito === ambito ? '' : ambito
    });
  };

  const limpiarFiltros = () => {
    setFiltros({
      ambito: '',
      categoria: ''
    });
  };

  if (narrativaActual) {
    const capitulo = narrativaActual.capitulos[capituloActual];
    const progreso = Math.round(((capituloActual + 1) / narrativaActual.capitulos.length) * 100);

    return (
      <div className="narrativa-lectura">
        <div className="narrativa-controles">
          <button 
            className="btn-cerrar"
            onClick={() => {
              setNarrativaActual(null);
              setCapituloActual(0);
            }}
          >
            <FaTimes /> Cerrar
          </button>

          <div className="narrativa-progreso">
            <span>Capítulo {capitulo.numero} de {narrativaActual.capitulos.length}</span>
            <div className="barra-progreso">
              <div className="barra-fill" style={{ width: `${progreso}%` }}></div>
            </div>
            <span>{progreso}% completado</span>
          </div>
        </div>

        <div className="narrativa-contenido">
          <div className="capitulo-header">
            <span className="capitulo-numero">
              <FaBook /> Capítulo {capitulo.numero}
            </span>
            <h1>{capitulo.titulo}</h1>
          </div>

          {capitulo.imagenes && capitulo.imagenes.length > 0 && (
            <div className="capitulo-imagenes">
              {capitulo.imagenes.map((img, idx) => (
                <img key={idx} src={img} alt={`Ilustración ${idx + 1}`} />
              ))}
            </div>
          )}

          <div className="capitulo-texto">
            {capitulo.contenido.split('\n\n').map((parrafo, idx) => (
              <p key={idx}>{parrafo}</p>
            ))}
          </div>

          {capitulo.audioUrl && (
            <div className="capitulo-audio">
              <h3><FaHeadphones /> Escuchar este capítulo</h3>
              <audio controls src={capitulo.audioUrl}>
                Tu navegador no soporta audio HTML5.
              </audio>
            </div>
          )}

          {capitulo.preguntas && capitulo.preguntas.length > 0 && (
            <div className="capitulo-preguntas">
              <h3>Reflexiona sobre lo leído</h3>
              {capitulo.preguntas.map((pregunta, idx) => (
                <div key={idx} className="pregunta-interactiva">
                  <p className="pregunta-texto">{pregunta.pregunta}</p>
                  <div className="pregunta-opciones">
                    {pregunta.opciones.map((opcion, optIdx) => (
                      <button key={optIdx} className="opcion-btn">
                        {opcion}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="capitulo-navegacion">
            {capituloActual > 0 && (
              <button 
                className="btn-anterior"
                onClick={() => setCapituloActual(capituloActual - 1)}
              >
                <FaArrowLeft /> Capítulo Anterior
              </button>
            )}

            {capituloActual < narrativaActual.capitulos.length - 1 ? (
              <button 
                className="btn-siguiente"
                onClick={handleCompletarCapitulo}
              >
                Siguiente Capítulo <FaArrowRight />
              </button>
            ) : (
              <button 
                className="btn-finalizar"
                onClick={() => {
                  handleCompletarCapitulo();
                  alert('¡Felicitaciones! Has completado esta narrativa');
                  setNarrativaActual(null);
                }}
              >
                <FaCheck /> Finalizar Narrativa
              </button>
            )}
          </div>
        </div>

        <style jsx>{`
          .narrativa-lectura {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
          }

          .narrativa-controles {
            background: white;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .btn-cerrar {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            transition: background 0.3s;
            align-self: flex-start;
          }

          .btn-cerrar:hover {
            background: #c82333;
          }

          .narrativa-progreso {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
          }

          .narrativa-progreso span {
            color: #666;
            font-size: 0.9em;
            white-space: nowrap;
          }

          .barra-progreso {
            flex: 1;
            height: 10px;
            background: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            min-width: 200px;
          }

          .barra-fill {
            height: 100%;
            background: linear-gradient(90deg, #1e293b 0%, #764ba2 100%);
            transition: width 0.3s;
          }

          .narrativa-contenido {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            line-height: 1.8;
          }

          .capitulo-header {
            margin-bottom: 30px;
            border-bottom: 3px solid #1e293b;
            padding-bottom: 20px;
          }

          .capitulo-numero {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #1e293b;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 600;
            margin-bottom: 15px;
            width: fit-content;
          }

          .capitulo-header h1 {
            font-size: 1.8em;
            color: #333;
            margin: 10px 0 0 0;
          }

          .capitulo-imagenes {
            margin: 30px 0;
            display: grid;
            gap: 15px;
          }

          .capitulo-imagenes img {
            width: 100%;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }

          .capitulo-texto {
            font-size: 1.15em;
            color: #333;
            text-align: justify;
          }

          .capitulo-texto p {
            margin-bottom: 20px;
          }

          .capitulo-audio {
            margin: 40px 0;
            padding: 25px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 5px solid #1e293b;
          }

          .capitulo-audio h3 {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 0 0 15px 0;
            color: #333;
          }

          .capitulo-audio audio {
            width: 100%;
          }

          .capitulo-preguntas {
            margin: 40px 0;
            padding: 25px;
            background: #fff3cd;
            border-radius: 10px;
            border-left: 5px solid #ffc107;
          }

          .capitulo-preguntas h3 {
            margin: 0 0 20px 0;
            color: #333;
          }

          .pregunta-interactiva {
            margin-bottom: 25px;
          }

          .pregunta-texto {
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
            font-size: 1.1em;
          }

          .pregunta-opciones {
            display: grid;
            gap: 10px;
          }

          .opcion-btn {
            padding: 15px;
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            text-align: left;
            cursor: pointer;
            transition: all 0.3s;
          }

          .opcion-btn:hover {
            border-color: #1e293b;
            transform: translateX(5px);
          }

          .capitulo-navegacion {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid #e0e0e0;
            gap: 15px;
          }

          .btn-anterior, .btn-siguiente, .btn-finalizar {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
          }

          .btn-anterior {
            background: #6c757d;
            color: white;
          }

          .btn-siguiente, .btn-finalizar {
            background: linear-gradient(135deg, #1e293b 0%, #764ba2 100%);
            color: white;
          }

          .btn-anterior:hover, .btn-siguiente:hover, .btn-finalizar:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          }

          @media (max-width: 768px) {
            .narrativa-contenido {
              padding: 20px;
            }

            .capitulo-header h1 {
              font-size: 1.8em;
            }

            .capitulo-texto {
              font-size: 1em;
            }

            .capitulo-navegacion {
              flex-direction: column;
            }

            .btn-anterior, .btn-siguiente, .btn-finalizar {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="narrativas-container">
      <div className="narrativas-header">
        <h1><FaBook /> Narrativas Interactivas</h1>
        <p>Sumérgete en historias detalladas de eventos y épocas históricas</p>
      </div>

      <div className="narrativas-filtros">
        <div className="filtros-ambitos">
          <div className="filtros-header">
            <h3><FaFilter /> Filtrar por ámbito:</h3>
            {filtros.ambito && (
              <button 
                className="btn-limpiar"
                onClick={limpiarFiltros}
              >
                Limpiar filtros
              </button>
            )}
          </div>
          
          <div className="ambitos-botones">
            {ambitos.map((ambito) => {
              const conteo = conteoAmbitos[ambito.valor] || 0;
              const mostrarContador = filtros.ambito === ambito.valor || filtros.ambito === '';
              
              return (
                <button
                  key={ambito.valor}
                  className={`ambito-btn ${ambito.activo ? 'activo' : ''}`}
                  onClick={() => handleAmbitoClick(ambito.valor)}
                  disabled={mostrarContador && conteo === 0}
                >
                  <span className="ambito-icon">{ambito.icono}</span>
                  <span className="ambito-texto">{ambito.etiqueta}</span>
                  {mostrarContador && conteo > 0 && (
                    <span className={`ambito-contador ${ambito.activo ? 'activo' : ''}`}>
                      {conteo}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          Cargando narrativas...
        </div>
      ) : (
        <div className="narrativas-grid">
          {narrativas.length === 0 ? (
            <div className="no-resultados">
              <p>No se encontraron narrativas con estos filtros</p>
              {filtros.ambito && (
                <button 
                  className="btn-limpiar-grande"
                  onClick={limpiarFiltros}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            narrativas.map(narrativa => {
              const progresoUsuario = calcularProgreso(narrativa);
              
              return (
                <div
                  key={narrativa._id}
                  className="narrativa-card"
                  onClick={() => handleNarrativaClick(narrativa._id)}
                >
                  <div className="narrativa-imagen">
                    {narrativa.imagen ? (
                      <img src={narrativa.imagen} alt={narrativa.titulo} />
                    ) : (
                      <div className="sin-imagen">
                        <FaBook />
                      </div>
                    )}
                    
                    {progresoUsuario > 0 && (
                      <div className="progreso-badge">
                        {progresoUsuario}% completado
                      </div>
                    )}
                  </div>

                  <div className="narrativa-info">
                    <h3>{narrativa.titulo}</h3>
                    {narrativa.subtitulo && (
                      <p className="subtitulo">{narrativa.subtitulo}</p>
                    )}
                    <p className="descripcion">{narrativa.descripcionCorta}</p>

                    <div className="narrativa-meta">
                      <span className="capitulos">
                        <FaFileAlt /> {narrativa.capitulos.length} capítulos
                      </span>
                      <span className="duracion">
                        <FaClock /> {narrativa.duracionEstimada} min
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <style jsx>{`
        .narrativas-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .narrativas-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .narrativas-header h1 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          font-size: 2em;
          color: #1e293b;
          margin-bottom: 10px;
        }

        .narrativas-header h1 svg {
          color: #1e293b;
        }

        .narrativas-header p {
          color: #666;
          font-size: 1.1em;
        }

        .narrativas-filtros {
          margin-bottom: 30px;
        }

        .filtros-ambitos {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .filtros-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .filtros-header h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #333;
          font-size: 1.2em;
          margin: 0;
        }

        .filtros-header h3 svg {
          color: #1e293b;
        }

        .btn-limpiar {
          padding: 8px 16px;
          background: #f8f9fa;
          color: #495057;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          font-size: 0.9em;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-limpiar:hover {
          background: #e9ecef;
          border-color: #adb5bd;
        }

        .ambitos-botones {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .ambito-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          background: white;
          color: #495057;
          border: 2px solid #dee2e6;
          border-radius: 10px;
          font-size: 1em;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          min-width: 140px;
          justify-content: center;
        }

        .ambito-btn:hover:not(:disabled) {
          border-color: #1e293b;
          background: #f8f9fa;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(102, 126, 234, 0.1);
        }

        .ambito-btn.activo {
          background: linear-gradient(135deg, #1e293b 0%, #432a5dff 100%);
          color: white;
          border-color: #1e293b;
        }

        .ambito-btn.activo:hover:not(:disabled) {
          background: linear-gradient(135deg, #626262ff 0%, #1e293b 100%);
        }

        .ambito-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ambito-icon {
          font-size: 1.2em;
        }

        .ambito-texto {
          font-weight: 600;
        }

        .ambito-contador {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #6c757d;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8em;
          font-weight: bold;
          transition: all 0.3s;
        }

        .ambito-contador.activo {
          background: #10b981;
          transform: scale(1.1);
        }

        .total-resultados {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          text-align: center;
          font-size: 0.95em;
          color: #495057;
          border-top: 2px solid #e9ecef;
        }

        .total-resultados strong {
          color: #1e293b;
        }

        .narrativas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
        }

        .narrativa-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.3s;
        }

        .narrativa-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .narrativa-imagen {
          width: 100%;
          height: 200px;
          position: relative;
          overflow: hidden;
        }

        .narrativa-imagen img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .narrativa-card:hover .narrativa-imagen img {
          transform: scale(1.1);
        }

        .sin-imagen {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1e293b 0%, #42275dff 100%);
          font-size: 4em;
          color: white;
        }

        .progreso-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 8px 15px;
          border-radius: 20px;
          font-size: 0.85em;
          font-weight: 600;
        }

        .narrativa-info {
          padding: 20px;
        }

        .narrativa-info h3 {
          font-size: 1.4em;
          color: #333;
          margin-bottom: 8px;
        }

        .subtitulo {
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 10px;
          font-size: 0.95em;
        }

        .descripcion {
          color: #666;
          line-height: 1.6;
          margin-bottom: 15px;
        }

        .narrativa-meta {
          display: flex;
          gap: 20px;
          font-size: 0.9em;
          color: #999;
        }

        .narrativa-meta span {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .loading, .no-resultados {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px;
          color: #999;
          font-size: 1.2em;
          gap: 15px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .btn-limpiar-grande {
          padding: 12px 24px;
          background: #1e293b;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1em;
          cursor: pointer;
          transition: background 0.3s;
          margin-top: 20px;
        }

        .btn-limpiar-grande:hover {
          background: #1e293b;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #1e293b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .narrativas-header h1 {
            flex-direction: column;
            gap: 10px;
          }
          
          .ambitos-botones {
            justify-content: center;
          }
          
          .ambito-btn {
            min-width: 120px;
            flex: 1;
          }
          
          .filtros-header {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }
          
          .btn-limpiar {
            align-self: flex-start;
          }
        }

        @media (max-width: 480px) {
          .ambitos-botones {
            flex-direction: column;
          }
          
          .ambito-btn {
            width: 100%;
          }
          
          .narrativas-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Narrativas;