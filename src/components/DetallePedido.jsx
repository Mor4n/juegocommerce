  import React, { useEffect, useState } from 'react';
  import supabase from '../supabase/client';

  function DetallePedido({ pedidoId }) {
    const [detalle, setDetalle] = useState([]);
    const [totalPedido, setTotalPedido] = useState(0);
    const [creadoEn, setCreadoEn] = useState(''); 
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchDetalle = async () => {
        if (!pedidoId) {
          setError('El ID del pedido no es válido.');
          return;
        }

        const pedidoIdNumber = parseInt(pedidoId, 10);
        if (isNaN(pedidoIdNumber)) {
          setError('El ID del pedido es inválido.');
          return;
        }

        try {
          const { data: detalles, error: errorDetalles } = await supabase
            .from('detalle_pedidos')
            .select('producto_id, cantidad, precio_unitario')
            .eq('pedido_id', pedidoIdNumber);

          if (errorDetalles) {
            setError('Hubo un problema al obtener los detalles del pedido.');
            console.error('Error al obtener los detalles:', errorDetalles);
            return;
          }

          const productoIds = detalles.map((detalle) => detalle.producto_id);
          const { data: productosData, error: errorProductos } = await supabase
            .from('productos')
            .select('id, nombre, imagen_url')
            .in('id', productoIds);

          if (errorProductos) {
            setError('Hubo un problema al obtener los productos.');
            console.error('Error al obtener los productos:', errorProductos);
            return;
          }

          const productosConDetalles = detalles.map((detalle) => {
            const producto = productosData.find((prod) => prod.id === detalle.producto_id);
            return {
              ...detalle,
              nombre: producto ? producto.nombre : 'Producto no encontrado',
              imagen_url: producto ? producto.imagen_url : '',
            };
          });

          setDetalle(productosConDetalles);

          const { data: pedidoData, error: errorPedido } = await supabase
            .from('pedidos')
            .select('total, creado_en') 
            .eq('id', pedidoIdNumber)
            .single();

          if (errorPedido) {
            setError('Hubo un problema al obtener el total del pedido.');
            console.error('Error al obtener el total:', errorPedido);
            return;
          }

          setTotalPedido(Number(pedidoData.total) || 0);
          setCreadoEn(pedidoData.creado_en); // Establecer la fecha y hora obtenida
        } catch (error) {
          setError('Hubo un problema al obtener los detalles del pedido.');
          console.error('Error al obtener los detalles:', error);
        }
      };

      fetchDetalle();
    }, [pedidoId]);

    return (
      <div className="container mt-5">
        <h1 className="text-center mb-4">Detalles del Pedido #{pedidoId}</h1>
        {error && <p className="text-danger text-center">{error}</p>}
        
      
        {creadoEn && (
          <div className="text-center mb-4">
            <p>
              <strong>Fecha y hora de compra:</strong> {new Date(creadoEn).toLocaleString()}
            </p>
          </div>
        )}

        <div className="row">
          {detalle.length === 0 ? (
            <p className="text-center">No se encontraron detalles para este pedido.</p>
          ) : (
            detalle.map((item, index) => (
              <div className="col-md-4" key={index}>
                <div className="card">
                  <img src={item.imagen_url} alt={item.nombre} className="card-img-top" />
                  <div className="card-body">
                    <h5 className="card-title">{item.nombre}</h5>
                    <p className="card-text">Cantidad: {item.cantidad}</p>
                    <p className="card-text">Precio Unitario: ${item.precio_unitario.toFixed(2)}</p>
                    <p className="card-text">
                      Subtotal: ${(item.precio_unitario * item.cantidad).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <h3 className="text-right mt-4">Total: ${totalPedido.toFixed(2)}</h3>
      </div>
    );
  }

  export default DetallePedido;
