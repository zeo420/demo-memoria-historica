// src/App.jsx - Actualizado con manejo de estado completo
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
    // Actualizar también en localStorage
    localStorage.setItem('user', JSON.stringify({ ...usuario, ...updatedUser }));
  };

  const handleTriviaComplete = (updatedUserData) => {
    // Actualizar datos del usuario después de completar trivia
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
        </div>
        
        <div className="nav-buttons">
          <button 
            onClick={() => setVistaActual('home')}
            className={vistaActual === 'home' ? 'active' : ''}
          >
            🏠 Inicio
          </button>
          <button 
            onClick={() => setVistaActual('timeline')}
            className={vistaActual === 'timeline' ? 'active' : ''}
          >
            📅 Timeline
          </button>
          <button 
            onClick={() => setVistaActual('videos')}
            className={vistaActual === 'videos' ? 'active' : ''}
          >
            🎬 Videos
          </button>
          <button 
            onClick={() => setVistaActual('mapas')}
            className={vistaActual === 'mapas' ? 'active' : ''}
          >
            🗺️ Mapas
          </button>
          <button 
            onClick={() => setVistaActual('trivia')}
            className={vistaActual === 'trivia' ? 'active' : ''}
          >
            🎯 Trivia
          </button>
          <button 
            onClick={() => setVistaActual('dashboard')}
            className={vistaActual === 'dashboard' ? 'active' : ''}
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => setVistaActual('profile')}
            className={vistaActual === 'profile' ? 'active' : ''}
          >
            👤 Perfil
          </button>
        </div>

        <div className="user-section">
          <div className="user-info">
            <span className="user-level">Nivel {usuario.nivel || 1}</span>
            <span className="user-points">⭐ {usuario.puntos || 0} pts</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Salir
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
          font-size: 1.5em;
          color: #333;
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
          font-size: 1em;
          transition: all 0.3s;
        }

        .nav-buttons button:hover {
          background: #f0f0f0;
          color: #333;
        }

        .nav-buttons button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          font-size: 1em;
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