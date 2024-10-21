import React from 'react';
import './NotFound.css'; 

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>Ups, la página que buscas no existe u-u</p>
      <img
        src="\src\assets\404.gif"
        alt="404 - No encontrado"
        className="not-found-image"
      />
      <p>
        <a href="/">Volver al inicio</a>
      </p>
    </div>
  );
};

export default NotFound;