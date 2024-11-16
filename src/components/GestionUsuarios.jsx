import React, { useState } from 'react';
import EditarUsuario from './EditarUsuario';
import TablaUsuarios from './TablaUsuarios';

function GestionUsuarios() {
  const [activeComponent, setActiveComponent] = useState('tabla');
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  const handleEditClick = (usuario) => {
    setUsuarioAEditar(usuario);
    setActiveComponent('editar');
  };

  const handleGoBackToTable = () => {
    setActiveComponent('tabla');
    setUsuarioAEditar(null);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'editar':
        return (
          <EditarUsuario
            usuario={usuarioAEditar}
            onGoBack={handleGoBackToTable}
          />
        );
      case 'tabla':
      default:
        return (
          <TablaUsuarios
            onEdit={handleEditClick}
            onGoBack={handleGoBackToTable}
          />
        );
    }
  };

  return (
    <div className="container mt-4">
      <h2>Administrar Usuarios</h2>
      {renderComponent()}
    </div>
  );
}

export default GestionUsuarios;
