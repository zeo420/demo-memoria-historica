import React, { useState, useEffect } from 'react';
import { authAPI } from './services/api';
import Login from './components/Login';
import Home from './components/Home';
import Timeline from './components/Timeline';
import Trivia from './components/Trivia';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Videos from './components/Videos';
import Mapas from './components/Mapas';
import './styles.css';
import {
  FaHome,
  FaCalendarAlt,
  FaVideo,
  FaMap,
  FaBullseye,
  FaChartBar,
  FaUser,
  FaStar,
  FaSignOutAlt
} from 'react-icons/fa';

function App() {
  const [usuario, setUsuario] = useState(authAPI.getCurrentUser());
  const [vistaActual, setVistaActual] = useState('home');

  const handleLogin = (user) => {
    setUsuario(user);
    setVistaActual('home');
  };

  const handleLogout = () => {
    authAPI.logout();
    setUsuario(null);
    setVistaActual('home');
  };

  const handleProfileUpdate = (updatedUser) => {
    setUsuario({ ...usuario, ...updatedUser });
    localStorage.setItem('user', JSON.stringify({ ...usuario, ...updatedUser }));
  };

  const handleTriviaComplete = (updatedUserData) => {
    setUsuario({ ...usuario, ...updatedUserData });
    localStorage.setItem('user', JSON.stringify({ ...usuario, ...updatedUserData }));
  };

  if (!usuario) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>Memoria Histórica</h1>
          <h2>{usuario.nombre}</h2>
        </div>

        <div className="nav-buttons">
          <button
            onClick={() => setVistaActual('home')}
            className={vistaActual === 'home' ? 'active' : ''}
          >
            <FaHome style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Inicio
          </button>
          <button
            onClick={() => setVistaActual('timeline')}
            className={vistaActual === 'timeline' ? 'active' : ''}
          >
            <FaCalendarAlt style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Timeline
          </button>
          <button
            onClick={() => setVistaActual('videos')}
            className={vistaActual === 'videos' ? 'active' : ''}
          >
            <FaVideo style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Videos
          </button>
          <button
            onClick={() => setVistaActual('mapas')}
            className={vistaActual === 'mapas' ? 'active' : ''}
          >
            <FaMap style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Mapas
          </button>
          <button
            onClick={() => setVistaActual('trivia')}
            className={vistaActual === 'trivia' ? 'active' : ''}
          >
            <FaBullseye style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Trivia
          </button>
          <button
            onClick={() => setVistaActual('dashboard')}
            className={vistaActual === 'dashboard' ? 'active' : ''}
          >
            <FaChartBar style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Dashboard
          </button>
          <button
            onClick={() => setVistaActual('profile')}
            className={vistaActual === 'profile' ? 'active' : ''}
          >
            <FaUser style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Perfil
          </button>
        </div>

        <div className="user-section">
          <div className="user-info">
            <span className="user-level">Nivel {usuario.nivel || 1}</span>
            <span className="user-points">
              <FaStar style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              {usuario.puntos || 0} pts
            </span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Salir
          </button>
        </div>
      </nav>

      <main className="main-content">
        {vistaActual === 'home' && <Home usuario={usuario} />}
        {vistaActual === 'timeline' && <Timeline />}
        {vistaActual === 'videos' && <Videos />}
        {vistaActual === 'mapas' && <Mapas />}
        {vistaActual === 'trivia' && (
          <Trivia
            usuario={usuario}
            onTriviaComplete={handleTriviaComplete}
          />
        )}
        {vistaActual === 'dashboard' && <Dashboard usuario={usuario} />}
        {vistaActual === 'profile' && (
          <Profile
            usuario={usuario}
            onUpdate={handleProfileUpdate}
          />
        )}
      </main>
    </div>
  );
}

export default App;