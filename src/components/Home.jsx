import React from 'react';

const Home = () => {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://noticias.imer.mx/wp-content/uploads/2021/05/Colombia_conflicto_260521.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        color: '#fff',
        textAlign: 'center',
        borderRadius: '8px',
      }}
    >
     <h2 style={{ color: 'yellow', fontSize: '2rem', marginBottom: '1rem' }}>
        ¿Listo para descubrir la historia que no te contaron?
      </h2>
      <p style={{ fontSize: '1rem', color: 'white' }}>
        En Colombia, muchos jóvenes no conocen a fondo los hechos que han marcado nuestro pasado reciente. Esta plataforma busca <strong>fortalecer la memoria histórica</strong> de forma innovadora, combinando <strong>tecnología interactiva</strong>, <strong>narrativas visuales</strong> y <strong>retos gamificados</strong> que hacen del aprendizaje una experiencia participativa y significativa.
      </p>
      <h3 style={{ marginTop: '1rem', color: 'yellow' }}>Comencemos con tu recorrido por la historia de Colombia</h3>
    </div>
  );
};

export default Home;
