import React, { useState } from 'react';
import { eventos } from '../data/historiaColombia';
import { motion } from 'framer-motion';

const iconoPorEvento = (titulo) => {
  if (titulo.toLowerCase().includes('paz')) return '🕊️';
  if (titulo.toLowerCase().includes('conflicto')) return '⚔️';
  if (titulo.toLowerCase().includes('independencia')) return '📜';
  if (titulo.toLowerCase().includes('constitución')) return '📘';
  return '📍';
};

const Timeline = () => {
  const [filtroFecha, setFiltroFecha] = useState('');

  const eventosFiltrados = eventos
    .filter(ev => ev.fecha.includes(filtroFecha))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>🧭 Línea de Tiempo Histórica Colombiana</h2>

      <input
        type="text"
        placeholder="Buscar por fecha (ej: 1985)"
        value={filtroFecha}
        onChange={(e) => setFiltroFecha(e.target.value)}
        style={{
          padding: '0.6rem',
          marginBottom: '2rem',
          width: '100%',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />

      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '1rem',
          paddingBottom: '1rem',
        }}
      >
        {eventosFiltrados.length > 0 ? (
          eventosFiltrados.map((evento, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              style={{
                minWidth: '250px',
                flexShrink: 0,
                backgroundColor: '#f7f7f7',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: '1rem',
                borderTop: '5px solid #6c63ff'
              }}
            >
              <div style={{ fontSize: '24px' }}>{iconoPorEvento(evento.titulo)}</div>
              <h4 style={{ margin: '0.5rem 0', color: '#6c63ff' }}>{evento.fecha}</h4>
              <strong style={{ fontSize: '1.05rem' }}>{evento.titulo}</strong>
              <p style={{ marginTop: '6px', fontSize: '0.9rem', color: '#333' }}>{evento.descripcion}</p>
            </motion.div>
          ))
        ) : (
          <p style={{ textAlign: 'center', width: '100%' }}>❌ No se encontraron eventos con esa fecha.</p>
        )}
      </div>
    </div>
  );
};

export default Timeline;
