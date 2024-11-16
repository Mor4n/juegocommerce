import React, { useState } from 'react';
import InsertarProducto from './InsertarProducto';
import EditarProducto from './EditarProducto';
import TablaJuegos from './TablaJuegos';

function AdministrarProductos() {
  const [activeComponent, setActiveComponent] = useState('tabla');
  const [productoAEditar, setProductoAEditar] = useState(null);

  const handleEditClick = (producto) => {
    setProductoAEditar(producto);
    setActiveComponent('editar');
  };

  const handleInsertClick = () => {
    setActiveComponent('insertar');
  };

  const handleGoBackToTable = () => {
    setActiveComponent('tabla');
    setProductoAEditar(null);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'insertar':
        return <InsertarProducto onGoBack={handleGoBackToTable} />;
      case 'editar':
        return <EditarProducto producto={productoAEditar} onGoBack={handleGoBackToTable} />;
      case 'tabla':
      default:
        return <TablaJuegos onEdit={handleEditClick} onInsert={handleInsertClick} />;
    }
  };

  return (
    <div className="container mt-4">
      <h2>Administrar Productos</h2>
      {renderComponent()}
    </div>
  );
}

export default AdministrarProductos;
