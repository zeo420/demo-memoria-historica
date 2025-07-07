import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

const obtenerMedalla = (puntaje, total = 10) => {
  const porcentaje = (puntaje / total) * 100;
  if (porcentaje === 100) return "🥇 Medalla de Oro";
  if (porcentaje >= 75) return "🥈 Medalla de Plata";
  if (porcentaje >= 50) return "🥉 Medalla de Bronce";
  return "🎓 Participación";
};

const Dashboard = ({ user }) => {
  const [puntaje, setPuntaje] = useState(0);
  const [datosCategoria, setDatosCategoria] = useState([]);

  const procesarDatos = () => {
    const respuestas = JSON.parse(localStorage.getItem('respuestasTrivia') || '[]');
    const resumen = {};

    respuestas.forEach(r => {
      if (!resumen[r.categoria]) {
        resumen[r.categoria] = { categoria: r.categoria, correctas: 0 };
      }
      if (r.esCorrecta) resumen[r.categoria].correctas += 1;
    });

    const procesado = Object.values(resumen);
    setDatosCategoria(procesado);
  };

  useEffect(() => {
    const puntajeGuardado = localStorage.getItem('puntajeTrivia');
    if (puntajeGuardado) {
      setPuntaje(parseInt(puntajeGuardado, 10));
    }

    procesarDatos();

    const actualizarDesdeEvento = () => {
      const nuevoPuntaje = localStorage.getItem('puntajeTrivia');
      if (nuevoPuntaje) setPuntaje(parseInt(nuevoPuntaje, 10));
      procesarDatos();
    };

    window.addEventListener('storage', actualizarDesdeEvento);
    return () => window.removeEventListener('storage', actualizarDesdeEvento);
  }, []);

  return (
    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2>📊 Resumen de Participación</h2>
      <p><strong>Usuario:</strong> {user}</p>
      <p><strong>Puntaje en Trivia:</strong> {puntaje} / 10</p>
      <p><strong>Reconocimiento:</strong> {obtenerMedalla(puntaje, 10)}</p>

      {datosCategoria.length > 0 && (
        <>
          <h3>Aciertos por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosCategoria}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="correctas" fill="#1976d2" name="Respuestas correctas" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default Dashboard;
