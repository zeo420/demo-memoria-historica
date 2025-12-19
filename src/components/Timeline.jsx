import React, { useState, useMemo, useEffect } from 'react';
import { eventos } from '../data/historiaColombia';
import { motion } from 'framer-motion';
import {
  FaPeace,
  FaBook,
  FaMapMarkerAlt,
  FaCompass,
  FaTimes,
  FaFilter,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { GiCrossedSwords, GiScrollUnfurled } from 'react-icons/gi';

const iconoPorEvento = (titulo) => {
  const t = titulo.toLowerCase();
  if (t.includes('paz')) return <FaPeace size={24} color="#067911ff" />;
  if (t.includes('guerra') || t.includes('batalla')) return <GiCrossedSwords size={24} color="#920909ff" />;
  if (t.includes('independencia')) return <GiScrollUnfurled size={24} color="#0f0893ff" />;
  if (t.includes('constitución') || t.includes('ley')) return <FaBook size={24} color="#8e4e05ff" />;
  return <FaMapMarkerAlt size={24} color="#a4ac0aff" />;
};

const Timeline = () => {
  // Obtener años mínimo y máximo
  const years = eventos.map(e => parseInt(e.fecha.split('-')[0]));
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  // Estados del filtro
  const [desde, setDesde] = useState(minYear);
  const [hasta, setHasta] = useState(maxYear);
  const [busqueda, setBusqueda] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [eventosPorPagina] = useState(4);
  const [paginaActual, setPaginaActual] = useState(0);

  // Filtrar eventos por rango y búsqueda
  const eventosFiltrados = useMemo(() => {
    return eventos
      .filter(ev => {
        const year = parseInt(ev.fecha.split('-')[0]);
        const enRango = year >= desde && year <= hasta;
        const coincideBusqueda =
          busqueda === '' ||
          ev.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
          ev.descripcion.toLowerCase().includes(busqueda.toLowerCase());

        return enRango && coincideBusqueda;
      })
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }, [desde, hasta, busqueda]);

  // Paginación
  const totalPaginas = Math.ceil(eventosFiltrados.length / eventosPorPagina);
  const eventosPaginados = eventosFiltrados.slice(
    paginaActual * eventosPorPagina,
    (paginaActual + 1) * eventosPorPagina
  );

  // Actualizar página cuando cambia el filtro
  useEffect(() => {
    setPaginaActual(0);
  }, [desde, hasta, busqueda]);

  const limpiarFiltro = () => {
    setDesde(minYear);
    setHasta(maxYear);
    setBusqueda('');
    setPaginaActual(0);
  };

  const moverSlider = (tipo, valor) => {
    if (tipo === 'desde') {
      const nuevoValor = Math.min(valor, hasta - 1);
      setDesde(nuevoValor);
    } else {
      const nuevoValor = Math.max(valor, desde + 1);
      setHasta(nuevoValor);
    }
  };

  const handlePaginaAnterior = () => {
    setPaginaActual(prev => Math.max(0, prev - 1));
  };

  const handlePaginaSiguiente = () => {
    setPaginaActual(prev => Math.min(totalPaginas - 1, prev + 1));
  };

  const saltarADecada = (decada) => {
    const inicio = Math.max(minYear, decada);
    const fin = Math.min(maxYear, decada + 9);
    setDesde(inicio);
    setHasta(fin);
  };

  return (

    <div >
      <h2 style={{
        textAlign: 'center',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <FaCompass color="#2c3e50" />
        Línea de Tiempo Histórica Colombiana
      </h2>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto 2rem',
        background: 'linear-gradient(135deg, #f4f4f4 0%, #e9ecef 100%)',
        padding: '1.5rem',
        borderRadius: '15px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => setShowFilter(!showFilter)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            background: '#3c3f68ff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <FaFilter /> {showFilter ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>

        {showFilter && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Buscar por título o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCalendarAlt color="#585858ff" />
                  <span style={{ fontWeight: 'bold' }}>Rango de años: {desde} - {hasta}</span>
                </div>
                <button
                  onClick={limpiarFiltro}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'transparent',
                    border: '2px solid #ef4444',
                    color: '#ef4444',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Limpiar filtros
                </button>
              </div>

              <div style={{ position: 'relative', padding: '0.5rem 0' }}>
                <div style={{
                  height: '6px',
                  background: '#ddd',
                  borderRadius: '3px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: `${((desde - minYear) / (maxYear - minYear)) * 100}%`,
                    right: `${100 - ((hasta - minYear) / (maxYear - minYear)) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(135deg, #09008aff 0%, #a70000ff 100%)',
                    borderRadius: '3px'
                  }} />
                </div>

                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  value={desde}
                  onChange={(e) => moverSlider('desde', parseInt(e.target.value))}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    top: '0',
                    left: '0',
                    height: '6px',
                    opacity: '0',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  value={hasta}
                  onChange={(e) => moverSlider('hasta', parseInt(e.target.value))}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    top: '0',
                    left: '0',
                    height: '6px',
                    opacity: '0',
                    cursor: 'pointer'
                  }}
                />

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  color: '#666'
                }}>
                  <span>{minYear}</span>
                  <span>{Math.round((maxYear + minYear) / 2)}</span>
                  <span>{maxYear}</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '1rem'
              }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Desde:
                  </label>
                  <input
                    type="number"
                    value={desde}
                    min={minYear}
                    max={hasta}
                    onChange={(e) => moverSlider('desde', parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: '2px solid #ddd'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Hasta:
                  </label>
                  <input
                    type="number"
                    value={hasta}
                    min={desde}
                    max={maxYear}
                    onChange={(e) => moverSlider('hasta', parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: '2px solid #ddd'
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem',
          background: 'rgba(108, 99, 255, 0.1)',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <div>
            <strong>{eventosFiltrados.length}</strong> eventos encontrados
          </div>
          <div>
            Mostrando {eventosPorPagina} por página
          </div>
        </div>
      </div>

      <div>
        {eventosFiltrados.length > eventosPorPagina && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            maxWidth: '800px',
            margin: '0 auto 1.5rem'
          }}>
            <button
              onClick={handlePaginaAnterior}
              disabled={paginaActual === 0}
              style={{
                padding: '0.75rem 1.5rem',
                background: paginaActual === 0 ? '#e0e0e0' : '#1c1a43ff',
                color: paginaActual === 0 ? '#666' : 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: paginaActual === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FaChevronLeft /> Anterior
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontWeight: 'bold' }}>
                Página {paginaActual + 1} de {totalPaginas}
              </span>
              <select
                value={paginaActual}
                onChange={(e) => setPaginaActual(parseInt(e.target.value))}
                style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '2px solid #ddd'
                }}
              >
                {Array.from({ length: totalPaginas }, (_, i) => (
                  <option key={i} value={i}>
                    Página {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePaginaSiguiente}
              disabled={paginaActual === totalPaginas - 1}
              style={{
                padding: '0.75rem 1.5rem',
                background: paginaActual === totalPaginas - 1 ? '#e0e0e0' : '#1c1a43ff',
                color: paginaActual === totalPaginas - 1 ? '#666' : 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: paginaActual === totalPaginas - 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Siguiente <FaChevronRight />
            </button>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {eventosPaginados.length ? eventosPaginados.map((evento, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '12px',
                borderTop: '5px solid #bf0606ff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}
              whileHover={{ transform: 'translateY(-5px)' }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                {iconoPorEvento(evento.titulo)}
                <div>
                  <h4 style={{ color: '#5c5c5dff', margin: 0 }}>{evento.fecha}</h4>
                  <strong style={{ fontSize: '1.1rem' }}>{evento.titulo}</strong>
                </div>
              </div>
              <p style={{
                fontSize: '0.95rem',
                lineHeight: '1.5',
                color: '#555'
              }}>
                {evento.descripcion}
              </p>
            </motion.div>
          )) : (
            <div style={{
              textAlign: 'center',
              width: '100%',
              padding: '3rem',
              gridColumn: '1 / -1'
            }}>
              <FaTimes size={60} color="#ef4444" />
              <h3 style={{ margin: '1rem 0', color: '#666' }}>No hay eventos</h3>
              <p style={{ color: '#888' }}>
                No se encontraron eventos que coincidan con los criterios de búsqueda.
              </p>
              <button
                onClick={limpiarFiltro}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  background: '#6c63ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Ver todos los eventos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;