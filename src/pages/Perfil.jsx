// Perfil.js
import React, { useState } from 'react';
import NavSolo from '../components/NavSolo';
import ModificarPerfil from '../components/ModificarPerfil';
import VerPedidos from '../components/VerPedidos';
import DetallePedido from '../components/DetallePedido'; 
import '../components/Perfil.css';

function Perfil() {
  const [activeComponent, setActiveComponent] = useState('modificar');
  const [selectedPedido, setSelectedPedido] = useState(null);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'modificar':
        return <ModificarPerfil />;
      case 'pedidos':
        return <VerPedidos onPedidoSelect={handlePedidoSelect} />;
      case 'detalle':
        return <DetallePedido pedidoId={selectedPedido} />;  
      default:
        return <ModificarPerfil />;
    }
  };

  const handlePedidoSelect = (pedidoId) => {
    setSelectedPedido(pedidoId);
    setActiveComponent('detalle'); // cambia view de detalles del pedido
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
                    className={`nav-link ${activeComponent === 'modificar' ? 'active' : ''}`}
                    onClick={() => setActiveComponent('modificar')}
                  >
                    Modificar Perfil
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeComponent === 'pedidos' ? 'active' : ''}`}
                    onClick={() => setActiveComponent('pedidos')}
                  >
                    Ver Pedidos Actuales
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

export default Perfil;
