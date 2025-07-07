import React, { useState } from 'react';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Timeline from './components/Timeline.jsx';
import Trivia from './components/Trivia.jsx';
import Dashboard from './components/Dashboard.jsx';

const App = () => {
  const [user, setUser] = useState(localStorage.getItem('username') || '');

  return (
    <div className="app" style={{ padding: '1rem' }}>
      {!user ? (
        <>
          <Home />
          <Login setUser={setUser} />
        </>
      ) : (
        <div>
          {/* Contenedor de cabecera con botón y saludo */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h1 style={{ margin: 0 }}>Bienvenido, {user}</h1>
            <button onClick={() => {
              localStorage.removeItem('username');
              localStorage.removeItem('puntajeTrivia');
              localStorage.removeItem('horaIngreso');
              setUser('');
            }} style={{
              backgroundColor: '#cc0000',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Cerrar sesión
            </button>
          </div>

          <Timeline />
          <Trivia />
          <Dashboard user={user} />
        </div>
      )}
    </div>
  );
};

export default App;
