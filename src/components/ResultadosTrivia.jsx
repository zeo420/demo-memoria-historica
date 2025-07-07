import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

const ResultadosTrivia = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const resultados = localStorage.getItem('resultadosTrivia');
    if (resultados) {
      setDatos(JSON.parse(resultados));
    } else {
      // Si no hay datos, muestra valores por defecto
      setDatos([
        { categoria: 'Historia', puntaje: 0 },
        { categoria: 'Conflicto', puntaje: 0 },
        { categoria: 'Gobierno', puntaje: 0 },
        { categoria: 'Sociedad', puntaje: 0 }
      ]);
    }
  }, []);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h2>Resumen de Trivia por Categoría</h2>
      <ResponsiveContainer>
        <BarChart data={datos} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="categoria" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="puntaje" fill="#82ca9d" name="Respuestas correctas">
            <LabelList dataKey="puntaje" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultadosTrivia;
