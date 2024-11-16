// AdminPanel.js
import React, { useState } from 'react';
import NavSolo from '../components/NavSolo';
import GestionUsuarios from '../components/GestionUsuarios';
import AdministrarProductos from '../components/AdministrarProductos';


function Panel() {
  const [activeComponent, setActiveComponent] = useState('usuarios');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'usuarios':
        return <GestionUsuarios />;
      case 'productos':
        return <AdministrarProductos />;
      default:
        return <GestionUsuarios />;
    }
  };

  return (
    <>
      <NavSolo />
      <div className="container-fluid">
        <div className="row">
          <nav className="col-md-3 col-lg-2 d-md-block sidebar-custom">
            <div className="position-sticky pt-3">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeComponent === 'usuarios' ? 'active' : ''}`}
                    onClick={() => setActiveComponent('usuarios')}
                  >
                    Gestionar Usuarios
                  </button>
                </li>
                
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeComponent === 'productos' ? 'active' : ''}`}
                    onClick={() => setActiveComponent('productos')}
                  >
                    Administrar Productos
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            {renderComponent()}
          </main>
        </div>
      </div>
    </>
  );
}

export default Panel;
