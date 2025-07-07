import React, { useState } from 'react';

const Login = ({ setUser }) => {
  const [nombre, setNombre] = useState('');

  const handleLogin = () => {
    if (nombre.trim()) {
      localStorage.setItem('username', nombre.trim());
      localStorage.setItem('horaIngreso', new Date().toISOString());
      setUser(nombre.trim());
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }}>
      <label htmlFor="nombre" style={{ marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
        Ingresa tu Nombre:
      </label>
      <input
        id="nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Escribe tu nombre"
        style={{
          padding: '0.6rem 1rem',
          fontSize: '1rem',
          border: '1px solid #ccc',
          borderRadius: '6px',
          width: '100%',
          marginBottom: '1rem'
        }}
      />
      <button
        onClick={handleLogin}
        style={{
          padding: '0.6rem 1.2rem',
          fontSize: '1rem',
          backgroundColor: '#0d47a1',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          alignSelf: 'flex-start'
        }}
      >
        Ingresar
      </button>
    </div>
  );
};

export default Login;
