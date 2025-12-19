import React, { useState, useEffect, useRef } from 'react';
import './Home.css';

import { authAPI } from '../services/api';
import '../styles.css';
import './Login.css';
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

        {activeEffect === 'explore' && (
          <div className="active-effect explore-effect">
            <div className="pulse-ring"></div>
            <div className="pulse-ring delay-1"></div>
            <div className="pulse-ring delay-2"></div>
          </div>
        )}
      </section>

      <section className="timeline-section" ref={timelineRef}>
        <h3 className="section-title">
          Viaja a través del tiempo
          <span className="section-subtitle">Explora los hitos de nuestra historia</span>
        </h3>

        <div className="timeline-progress-container">
          <div
            className="timeline-progress-bar"
            style={{ width: `${timelineProgress}%` }}
          ></div>
          <div className="timeline-year-indicator">
            {Math.round(1960 + (timelineProgress / 100) * 60)}
          </div>
        </div>

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

      <section className="final-cta">
        <h3 className="final-title">
          <span className="final-line">Tu recorrido por la historia</span>
          <span className="final-line highlight">de Colombia comienza ahora</span>
        </h3>

        <div className="login-container-dynamic">
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

          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>

          <div className={`login-card-dynamic ${isLogin ? 'login-mode' : 'register-mode'} ${successAnimation ? 'success-animation' : ''}`}>

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
        </div>

        <p className="final-message">
          Esta plataforma es un espacio para la <strong>reflexión crítica</strong>, el <strong>diálogo constructivo</strong> y la <strong>construcción de paz</strong> desde el conocimiento de nuestro pasado.
        </p>
      </section>

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