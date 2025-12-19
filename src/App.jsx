// ============================================
// 2. App.jsx - Con iconos de react-icons
// ============================================
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

      <style jsx>{`
        .App {
          min-height: 100vh;
          background: #f5f7fa;
        }

        .navbar {
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 15px 30px;
          display: flex;
          align-items: center;
          gap: 30px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-brand h1 {
          margin: 0;
          font-size: 0.9em;
          color: #333;
        }

        .navbar-brand h2 {
          margin: 0;
          font-size: 0.5em;
          color: #616161ff;
        }

        .nav-buttons {
          display: flex;
          gap: 10px;
          flex: 1;
        }

        .nav-buttons button {
          padding: 10px 20px;
          border: none;
          background: transparent;
          color: #666;
          cursor: pointer;
          border-radius: 8px;
          font-size: 0.9em;
          transition: all 0.3s;
          display: flex;
          align-items: center;
        }

        .nav-buttons button:hover {
          background: #f0f0f0;
          color: #333;
        }

        .nav-buttons button.active {
          background: linear-gradient(135deg, #2a2a2aff 0%, #2d4dffff 100%);
          color: white;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-info {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .user-level, .user-points {
          padding: 8px 15px;
          background: #f8f9fa;
          border-radius: 20px;
          font-weight: 600;
          color: #555;
          display: flex;
          align-items: center;
        }

        .user-level {
          background: #ffd700;
          color: #333;
        }

        .logout-btn {
          padding: 10px 20px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9em;
          display: flex;
          align-items: center;
        }

        .logout-btn:hover {
          background: #c82333;
        }

        .main-content {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .navbar {
            flex-direction: column;
            gap: 15px;
          }

          .nav-buttons {
            flex-wrap: wrap;
            justify-content: center;
          }

          .user-section {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default App;