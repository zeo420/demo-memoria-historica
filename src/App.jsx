import React, { useState } from 'react';
import { authAPI } from './services/api';
import Login from './components/Login';
import Home from './components/Home';
import Timeline from './components/Timeline';
import Trivia from './components/Trivia';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import ResultadosTrivia from './components/ResultadosTrivia';

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
    setUsuario({...usuario, ...updatedUser});
  };

  if (!usuario) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <nav className="navbar">
        <h1>🇨🇴 Memoria Histórica</h1>
        <div className="nav-buttons">
          <button onClick={() => setVistaActual('home')}>🏠 Inicio</button>
          <button onClick={() => setVistaActual('timeline')}>📅 Línea de Tiempo</button>
          <button onClick={() => setVistaActual('trivia')}>🎯 Trivia</button>
          <button onClick={() => setVistaActual('dashboard')}>📊 Dashboard</button>
          <button onClick={() => setVistaActual('profile')}>👤 Perfil</button>
          <button onClick={handleLogout} className="logout-btn">🚪 Salir</button>
        </div>
        <div className="user-info">
          <span>Nivel {usuario.nivel || 1}</span>
          <span>⭐ {usuario.puntos || 0} pts</span>
        </div>
      </nav>

      <main>
        {vistaActual === 'home' && <Home />}
        {vistaActual === 'timeline' && <Timeline />}
        {vistaActual === 'trivia' && <Trivia usuario={usuario} />}
        {vistaActual === 'dashboard' && <Dashboard />}
        {vistaActual === 'profile' && <Profile usuario={usuario} onUpdate={handleProfileUpdate} />}
        {vistaActual === 'resultados' && <ResultadosTrivia />}
      </main>
    </div>
  );
}

export default App;