import React, { useState, useEffect } from 'react';
import { personajesAPI } from '../services/api';

// Iconos de Navegación y Acciones
import { 
  FaSearch, 
  FaArrowLeft, 
  FaExternalLinkAlt,
  FaFilter
} from 'react-icons/fa';

// Iconos de Personas y Perfiles
import { 
  FaUserCircle,
  FaBirthdayCake
} from 'react-icons/fa';

// Iconos de Educación y Conocimiento
import { 
  FaBook, 
  FaBookOpen,
  FaGraduationCap,
  FaHistory,
  FaLightbulb
} from 'react-icons/fa';

// Iconos de Logros y Reconocimiento
import { 
  FaTrophy, 
  FaStar,
  FaFlag
} from 'react-icons/fa';

// Iconos de Ubicación y Geografía
import { 
  FaMapMarkerAlt,
  FaGlobe,
  FaGlobeAmericas
} from 'react-icons/fa';

// Iconos de Tiempo y Fechas
import { 
  FaCalendarAlt,
  FaSkullCrossbones
} from 'react-icons/fa';

// Iconos de Citas y Texto
import { 
  FaQuoteRight
} from 'react-icons/fa';

// Iconos de Estado
import { 
  FaSpinner
} from 'react-icons/fa';

const Biografias = () => {
  const [personajes, setPersonajes] = useState([]);
  const [personajeSeleccionado, setPersonajeSeleccionado] = useState(null);
  const [filtros, setFiltros] = useState({
    ambito: '',
    profesion: '',
    busqueda: ''
  });
  const [loading, setLoading] = useState(true);
  const [conteoAmbitos, setConteoAmbitos] = useState({
    '': 0,
    'nacional': 0,
    'latinoamerica': 0,
    'mundial': 0
  });

  useEffect(() => {
    cargarPersonajes();
  }, [filtros]);

  useEffect(() => {
    calcularConteos();
  }, [personajes]);

  const cargarPersonajes = async () => {
    setLoading(true);
    try {
      const data = await personajesAPI.getAll(filtros);
      setPersonajes(data);
    } catch (error) {
      console.error('Error al cargar personajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularConteos = () => {
    const conteos = {
      '': personajes.length,
      'nacional': personajes.filter(p => p.ambito === 'nacional').length,
      'latinoamerica': personajes.filter(p => p.ambito === 'latinoamerica').length,
      'mundial': personajes.filter(p => p.ambito === 'mundial').length
    };
    setConteoAmbitos(conteos);
  };

  const handlePersonajeClick = async (id) => {
    try {
      const data = await personajesAPI.getById(id);
      setPersonajeSeleccionado(data);
    } catch (error) {
      console.error('Error al cargar personaje:', error);
    }
  };

  const calcularEdad = (nacimiento, muerte) => {
    const fechaNac = new Date(nacimiento);
    const fechaMuerte = muerte ? new Date(muerte) : new Date();
    return fechaMuerte.getFullYear() - fechaNac.getFullYear();
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      profesion: '',
      busqueda: ''
    });
  };

  if (personajeSeleccionado) {
    return (
      <div className="biografia-detalle-container">
        <button 
          className="btn-volver"
          onClick={() => setPersonajeSeleccionado(null)}
        >
          <FaArrowLeft /> Volver a la lista
        </button>

        <div className="biografia-header">
          <div className="biografia-imagen-principal">
            {personajeSeleccionado.imagen ? (
              <img src={personajeSeleccionado.imagen} alt={personajeSeleccionado.nombre} />
            ) : (
              <div className="sin-imagen">
                <FaUserCircle />
              </div>
            )}
          </div>

          <div className="biografia-info-principal">
            <h1>{personajeSeleccionado.nombre}</h1>
            {personajeSeleccionado.nombreCompleto && (
              <p className="nombre-completo">{personajeSeleccionado.nombreCompleto}</p>
            )}

            <div className="biografia-fechas">
              <span className="fecha-nacimiento">
                <FaBirthdayCake /> {formatearFecha(personajeSeleccionado.fechaNacimiento)}
              </span>
              {personajeSeleccionado.fechaMuerte && (
                <>
                  <span className="separador">-</span>
                  <span className="fecha-muerte">
                    <FaSkullCrossbones /> {formatearFecha(personajeSeleccionado.fechaMuerte)}
                  </span>
                  <span className="edad">
                    ({calcularEdad(personajeSeleccionado.fechaNacimiento, personajeSeleccionado.fechaMuerte)} años)
                  </span>
                </>
              )}
            </div>

            <div className="biografia-lugar">
              <FaMapMarkerAlt /> {personajeSeleccionado.lugarNacimiento}
            </div>

            <div className="biografia-profesiones">
              {personajeSeleccionado.profesiones.map((prof, idx) => (
                <span key={idx} className="profesion-badge">
                  <FaGraduationCap /> {prof}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="biografia-contenido">
          <section className="biografia-seccion">
            <h2><FaBook /> Biografía</h2>
            <p className="biografia-texto">{personajeSeleccionado.biografia}</p>
          </section>

          {personajeSeleccionado.cronologia && personajeSeleccionado.cronologia.length > 0 && (
            <section className="biografia-seccion">
              <h2><FaCalendarAlt /> Cronología</h2>
              <div className="cronologia">
                {personajeSeleccionado.cronologia.map((item, idx) => (
                  <div key={idx} className="cronologia-item">
                    <div className="cronologia-año">{item.año}</div>
                    <div className="cronologia-contenido">
                      <h4>{item.evento}</h4>
                      <p>{item.descripcion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {personajeSeleccionado.logrosDestacados && personajeSeleccionado.logrosDestacados.length > 0 && (
            <section className="biografia-seccion">
              <h2><FaTrophy /> Logros Destacados</h2>
              <ul className="logros-lista">
                {personajeSeleccionado.logrosDestacados.map((logro, idx) => (
                  <li key={idx}>{logro}</li>
                ))}
              </ul>
            </section>
          )}

          {personajeSeleccionado.frasesCelebres && personajeSeleccionado.frasesCelebres.length > 0 && (
            <section className="biografia-seccion">
              <h2><FaQuoteRight /> Frases Célebres</h2>
              <div className="frases-lista">
                {personajeSeleccionado.frasesCelebres.map((item, idx) => (
                  <div key={idx} className="frase-item">
                    <blockquote>"{item.frase}"</blockquote>
                    <cite>- {item.contexto}</cite>
                  </div>
                ))}
              </div>
            </section>
          )}

          {personajeSeleccionado.legado && (
            <section className="biografia-seccion">
              <h2><FaStar /> Legado</h2>
              <p className="legado-texto">{personajeSeleccionado.legado}</p>
            </section>
          )}

          {personajeSeleccionado.fuentes && personajeSeleccionado.fuentes.length > 0 && (
            <section className="biografia-seccion">
              <h2><FaBookOpen /> Fuentes y Referencias</h2>
              <ul className="fuentes-lista">
                {personajeSeleccionado.fuentes.map((fuente, idx) => (
                  <li key={idx}>
                    <a href={fuente} target="_blank" rel="noopener noreferrer">
                      <FaExternalLinkAlt /> {fuente}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <style jsx>{`
          .biografia-detalle-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }

          .btn-volver {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: #1e293b;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1em;
            cursor: pointer;
            margin-bottom: 30px;
            transition: background 0.3s;
          }

          .btn-volver:hover {
            background: #5a67d8;
          }

          .biografia-header {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 40px;
            margin-bottom: 40px;
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }

          .biografia-imagen-principal {
            width: 100%;
            height: 400px;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          }

          .biografia-imagen-principal img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .sin-imagen {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f0f0;
            font-size: 8em;
            color: #1e293b;
          }

          .biografia-info-principal h1 {
            font-size: 2.5em;
            color: #333;
            margin-bottom: 10px;
          }

          .nombre-completo {
            color: #666;
            font-size: 1.1em;
            margin-bottom: 20px;
          }

          .biografia-fechas {
            display: flex;
            gap: 10px;
            align-items: center;
            margin-bottom: 15px;
            font-size: 1.1em;
          }

          .biografia-fechas svg {
            margin-right: 5px;
            color: #1e293b;
          }

          .separador {
            color: #999;
          }

          .edad {
            color: #666;
            font-style: italic;
          }

          .biografia-lugar {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 1.1em;
            color: #555;
            margin-bottom: 20px;
          }

          .biografia-lugar svg {
            color: #e53e3e;
          }

          .biografia-profesiones {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .profesion-badge {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 8px 16px;
            background: linear-gradient(135deg, #1e293b 0%, #764ba2 100%);
            color: white;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 600;
          }

          .biografia-contenido {
            display: flex;
            flex-direction: column;
            gap: 30px;
          }

          .biografia-seccion {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }

          .biografia-seccion h2 {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.8em;
            color: #333;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #1e293b;
          }

          .biografia-seccion h2 svg {
            color: #1e293b;
          }

          .biografia-texto, .legado-texto {
            font-size: 1.1em;
            line-height: 1.8;
            color: #444;
            text-align: justify;
          }

          .cronologia {
            position: relative;
            padding-left: 40px;
          }

          .cronologia::before {
            content: '';
            position: absolute;
            left: 15px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #1e293b;
          }

          .cronologia-item {
            display: grid;
            grid-template-columns: 80px 1fr;
            gap: 20px;
            margin-bottom: 30px;
            position: relative;
          }

          .cronologia-item::before {
            content: '';
            position: absolute;
            left: -32px;
            top: 5px;
            width: 12px;
            height: 12px;
            background: #1e293b;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 0 2px #1e293b;
          }

          .cronologia-año {
            font-size: 1.3em;
            font-weight: bold;
            color: #1e293b;
          }

          .cronologia-contenido h4 {
            font-size: 1.2em;
            color: #333;
            margin-bottom: 8px;
          }

          .cronologia-contenido p {
            color: #666;
            line-height: 1.6;
          }

          .logros-lista {
            list-style: none;
            padding: 0;
          }

          .logros-lista li {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px;
            margin-bottom: 10px;
            background: #f8f9fa;
            border-left: 4px solid #1e293b;
            border-radius: 5px;
            font-size: 1.05em;
            line-height: 1.6;
          }

          .logros-lista li:before {
            content: '✓';
            color: #1e293b;
            font-weight: bold;
          }

          .frases-lista {
            display: flex;
            flex-direction: column;
            gap: 25px;
          }

          .frase-item {
            padding: 25px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-left: 5px solid #1e293b;
            border-radius: 10px;
          }

          .frase-item blockquote {
            font-size: 1.3em;
            font-style: italic;
            color: #333;
            margin: 0 0 10px 0;
            line-height: 1.6;
          }

          .frase-item cite {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #666;
            font-size: 0.95em;
          }

          .fuentes-lista {
            list-style: none;
            padding: 0;
          }

          .fuentes-lista li {
            margin-bottom: 10px;
          }

          .fuentes-lista a {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #1e293b;
            text-decoration: none;
            word-break: break-all;
            transition: color 0.3s;
          }

          .fuentes-lista a:hover {
            color: #5a67d8;
            text-decoration: underline;
          }

          @media (max-width: 768px) {
            .biografia-header {
              grid-template-columns: 1fr;
            }

            .biografia-imagen-principal {
              height: 300px;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="biografias-container">
      <div className="biografias-header">
        <h1><FaUserCircle /> Personajes Históricos</h1>
        <p>Descubre las vidas de quienes marcaron la historia</p>
      </div>

      <div className="biografias-filtros">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar personaje..."
            value={filtros.busqueda}
            onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
            className="search-input"
          />
        </div>

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
          <FaSpinner className="spinner" />
          Cargando personajes...
        </div>
      ) : (
        <div className="personajes-grid">
          {personajes.length === 0 ? (
            <div className="no-resultados">
              <p>No se encontraron personajes con estos filtros</p>
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
            personajes.map(personaje => (
              <div
                key={personaje._id}
                className="personaje-card"
                onClick={() => handlePersonajeClick(personaje._id)}
              >
                <div className="personaje-imagen">
                  {personaje.imagen ? (
                    <img src={personaje.imagen} alt={personaje.nombre} />
                  ) : (
                    <div className="sin-imagen">
                      <FaUserCircle />
                    </div>
                  )}
                </div>

                <div className="personaje-info">
                  <h3>{personaje.nombre}</h3>
                  
                  <div className="personaje-fechas">
                    <FaCalendarAlt /> {new Date(personaje.fechaNacimiento).getFullYear()}
                    {personaje.fechaMuerte && (
                      <> - {new Date(personaje.fechaMuerte).getFullYear()}</>
                    )}
                  </div>

                  <div className="personaje-profesiones">
                    {personaje.profesiones.slice(0, 2).map((prof, idx) => (
                      <span key={idx} className="profesion-tag">
                        <FaGraduationCap /> {prof}
                      </span>
                    ))}
                  </div>

                  <div className="personaje-ambito">
                    {personaje.ambito === 'nacional' && (
                      <>
                        <FaFlag /> Colombia
                      </>
                    )}
                    {personaje.ambito === 'latinoamerica' && (
                      <>
                        <FaGlobeAmericas /> Latinoamérica
                      </>
                    )}
                    {personaje.ambito === 'mundial' && (
                      <>
                        <FaGlobe /> Mundial
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <style jsx>{`
        .biografias-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .biografias-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .biografias-header h1 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          font-size: 2em;
          color: #1e293b;
          margin-bottom: 10px;
        }

        .biografias-header h1 svg {
          color: #1e293b;
        }

        .biografias-header p {
          color: #666;
          font-size: 1.1em;
        }

        .biografias-filtros {
          display: flex;
          flex-direction: column;
          gap: 25px;
          margin-bottom: 30px;
        }

        .search-container {
          display: flex;
          align-items: center;
          position: relative;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          color: #1e293b;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 15px 20px 15px 45px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 1em;
          transition: all 0.3s;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .search-input:focus {
          outline: none;
          border-color: #1e293b;
          box-shadow: 0 4px 10px rgba(102, 126, 234, 0.2);
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
          background: linear-gradient(135deg, #1e293b 0%, #271837ff 100%);
          color: white;
          border-color: #1e293b;
        }

        .ambito-btn.activo:hover:not(:disabled) {
          background: linear-gradient(135deg, #515151ff 0%, #1e293b 100%);
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

        .personajes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
        }

        .personaje-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.3s;
        }

        .personaje-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .personaje-imagen {
          width: 100%;
          height: 300px;
          overflow: hidden;
        }

        .personaje-imagen img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .personaje-card:hover .personaje-imagen img {
          transform: scale(1.1);
        }

        .sin-imagen {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #31343eff 0%, #1e293b 100%);
          font-size: 5em;
          color: white;
        }

        .personaje-info {
          padding: 20px;
        }

        .personaje-info h3 {
          font-size: 1.3em;
          color: #333;
          margin-bottom: 10px;
        }

        .personaje-fechas {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          margin-bottom: 12px;
          font-size: 0.95em;
        }

        .personaje-fechas svg {
          color: #1e293b;
        }

        .personaje-profesiones {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }

        .profesion-tag {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          background: #e9ecef;
          color: #495057;
          border-radius: 15px;
          font-size: 0.85em;
        }

        .personaje-ambito {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #1e293b;
          font-size: 0.9em;
          font-weight: 600;
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
          animation: spin 1s linear infinite;
          font-size: 2em;
          color: #1e293b;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .biografias-header h1 {
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
        }
      `}</style>
    </div>
  );
};

export default Biografias;