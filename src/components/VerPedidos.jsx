import React, { useEffect, useState } from 'react';
import supabase from '../supabase/client';

function VerPedidos({ onPedidoSelect }) {  // recibe la función para seleccionar pedido
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const { data, error } = await supabase
          .from('pedidos')
          .select('id, creado_en')
          .order('creado_en', { ascending: false });

        if (error) {
          setError('Hubo un problema al obtener los pedidos.');
          console.error('Error al obtener los pedidos:', error);
          return;
        }

        setPedidos(data);
      } catch (error) {
        setError('Hubo un problema al obtener los pedidos.');
        console.error('Error al obtener los pedidos:', error);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Ver Pedidos</h1>
      {error && <p className="text-danger text-center">{error}</p>}

      <ul className="list-group">
        {pedidos.length > 0 ? (
          pedidos.map((pedido) => (
            <li
              key={pedido.id}
              className="list-group-item d-flex justify-content-between align-items-center"
              onClick={() => onPedidoSelect(pedido.id)}  // call función pasada como prop
              style={{ cursor: 'pointer' }}
            >
              <span>Pedido #{pedido.id}</span>
              <span>{new Date(pedido.creado_en).toLocaleDateString()}</span>
            </li>
          ))
        ) : (
          <p className="text-center">No tienes pedidos realizados.</p>
        )}
      </ul>
    </div>
  );
}

export default VerPedidos;
