import React, { useState, useEffect, useRef } from 'react';
import './Home.css';

import {
  FaCalendarAlt,
  FaVideo,
  FaMap,
  FaBullseye,
} from 'react-icons/fa';

const Home = () => {
  const [activeEffect, setActiveEffect] = useState('none');
  const [showIntro, setShowIntro] = useState(true);
  const containerRef = useRef(null);

  // Efectos interactivos disponibles
  const effects = [
    { id: 'timeline', label: 'Línea de tiempo' },
    { id: 'stories', label: 'Historias' },
    { id: 'explore', label: 'Explorar mapa' },
    { id: 'quiz', label: 'Test de conocimiento' }
  ];

  return (
    <div className="history-platform" ref={containerRef}>
      {showIntro && (
        <div className="intro-overlay">
          <div className="intro-content">
            <h1 className="intro-title">MEMORIA HISTÓRICA DE COLOMBIA</h1>
            <div className="intro-subtitle">
              <span>Descubre</span>
              <span>Reflexiona</span>
              <span>Construye</span>
            </div>

            <div className="creative-loader timeline-loader">
              <div className="timeline-track">
                <div className="timeline-line">
                  <div className="timeline-progress"></div>
                </div>
                <div className="time-marker marker-1">600</div>
                <div className="time-marker marker-2">1280</div>
                <div className="time-marker marker-3">1854</div>
                <div className="time-marker marker-4">2000</div>
                <div className="time-marker marker-5">2025</div>
                <div className="historical-event event-1">
                  <div className="event-dot"></div>
                  <div className="event-label">Conflicto</div>
                </div>
                <div className="historical-event event-2">
                  <div className="event-dot"></div>
                  <div className="event-label">Paz</div>
                </div>
                <div className="historical-event event-3">
                  <div className="event-dot"></div>
                  <div className="event-label">Memoria</div>
                </div>
              </div>
              <div className="loader-text">
                Reconstruyendo la línea temporal
              </div>
            </div>

            <div className="intro-quote">
              "La historia no es lo que pasó, es lo que recordamos"
            </div>
          </div>
        </div>
      )}

      <section className="activities-section">
        <h3 className="section-title">Elige tu forma de explorar</h3>

        <div className="activities-grid">
          {effects.map((effect) => (
            <div
              key={effect.id}
              className={`activity-card ${activeEffect === effect.id ? 'active' : ''}`}
              onClick={() => startEffect(effect.id)}
            >
              <div className="card-icon">
                {effect.id === 'timeline' && <FaCalendarAlt style={{ marginRight: '6px', verticalAlign: 'middle' }} />}
                {effect.id === 'stories' && <FaVideo style={{ marginRight: '6px', verticalAlign: 'middle' }} />}
                {effect.id === 'quiz' && <FaBullseye style={{ marginRight: '6px', verticalAlign: 'middle' }} />}
                {effect.id === 'explore' && <FaMap style={{ marginRight: '6px', verticalAlign: 'middle' }} />}
              </div>
              <h4 className="card-title">{effect.label}</h4>
              <p className="card-description">
                {effect.id === 'timeline' && 'Recorre los hitos históricos en orden cronológico'}
                {effect.id === 'stories' && 'Descubre testimonios y narrativas en video'}
                {effect.id === 'quiz' && 'Pon a prueba tu conocimiento con desafíos'}
                {effect.id === 'explore' && 'Explora los lugares emblemáticos del conflicto'}
              </p>
              <div className="card-hover-effect"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;