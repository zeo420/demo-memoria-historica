import React, { useState, useEffect, useRef } from 'react';
import './Home.css';

import { authAPI } from '../services/api';
import '../styles.css';
import {
  FaExclamationTriangle,
  FaLock,
  FaUser,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaHistory,
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaBook,
  FaQuestionCircle,
  FaVideo,
  FaMap,
  FaBullseye,
  FaSearch
} from 'react-icons/fa';
import {
  MdHourglassEmpty,
  MdScience,
  MdAdd,
  MdArrowForward,
  MdCheckCircle,
  MdStars,
  MdArrowDownward
} from 'react-icons/md';
import { GiColombia } from 'react-icons/gi';
import { BsFillCalendarCheckFill } from 'react-icons/bs';

const Login = ({ onLogin }) => {
  const [activeEffect, setActiveEffect] = useState('none');
  const [showIntro, setShowIntro] = useState(true);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [selectedEra, setSelectedEra] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const containerRef = useRef(null);
  const timelineRef = useRef(null);

  // Datos para las líneas de tiempo interactivas
  const historicalEras = [
    { id: 1, year: "1960-1970", title: "Violencia bipartidista", color: "#8B0000", description: "Conflicto entre liberales y conservadores que dejó profundas heridas en la sociedad colombiana." },
    { id: 2, year: "1980-1990", title: "Narcotráfico y conflicto armado", color: "#4A6B00", description: "Expansión de los carteles de drogas y escalada del conflicto con grupos guerrilleros y paramilitares." },
    { id: 3, year: "1990-2000", title: "Procesos de paz", color: "#005A8C", description: "Intentos de negociación y procesos de paz con diferentes grupos armados." },
    { id: 4, year: "2000-2010", title: "Desmovilización paramilitar", color: "#8C5400", description: "Proceso de desarme y reintegración de grupos paramilitares." },
    { id: 5, year: "2010-2020", title: "Acuerdo de paz con las FARC", color: "#006D5B", description: "Negociaciones y firma del acuerdo de paz con las FARC-EP." },
  ];

  // Efectos interactivos disponibles
  const effects = [
    { id: 'timeline', label: 'Línea de tiempo' },
    { id: 'stories', label: 'Historias' },
    { id: 'explore', label: 'Explorar mapa' },
    { id: 'quiz', label: 'Test de conocimiento' }
  ];

  // Manejar el scroll para efectos dinámicos
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = window.scrollY;
        setScrollPosition(scrollTop);

        // Actualizar progreso de la línea de tiempo basado en el scroll
        if (timelineRef.current) {
          const timelineRect = timelineRef.current.getBoundingClientRect();
          if (timelineRect.top < window.innerHeight && timelineRect.bottom > 0) {
            const progress = Math.min(100, Math.max(0,
              ((window.innerHeight - timelineRect.top) / timelineRect.height) * 100
            ));
            setTimelineProgress(progress);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Efecto de introducción
    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(introTimer);
    };
  }, []);

  // Manejar clic en una era histórica
  const handleEraClick = (era) => {
    setSelectedEra(era);

    // Efecto visual cuando se selecciona una era
    setActiveEffect('era-selected');
    setTimeout(() => setActiveEffect('none'), 1000);
  };

  // Iniciar un efecto interactivo
  const startEffect = (effectId) => {
    setActiveEffect(effectId);

    // Resetear después de un tiempo para efectos temporales
    if (effectId !== 'timeline') {
      setTimeout(() => setActiveEffect('none'), 2000);
    }
  };

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeField, setActiveField] = useState('');
  const [particles, setParticles] = useState([]);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [formStep, setFormStep] = useState(0);

  // Crear partículas para el fondo
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 0.5,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  // Efecto de transición entre formularios
  useEffect(() => {
    setFormStep(0);
    setActiveField('');
    setError('');
  }, [isLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setActiveField(name);
    setError('');

    // Avanzar step para registro
    if (!isLogin) {
      if (name === 'nombre' && value.length > 0) setFormStep(1);
      if (name === 'email' && value.includes('@')) setFormStep(2);
      if (name === 'password' && value.length >= 6) setFormStep(3);
    }
  };

  const validateForm = () => {
    if (!isLogin && !formData.nombre.trim()) {
      setError('El nombre es requerido');
      setFormStep(0);
      return false;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setError('Email inválido');
      setFormStep(1);
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setFormStep(2);
      return false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setFormStep(3);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      let response;

      if (isLogin) {
        response = await authAPI.login(formData.email, formData.password);
      } else {
        response = await authAPI.register(
          formData.nombre,
          formData.email,
          formData.password
        );
      }

      // Animación de éxito antes de redirigir
      setSuccessAnimation(true);
      setTimeout(() => {
        console.log('Autenticación exitosa:', response);
        onLogin(response.user);
      }, 1500);

    } catch (err) {
      console.error('Error de autenticación:', err);
      const errorMsg = err.response?.data?.error || 'Error al autenticar. Intenta de nuevo.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      nombre: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setFormStep(0);
  };

  const quickLogin = (email, password) => {
    setFormData({
      ...formData,
      email,
      password
    });
    setTimeout(() => {
      document.querySelector('.submit-btn').click();
    }, 300);
  };

  return (
    <div className="history-platform" ref={containerRef}>
      {/* Overlay introductorio */}
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

            {/* Texto adicional */}
            <div className="intro-quote">
              "La historia no es lo que pasó, es lo que recordamos"
            </div>
          </div>
        </div>
      )}

      {/* Hero section con efecto de partículas */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('https://noticias.imer.mx/wp-content/uploads/2021/05/Colombia_conflicto_260521.jpg')`,
          transform: `translateY(${scrollPosition * 0.3}px)`
        }}
      >
        <div className="hero-content">
          <h2 className="hero-title">
            <span className="title-line highlight">¿Listo para descubrir</span>
            <span className="title-line highlight">la historia que no te contaron?</span>
          </h2>

          <p className="hero-description">
            En Colombia, muchas personas no conocen a fondo los hechos que han marcado nuestro pasado.
            Esta plataforma busca <strong>fortalecer la memoria histórica</strong> de forma innovadora, combinando
            <strong> tecnología interactiva</strong>, <strong>narrativas visuales</strong> y
            <strong> retos gamificados</strong> que hacen del aprendizaje una experiencia participativa y significativa.
          </p>


          <div className="cta-container">
            <div className="interactive-hint">
              <span className="hint-text">Desplázate para explorar</span>
              <div className="scroll-indicator"></div>
            </div>
          </div>
        </div>

        {/* Elementos visuales flotantes */}
        <div className="floating-elements">
          <div className="floating-element" style={{ animationDelay: '0.5s', left: '10%' }}>
            <FaBook />
          </div>
          <div className="floating-element" style={{ animationDelay: '1s', left: '25%' }}>
            <FaMapMarkedAlt />
          </div>
          <div className="floating-element" style={{ animationDelay: '1.5s', left: '40%' }}>
            <FaQuestionCircle />
          </div>
          <div className="floating-element" style={{ animationDelay: '2s', left: '55%' }}>
            <FaSearch />
          </div>
          <div className="floating-element" style={{ animationDelay: '2.5s', left: '70%' }}>
            <GiColombia />
          </div>
        </div>

        {/* Efectos visuales activos */}
        {activeEffect === 'explore' && (
          <div className="active-effect explore-effect">
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay-1"></div>
            <div className="pulse-ring delay-2"></div>
          </div>
        )}
      </section>

      {/* Línea de tiempo interactiva */}
      <section className="timeline-section" ref={timelineRef}>
        <h3 className="section-title">
          Viaja a través del tiempo
          <span className="section-subtitle">Explora los hitos de nuestra historia</span>
        </h3>

        {/* Barra de progreso de la línea de tiempo */}
        <div className="timeline-progress-container">
          <div
            className="timeline-progress-bar"
            style={{ width: `${timelineProgress}%` }}
          ></div>
          <div className="timeline-year-indicator">
            {Math.round(1960 + (timelineProgress / 100) * 60)}
          </div>
        </div>

        {/* Línea de tiempo interactiva */}
        <div className="interactive-timeline">
          {historicalEras.map((era, index) => (
            <div
              key={era.id}
              className={`timeline-era ${selectedEra?.id === era.id ? 'active' : ''}`}
              style={{
                left: `${index * 20}%`,
                '--era-color': era.color
              }}
              onClick={() => handleEraClick(era)}
            >
              <div className="era-marker" style={{ backgroundColor: era.color }}>
                <span className="era-year">{era.year}</span>
              </div>
              <div className="era-content">
                <h4 className="era-title">{era.title}</h4>
                <p className="era-description">{era.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Panel de era seleccionada */}
        {selectedEra && (
          <div className="selected-era-panel">
            <div
              className="era-header"
              style={{ backgroundColor: selectedEra.color }}
            >
              <h3>{selectedEra.title}</h3>
              <span className="era-period">{selectedEra.year}</span>
              <button
                className="close-button"
                onClick={() => setSelectedEra(null)}
              >
                ×
              </button>
            </div>
            <div className="era-body">
              <p>{selectedEra.description}</p>
            </div>
          </div>
        )}
      </section>

      {/* Sección de actividades interactivas */}
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

      {/* Llamado a la acción final */}
      <section className="final-cta">
        <h3 className="final-title">
          <span className="final-line">Tu recorrido por la historia</span>
          <span className="final-line highlight">de Colombia comienza ahora</span>
        </h3>

        <div className="login-container-dynamic">
          {/* Fondo con partículas animadas */}
          <div className="background-particles">
            {particles.map(particle => (
              <div
                key={particle.id}
                className="particle"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  animationDelay: `${particle.delay}s`
                }}
              />
            ))}
          </div>

          {/* Efectos visuales */}
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>

          {/* Tarjeta de login */}
          <div className={`login-card-dynamic ${isLogin ? 'login-mode' : 'register-mode'} ${successAnimation ? 'success-animation' : ''}`}>

            {/* Header con animación */}
            <div className="login-header-dynamic">
              <div className="logo-container">
                <GiColombia className="logo-icon" />
                <div className="logo-text">
                  <h1>Memoria Histórica</h1>
                  <span>Colombia</span>
                </div>
              </div>
              <p className="tagline">
                {isLogin
                  ? 'Descubre la historia que transformará tu perspectiva'
                  : 'Únete a la reconstrucción de nuestra memoria colectiva'
                }
              </p>
            </div>

            {/* Indicador de progreso para registro */}
            {!isLogin && (
              <div className="progress-indicator">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(formStep / 3) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-steps">
                  <span className={formStep >= 0 ? 'active' : ''}>Nombre</span>
                  <span className={formStep >= 1 ? 'active' : ''}>Email</span>
                  <span className={formStep >= 2 ? 'active' : ''}>Contraseña</span>
                  <span className={formStep >= 3 ? 'active' : ''}>Confirmar</span>
                </div>
              </div>
            )}

            {/* Tabs con animación */}
            <div className="tabs-container">
              <button
                className={`tab-btn ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
                disabled={loading}
              >
                <FaLock />
                <span>Iniciar Sesión</span>
                {isLogin && <div className="tab-indicator"></div>}
              </button>
              <button
                className={`tab-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
                disabled={loading}
              >
                <MdAdd />
                <span>Registrarse</span>
                {!isLogin && <div className="tab-indicator"></div>}
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="login-form-dynamic">
              {!isLogin && (
                <div className={`form-group-dynamic ${activeField === 'nombre' ? 'active' : ''} ${formData.nombre ? 'filled' : ''}`}>
                  <div className="input-header">
                    <FaUser className="input-icon" />
                    <label htmlFor="nombre">Nombre Completo</label>
                  </div>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    onFocus={() => setActiveField('nombre')}
                    onBlur={() => setActiveField('')}
                    placeholder="Juan Pérez"
                    disabled={loading}
                    autoComplete="name"
                  />
                  <div className="input-underline"></div>
                </div>
              )}

              <div className={`form-group-dynamic ${activeField === 'email' ? 'active' : ''} ${formData.email ? 'filled' : ''}`}>
                <div className="input-header">
                  <FaEnvelope className="input-icon" />
                  <label htmlFor="email">Email</label>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField('')}
                  placeholder="ejemplo@correo.com"
                  disabled={loading}
                  autoComplete="email"
                />
                <div className="input-underline"></div>
              </div>

              <div className={`form-group-dynamic ${activeField === 'password' ? 'active' : ''} ${formData.password ? 'filled' : ''}`}>
                <div className="input-header">
                  <FaLock className="input-icon" />
                  <label htmlFor="password">Contraseña</label>
                </div>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setActiveField('password')}
                    onBlur={() => setActiveField('')}
                    placeholder="Mínimo 6 caracteres"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="input-underline"></div>
                <div className="password-strength">
                  {formData.password && (
                    <>
                      <div className={`strength-bar ${formData.password.length >= 6 ? 'strong' : 'weak'}`}></div>
                      <span>{formData.password.length >= 6 ? 'Contraseña segura' : 'Muy débil'}</span>
                    </>
                  )}
                </div>
              </div>

              {!isLogin && (
                <div className={`form-group-dynamic ${activeField === 'confirmPassword' ? 'active' : ''} ${formData.confirmPassword ? 'filled' : ''}`}>
                  <div className="input-header">
                    <FaLock className="input-icon" />
                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                  </div>
                  <div className="password-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setActiveField('confirmPassword')}
                      onBlur={() => setActiveField('')}
                      placeholder="Repite tu contraseña"
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <div className="input-underline"></div>
                  {formData.confirmPassword && (
                    <div className="password-match">
                      {formData.password === formData.confirmPassword ? (
                        <span className="match-success">
                          <MdCheckCircle /> Las contraseñas coinciden
                        </span>
                      ) : (
                        <span className="match-error">
                          <FaExclamationTriangle /> Las contraseñas no coinciden
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="error-message-dynamic">
                  <FaExclamationTriangle className="error-icon" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className={`submit-btn-dynamic ${loading ? 'loading' : ''} ${successAnimation ? 'success' : ''}`}
                disabled={loading || successAnimation}
              >
                {successAnimation ? (
                  <span className="success-content">
                    <MdCheckCircle className="success-icon" />
                    ¡Éxito!
                  </span>
                ) : loading ? (
                  <span className="loading-content">
                    <MdHourglassEmpty className="loading-icon" />
                    Procesando...
                  </span>
                ) : (
                  <span className="btn-content">
                    {isLogin ? (
                      <>
                        <FaLock className="btn-icon" />
                        Iniciar Sesión
                        <MdArrowForward className="btn-arrow" />
                      </>
                    ) : (
                      <>
                        <MdAdd className="btn-icon" />
                        Crear Cuenta
                        <MdStars className="btn-star" />
                      </>
                    )}
                  </span>
                )}
              </button>
            </form>

            {/* Cambiar entre login/registro */}
            <div className="toggle-mode">
              <p>
                {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                <button
                  onClick={toggleMode}
                  className="mode-toggle-btn"
                  disabled={loading}
                >
                  {isLogin ? 'Únete a la comunidad' : 'Inicia sesión aquí'}
                </button>
              </p>
            </div>
          </div>

          <style jsx>{`
        .login-container-dynamic {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .background-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          background: linear-gradient(135deg, #ffcc00, #ff9900);
          border-radius: 50%;
          opacity: 0.3;
          animation: float-particle 15s infinite linear;
        }

        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #970202ff, #764ba2);
          top: 10%;
          left: 5%;
          animation: float-shape 20s infinite alternate;
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #f093fb, #f5576c);
          bottom: 15%;
          right: 10%;
          animation: float-shape 25s infinite alternate-reverse;
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          top: 60%;
          left: 80%;
          animation: float-shape 30s infinite;
        }

        .login-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          max-width: 1200px;
          width: 100%;
          z-index: 1;
        }

        .login-card-dynamic {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .login-card-dynamic.success-animation {
          animation: success-pulse 1.5s ease-in-out;
        }

        .login-header-dynamic {
          text-align: center;
          margin-bottom: 30px;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .logo-icon {
          font-size: 3em;
          color: #ffcc00;
          filter: drop-shadow(0 4px 6px rgba(255, 204, 0, 0.3));
        }

        .logo-text {
          text-align: left;
        }

        .logo-text h1 {
          font-size: 2em;
          color: #333;
          margin: 0;
          background: linear-gradient(135deg, #333, #970202ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .logo-text span {
          font-size: 0.9em;
          color: #666;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .tagline {
          color: #666;
          font-size: 0.95em;
          margin-top: 10px;
          font-style: italic;
        }

        .progress-indicator {
          margin-bottom: 30px;
        }

        .progress-bar {
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4facfe, #00f2fe);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          font-size: 0.8em;
          color: #999;
        }

        .progress-steps span.active {
          color: #970202ff;
          font-weight: 600;
        }

        .tabs-container {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          position: relative;
        }

        .tab-btn {
          flex: 1;
          padding: 15px;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1em;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #666;
          position: relative;
        }

        .tab-btn.active {
          background: white;
          border-color: #970202ff;
          color: #970202ff;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
        }

        .tab-indicator {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 50%;
          height: 3px;
          background: linear-gradient(90deg, #970202ff, #764ba2);
          border-radius: 3px 3px 0 0;
        }

        .login-form-dynamic {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .form-group-dynamic {
          position: relative;
        }

        .input-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .input-icon {
          color: #999;
          transition: color 0.3s;
        }

        .form-group-dynamic.active .input-icon {
          color: #970202ff;
        }

        .form-group-dynamic label {
          font-weight: 600;
          color: #333;
          font-size: 0.9em;
          transition: color 0.3s;
        }

        .form-group-dynamic.active label {
          color: #970202ff;
        }

        .form-group-dynamic input {
          width: 100%;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1em;
          transition: all 0.3s;
          background: rgba(255, 255, 255, 0.9);
        }

        .form-group-dynamic input:focus {
          outline: none;
          border-color: #970202ff;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
        }

        .form-group-dynamic input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .input-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #970202ff, #764ba2);
          transition: width 0.3s;
        }

        .form-group-dynamic.active .input-underline {
          width: 100%;
        }

        .password-wrapper {
          position: relative;
        }

        .toggle-password {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 1.2em;
          padding: 5px;
        }

        .toggle-password:hover {
          color: #970202ff;
        }

        .password-strength {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 8px;
          font-size: 0.8em;
        }

        .strength-bar {
          flex: 1;
          height: 4px;
          background: #e0e0e0;
          border-radius: 2px;
          overflow: hidden;
        }

        .strength-bar.strong {
          background: linear-gradient(90deg, #4caf50, #8bc34a);
        }

        .strength-bar.weak {
          background: linear-gradient(90deg, #f44336, #ff9800);
        }

        .password-match {
          margin-top: 8px;
          font-size: 0.8em;
        }

        .match-success {
          color: #4caf50;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .match-error {
          color: #f44336;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .error-message-dynamic {
          background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(255, 152, 0, 0.1));
          color: #f44336;
          padding: 15px;
          border-radius: 12px;
          font-size: 0.9em;
          border-left: 4px solid #f44336;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: shake 0.5s;
        }

        .error-icon {
          font-size: 1.2em;
        }

        .submit-btn-dynamic {
          background: linear-gradient(135deg, #2a2a2a 0%, #2d4dff 100%);
          color: white;
          padding: 18px;
          border: none;
          border-radius: 12px;
          font-size: 1.1em;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .submit-btn-dynamic:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(45, 77, 255, 0.3);
        }

        .submit-btn-dynamic:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .submit-btn-dynamic.loading {
          background: linear-gradient(135deg, #666, #999);
        }

        .submit-btn-dynamic.success {
          background: linear-gradient(135deg, #4caf50, #8bc34a);
        }

        .btn-content, .loading-content, .success-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .btn-icon, .loading-icon, .success-icon {
          font-size: 1.2em;
        }

        .btn-arrow, .btn-star {
          transition: transform 0.3s;
        }

        .submit-btn-dynamic:hover .btn-arrow {
          transform: translateX(5px);
        }

        .submit-btn-dynamic:hover .btn-star {
          transform: rotate(180deg);
        }

        .toggle-mode {
          text-align: center;
          margin-top: 20px;
          color: #666;
        }

        .mode-toggle-btn {
          background: none;
          border: none;
          color: #970202ff;
          cursor: pointer;
          font-weight: 600;
          text-decoration: underline;
          font-size: 1em;
          padding: 0;
        }

        .mode-toggle-btn:hover:not(:disabled) {
          color: #764ba2;
        }

        .mode-toggle-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .demo-section-dynamic {
          margin-top: 30px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
          border-radius: 16px;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .demo-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .demo-icon {
          color: #970202ff;
          font-size: 1.5em;
        }

        .demo-header h4 {
          margin: 0;
          color: #333;
          font-size: 1.1em;
        }

        .demo-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .demo-btn {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .demo-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          border-color: #970202ff;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
        }

        .demo-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .demo-btn span {
          font-weight: 600;
          color: #333;
          font-size: 0.9em;
        }

        .demo-btn small {
          color: #999;
          font-size: 0.75em;
        }

        .info-panel {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .info-panel h3 {
          color: #333;
          margin-bottom: 30px;
          font-size: 1.8em;
          background: linear-gradient(135deg, #333, #970202ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 30px;
        }

        .feature {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 15px;
          border-radius: 12px;
          background: rgba(102, 126, 234, 0.05);
          transition: transform 0.3s;
        }

        .feature:hover {
          transform: translateX(5px);
        }

        .feature-icon {
          font-size: 1.8em;
          flex-shrink: 0;
        }

        .feature-text h4 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 1.1em;
        }

        .feature-text p {
          margin: 0;
          color: #666;
          font-size: 0.9em;
          line-height: 1.4;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 30px;
          padding-top: 30px;
          border-top: 1px solid #e0e0e0;
        }

        .stat {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .stat-number {
          font-size: 1.8em;
          font-weight: 700;
          color: #970202ff;
        }

        .stat-label {
          font-size: 0.8em;
          color: #999;
          line-height: 1.2;
        }

        /* Animations */
        @keyframes float-particle {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-100vh) rotate(360deg); }
        }

        @keyframes float-shape {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }

        @keyframes success-pulse {
          0% { transform: scale(1); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }
          50% { transform: scale(1.02); box-shadow: 0 20px 60px rgba(76, 175, 80, 0.4); }
          100% { transform: scale(1); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .login-content {
            grid-template-columns: 1fr;
            max-width: 600px;
          }
          
          .info-panel {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .login-card-dynamic {
            padding: 30px 20px;
          }
          
          .demo-options {
            grid-template-columns: 1fr;
          }
          
          .logo-container {
            flex-direction: column;
            text-align: center;
          }
          
          .logo-text {
            text-align: center;
          }
        }
      `}</style>
        </div>

        <p className="final-message">
          Esta plataforma es un espacio para la <strong>reflexión crítica</strong>, el <strong>diálogo constructivo</strong> y la <strong>construcción de paz</strong> desde el conocimiento de nuestro pasado.
        </p>
      </section>

      {/* Efectos globales */}
      <div className={`global-effects ${activeEffect !== 'none' ? 'active' : ''}`}>
        <div className="particles-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                animationDelay: `${i * 0.1}s`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;