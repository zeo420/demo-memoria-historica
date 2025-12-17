// src/components/Trivia.jsx - Versión corregida
import React, { useState, useEffect } from 'react';
import { triviaAPI } from '../services/api';
import './Trivia.css'; // Importa el CSS

const Trivia = ({ usuario, onTriviaComplete }) => {
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [puntuacion, setPuntuacion] = useState(0);
  const [respuestasUsuario, setRespuestasUsuario] = useState([]);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tiempoInicio, setTiempoInicio] = useState(Date.now());
  const [nuevasMedallas, setNuevasMedallas] = useState([]);
  const [configuracion, setConfiguracion] = useState({
    cantidad: 10,
    dificultad: '',
    categoria: ''
  });
  const [mostrarConfig, setMostrarConfig] = useState(true);
  const [cargandoPreguntas, setCargandoPreguntas] = useState(false);

  const cargarPreguntas = async () => {
    setCargandoPreguntas(true);
    setError('');
    try {
      const params = {
        cantidad: configuracion.cantidad
      };
      if (configuracion.dificultad) params.dificultad = configuracion.dificultad;
      if (configuracion.categoria) params.categoria = configuracion.categoria;

      console.log('Cargando preguntas con params:', params);
      
      // Para desarrollo: usar datos mock si la API no está disponible
      if (!triviaAPI || !triviaAPI.getPreguntas) {
        console.warn('API no disponible, usando datos de prueba');
        const preguntasMock = generarPreguntasMock(configuracion.cantidad);
        setPreguntas(preguntasMock);
        setMostrarConfig(false);
        setTiempoInicio(Date.now());
        setCargandoPreguntas(false);
        return;
      }

      const data = await triviaAPI.getPreguntas(params);
      
      if (!data || data.length === 0) {
        setError('No hay preguntas disponibles con estos filtros. Usando preguntas de prueba.');
        const preguntasMock = generarPreguntasMock(configuracion.cantidad);
        setPreguntas(preguntasMock);
      } else {
        setPreguntas(data);
      }
      
      setMostrarConfig(false);
      setTiempoInicio(Date.now());
    } catch (err) {
      console.error('Error al cargar preguntas:', err);
      setError('Error al cargar las preguntas. Usando preguntas de prueba.');
      // Datos de respaldo
      const preguntasMock = generarPreguntasMock(configuracion.cantidad);
      setPreguntas(preguntasMock);
      setMostrarConfig(false);
      setTiempoInicio(Date.now());
    } finally {
      setCargandoPreguntas(false);
      setLoading(false);
    }
  };

  // Función para generar preguntas de prueba
  const generarPreguntasMock = (cantidad) => {
    const temas = [
      "Independencia de Colombia",
      "Conflicto armado",
      "Cultura colombiana",
      "Política moderna",
      "Economía histórica"
    ];
    
    const dificultades = ['facil', 'medio', 'dificil'];
    
    return Array.from({ length: cantidad }, (_, index) => ({
      _id: `mock-${index}`,
      pregunta: `Pregunta de prueba ${index + 1} sobre ${temas[index % temas.length]}`,
      opciones: [
        'Opción A - Correcta',
        'Opción B - Incorrecta',
        'Opción C - Incorrecta',
        'Opción D - Incorrecta'
      ],
      respuestaCorrecta: 0,
      dificultad: dificultades[index % dificultades.length],
      categoria: temas[index % temas.length].toLowerCase().replace(/ /g, '_'),
      puntos: (index % 3 + 1) * 10,
      explicacion: "Esta es una explicación de ejemplo para la pregunta."
    }));
  };

  const handleIniciarTrivia = () => {
    if (configuracion.cantidad < 5 || configuracion.cantidad > 20) {
      setError('La cantidad debe estar entre 5 y 20 preguntas');
      return;
    }
    cargarPreguntas();
  };

  const handleRespuesta = (indiceRespuesta) => {
    if (respuestaSeleccionada !== null) return;

    const pregunta = preguntas[preguntaActual];
    const esCorrecta = indiceRespuesta === pregunta.respuestaCorrecta;
    const tiempoRespuesta = Math.floor((Date.now() - tiempoInicio) / 1000);

    setRespuestaSeleccionada(indiceRespuesta);

    const nuevaRespuesta = {
      pregunta: pregunta._id,
      respuestaUsuario: indiceRespuesta,
      correcta: esCorrecta,
      tiempo: tiempoRespuesta
    };

    setRespuestasUsuario([...respuestasUsuario, nuevaRespuesta]);

    if (esCorrecta) {
      setPuntuacion(puntuacion + pregunta.puntos);
    }
  };

  const handleSiguiente = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
      setRespuestaSeleccionada(null);
      setTiempoInicio(Date.now());
    } else {
      finalizarTrivia();
    }
  };

  const finalizarTrivia = async () => {
    setJuegoTerminado(true);
    
    const todasRespuestas = [
      ...respuestasUsuario,
      {
        pregunta: preguntas[preguntaActual]._id,
        respuestaUsuario: respuestaSeleccionada,
        correcta: respuestaSeleccionada === preguntas[preguntaActual].respuestaCorrecta,
        tiempo: Math.floor((Date.now() - tiempoInicio) / 1000)
      }
    ];
    
    const respuestasCorrectas = todasRespuestas.filter(r => r.correcta).length;
    const porcentajeAcierto = Math.round((respuestasCorrectas / preguntas.length) * 100);
    const puntosFinales = puntuacion + (respuestaSeleccionada === preguntas[preguntaActual].respuestaCorrecta ? preguntas[preguntaActual].puntos : 0);

    try {
      // Si la API está disponible, guardar resultados
      if (triviaAPI && triviaAPI.guardarResultado) {
        const resultado = await triviaAPI.guardarResultado({
          preguntasRespondidas: todasRespuestas,
          puntosTotales: puntosFinales,
          porcentajeAcierto
        });

        console.log('✅ Resultado guardado:', resultado);
        
        // Actualizar usuario en el componente padre
        if (onTriviaComplete) {
          onTriviaComplete(resultado.usuario);
        }

        // Guardar nuevas medallas para mostrar
        if (resultado.nuevasMedallas && resultado.nuevasMedallas.length > 0) {
          setNuevasMedallas(resultado.nuevasMedallas);
        }
      }
    } catch (err) {
      console.error('Error al guardar resultado:', err);
      // Continuar sin guardar en caso de error
    }
  };

  const reiniciarTrivia = () => {
    setPreguntaActual(0);
    setRespuestaSeleccionada(null);
    setPuntuacion(0);
    setRespuestasUsuario([]);
    setJuegoTerminado(false);
    setMostrarConfig(true);
    setPreguntas([]);
    setNuevasMedallas([]);
  };

  // Mostrar pantalla de configuración
  if (mostrarConfig) {
    return (
      <div className="trivia-container">
        <div className="config-card">
          <h2>⚙️ Configurar Trivia</h2>
          
          <div className="config-group">
            <label htmlFor="cantidad-preguntas">Número de preguntas (5-20):</label>
            <input
              id="cantidad-preguntas"
              type="number"
              min="5"
              max="20"
              value={configuracion.cantidad}
              onChange={(e) => setConfiguracion({
                ...configuracion,
                cantidad: parseInt(e.target.value) || 10
              })}
              className="config-input"
            />
          </div>

          <div className="config-group">
            <label htmlFor="dificultad">Dificultad:</label>
            <select
              id="dificultad"
              value={configuracion.dificultad}
              onChange={(e) => setConfiguracion({
                ...configuracion,
                dificultad: e.target.value
              })}
              className="config-select"
            >
              <option value="">Todas las dificultades</option>
              <option value="facil">Fácil</option>
              <option value="medio">Medio</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>

          <div className="config-group">
            <label htmlFor="categoria">Categoría:</label>
            <select
              id="categoria"
              value={configuracion.categoria}
              onChange={(e) => setConfiguracion({
                ...configuracion,
                categoria: e.target.value
              })}
              className="config-select"
            >
              <option value="">Todas las categorías</option>
              <option value="politico">Política</option>
              <option value="conflicto">Conflicto</option>
              <option value="social">Social</option>
              <option value="cultural">Cultural</option>
              <option value="economico">Económico</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          {cargandoPreguntas && (
            <div className="loading-message">
              <span>⏳ Cargando preguntas...</span>
            </div>
          )}

          <button 
            className="start-btn" 
            onClick={handleIniciarTrivia}
            disabled={cargandoPreguntas}
          >
            {cargandoPreguntas ? 'Cargando...' : '🚀 Comenzar Trivia'}
          </button>
        </div>
      </div>
    );
  }

  if (loading || cargandoPreguntas) {
    return (
      <div className="trivia-container">
        <div className="loading-card">
          <div className="spinner"></div>
          <p>Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  if (juegoTerminado) {
    const respuestasCorrectas = respuestasUsuario.filter(r => r.correcta).length + 
      (respuestaSeleccionada === preguntas[preguntaActual].respuestaCorrecta ? 1 : 0);
    const porcentaje = Math.round((respuestasCorrectas / preguntas.length) * 100);

    return (
      <div className="trivia-container">
        <div className="resultado-card">
          {nuevasMedallas.length > 0 && (
            <div className="medallas-nuevas">
              <h3>🎉 ¡Nuevas Medallas Desbloqueadas!</h3>
              <div className="medallas-grid-nuevas">
                {nuevasMedallas.map((medalla, idx) => (
                  <div key={idx} className="medalla-nueva animate-medal">
                    <span className="medalla-icono">🏅</span>
                    <span className="medalla-nombre">{medalla.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2>🎉 ¡Trivia Completada!</h2>
          
          <div className="resultado-stats">
            <div className="stat-grande">
              <span className="stat-valor">{respuestasCorrectas}/{preguntas.length}</span>
              <span className="stat-label">Respuestas Correctas</span>
            </div>
            
            <div className="stat-grande">
              <span className="stat-valor">{porcentaje}%</span>
              <span className="stat-label">Precisión</span>
            </div>
            
            <div className="stat-grande">
              <span className="stat-valor">+{puntuacion}</span>
              <span className="stat-label">Puntos Ganados</span>
            </div>
          </div>

          <div className="mensaje-resultado">
            {porcentaje >= 80 && "🏆 ¡Excelente! Dominas la historia colombiana"}
            {porcentaje >= 60 && porcentaje < 80 && "👍 ¡Muy bien! Buen conocimiento histórico"}
            {porcentaje >= 40 && porcentaje < 60 && "📚 ¡No está mal! Sigue aprendiendo"}
            {porcentaje < 40 && "💪 Sigue practicando, mejorarás"}
          </div>

          <div className="resultado-acciones">
            <button className="btn-reintentar" onClick={reiniciarTrivia}>
              🔄 Nueva Trivia
            </button>
            <button className="btn-secundario" onClick={() => window.location.href = '/dashboard'}>
              📊 Ver Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pregunta = preguntas[preguntaActual];
  const progreso = ((preguntaActual + 1) / preguntas.length) * 100;

  if (!pregunta) {
    return (
      <div className="trivia-container">
        <div className="error-message">
          Error: No se pudo cargar la pregunta actual. 
          <button onClick={reiniciarTrivia} style={{marginLeft: '10px'}}>
            Reiniciar trivia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trivia-container">
      <div className="trivia-header">
        <div className="progreso-info">
          <span>Pregunta {preguntaActual + 1} de {preguntas.length}</span>
          <span>Puntuación: {puntuacion}</span>
        </div>
        <div className="progreso-bar">
          <div className="progreso-fill" style={{ width: `${progreso}%` }}></div>
        </div>
      </div>

      <div className="pregunta-card">
        <div className="pregunta-badges">
          <span className={`badge dificultad-${pregunta.dificultad}`}>
            {pregunta.dificultad ? pregunta.dificultad.charAt(0).toUpperCase() + pregunta.dificultad.slice(1) : 'Media'}
          </span>
          {pregunta.categoria && (
            <span className="badge categoria">
              {pregunta.categoria}
            </span>
          )}
          <span className="badge puntos">
            {pregunta.puntos || 10} pts
          </span>
        </div>

        <h3 className="pregunta-texto">{pregunta.pregunta}</h3>

        <div className="opciones-grid">
          {pregunta.opciones && pregunta.opciones.map((opcion, index) => {
            let claseBoton = 'opcion-btn';
            
            if (respuestaSeleccionada !== null) {
              if (index === pregunta.respuestaCorrecta) {
                claseBoton += ' correcta';
              } else if (index === respuestaSeleccionada) {
                claseBoton += ' incorrecta';
              } else {
                claseBoton += ' deshabilitada';
              }
            }

            return (
              <button
                key={index}
                className={claseBoton}
                onClick={() => handleRespuesta(index)}
                disabled={respuestaSeleccionada !== null}
              >
                <span className="opcion-letra">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="opcion-texto">{opcion}</span>
              </button>
            );
          })}
        </div>

        {respuestaSeleccionada !== null && (
          <button className="siguiente-btn" onClick={handleSiguiente}>
            {preguntaActual < preguntas.length - 1 ? 'Siguiente →' : 'Finalizar 🏁'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Trivia;