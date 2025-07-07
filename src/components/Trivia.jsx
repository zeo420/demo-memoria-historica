import React, { useEffect, useState } from 'react';
import { preguntas as preguntasOriginales } from '../data/preguntasTrivia.js';

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const Trivia = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [indice, setIndice] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [respuestas, setRespuestas] = useState([]);
  const [finalizado, setFinalizado] = useState(false);

  const iniciarTrivia = () => {
    const preguntasAleatorias = shuffleArray(preguntasOriginales).map(p => ({
      ...p,
      opciones: shuffleArray(p.opciones)
    }));
    setPreguntas(preguntasAleatorias);
    setIndice(0);
    setPuntaje(0);
    setRespuestas([]);
    setFinalizado(false);
  };

  useEffect(() => {
    iniciarTrivia();
  }, []);

  const handleRespuesta = (opcion) => {
    const actual = preguntas[indice];
    const esCorrecta = opcion === actual.correcta;

    const nuevaRespuesta = {
      pregunta: actual.pregunta,
      seleccionada: opcion,
      correcta: actual.correcta,
      categoria: actual.categoria || 'General',
      esCorrecta
    };

    const nuevasRespuestas = [...respuestas, nuevaRespuesta];
    setRespuestas(nuevasRespuestas);

    if (esCorrecta) {
      setPuntaje(prev => prev + 1);
    }

    if (indice < preguntas.length - 1) {
      setIndice(indice + 1);
    } else {
      setFinalizado(true);
      // Guardamos las respuestas y el puntaje completo
      localStorage.setItem('puntajeTrivia', esCorrecta ? (puntaje + 1).toString() : puntaje.toString());
      localStorage.setItem('respuestasTrivia', JSON.stringify(nuevasRespuestas));
      window.dispatchEvent(new Event('storage')); // dispara evento para actualizar Dashboard
    }
  };

  const obtenerMedalla = () => {
    const total = preguntas.length;
    const porcentaje = (puntaje / total) * 100;
    if (porcentaje === 100) return "🥇 Medalla de Oro";
    if (porcentaje >= 75) return "🥈 Medalla de Plata";
    if (porcentaje >= 50) return "🥉 Medalla de Bronce";
    return "🎓 Participación";
  };

  if (!preguntas.length) return <div>Cargando preguntas...</div>;

  if (finalizado) {
    return (
      <div>
        <h2>Resultado final</h2>
        <p>Puntaje obtenido: {puntaje} / {preguntas.length}</p>
        <h3>{obtenerMedalla()}</h3>

        <h3>Resumen de respuestas:</h3>
        <ul>
          {respuestas.map((r, idx) => (
            <li key={idx} style={{ marginBottom: '1rem' }}>
              <strong>{r.pregunta}</strong><br />
              Tu respuesta: <span style={{ color: r.esCorrecta ? 'green' : 'red' }}>{r.seleccionada}</span><br />
              {!r.esCorrecta && <>Respuesta correcta: <strong>{r.correcta}</strong><br /></>}
              Categoría: <em>{r.categoria}</em>
            </li>
          ))}
        </ul>

        <button
          onClick={iniciarTrivia}
          style={{
            marginTop: '1rem',
            backgroundColor: '#0066cc',
            color: '#fff',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  const preguntaActual = preguntas[indice];

  return (
    <div style={{ margin: '2rem 0' }}>
      <h2>Pregunta {indice + 1} de {preguntas.length}</h2>
      <p>{preguntaActual.pregunta}</p>
      {preguntaActual.opciones.map((opcion, idx) => (
        <button
          key={idx}
          onClick={() => handleRespuesta(opcion)}
          style={{
            display: 'block',
            margin: '0.5rem 0',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          {opcion}
        </button>
      ))}
    </div>
  );
};

export default Trivia;
