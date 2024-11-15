import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart'; 
import supabase from '../supabase/client';

const CompraRealizada = () => {
  const { cart, totalPagar, limpiarCarrito } = useCart();
  const [compraGuardada, setCompraGuardada] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [productosComprados, setProductosComprados] = useState([]);
  const [tiempoRestante, setTiempoRestante] = useState(5); // Tiempo restante para redirigir
  const navigate = useNavigate();
 const [folio, setFolio] = useState(""); // Estado para el folio de la compra

 const generarFolio = () => {
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  };
useEffect(() => {
    setFolio(generarFolio()); // Generar folio al iniciar
  }, []);
  

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user:', userError);
        return;
      }

      if (!user || !user.email) {
        console.error('No hay usuario logueado');
        return;
      }

      const { data, error } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', user.email)
        .single();

      if (error) {
        console.error('Error al obtener el ID del usuario:', error);
        return;
      }

      setUserId(data.id);
    };

    fetchUserData();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  useEffect(() => {
    if (!userId || cart.length === 0 || totalPagar === 0 || compraGuardada) return; // Evitar ejecución si ya se guardó la compra
  
    const realizarCompra = async () => {
      try {
        // Guardamos los productos solo después de realizar la compra
        const { data: compraData, error: errorCompra } = await supabase
          .from('pedidos')
          .insert([{ id: folio, usuario_id: userId, total: totalPagar, creado_en: new Date() }])
          .select();
  
        if (errorCompra) {
          if (errorCompra.code === '23505') {
            // Si el error es un conflicto de key, se ignora y seguimos con el resto pq está bien todo
            console.log('El folio ya existe, continuamos con el resto del proceso.');
          } else {
            throw errorCompra;
          }
        } else {
          const pedidoId = compraData[0].id;
  
          // Después, inserta los detalles del pedido usando el mismo `folio` para que quede en una bolsita
          const detallesCompra = cart.map(juego => ({
            pedido_id: folio, 
            producto_id: juego.id,
            cantidad: juego.cantidad,
            precio_unitario: juego.descuento
              ? (juego.precio * (1 - juego.descuento / 100)).toFixed(2)
              : juego.precio.toFixed(2),
          }));
  
          const { error: errorDetalle } = await supabase
            .from('detalle_pedidos')
            .insert(detallesCompra);
  
          if (errorDetalle) throw errorDetalle;
  
          // update productos después de que la compra se haya completado
          setProductosComprados([...cart]);
          setCompraGuardada(true); // update solo después de la compra
          limpiarCarrito(); // limpiar el carrito solo después de la compra
        }
      } catch (error) {
        setError('Hubo un problema al guardar la compra.');
        console.error('Error al realizar la compra:', error);
      }
    };
  
    realizarCompra();
  }, [userId, cart, totalPagar, limpiarCarrito, folio, compraGuardada]); // pa que no se ejecute varias veces
  

  useEffect(() => {
    if (compraGuardada) {
      const intervalo = setInterval(() => {
        setTiempoRestante(prev => {
          if (prev === 1) {
            clearInterval(intervalo); // Detener el intervalo cuando llegue a 0
            navigate('/'); // Redirigir a la página principal
          }
          return prev - 1; // Reducir el tiempo restante
        });
      }, 1000); // Actualizar cada segundo

      return () => clearInterval(intervalo); // Limpiar el intervalo cuando se desmonte el componente
    }
  }, [compraGuardada, navigate]); // Solo depende de compraGuardada y navigate

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Compra Realizada</h1>
      {compraGuardada ? (
        <div className="alert alert-success text-center">
          <h4 className="alert-heading">¡Compra Exitosa!</h4>
          <p>Tu compra ha sido registrada exitosamente. ¡Gracias por tu compra!</p>
          <hr />
          
          <div className="row mt-4">
            {productosComprados.map((producto, index) => (
              <div className="col-md-4" key={index}>
                <div className="card">
                  <img src={producto.imagen_url} alt={producto.nombre} className="card-img-top" />
                  <div className="card-body">
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text">Precio: ${producto.precio && producto.descuento 
            ? ((producto.precio * (1 - producto.descuento / 100)))
            : (producto.precio).toFixed(2)}</p>
                    <p className="card-text">Cantidad: {producto.cantidad}</p>
                    <p className="card-text">Subtotal: ${producto.precio && producto.descuento 
            ? (producto.precio * (1 - producto.descuento / 100) * producto.cantidad).toFixed(2)
            : (producto.precio * producto.cantidad).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <p>Serás redirigido a la página principal en {tiempoRestante} segundos...</p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p>Procesando tu compra...</p>
        </div>
      )}
      {error && <p className="text-danger text-center mt-3">{error}</p>}
    </div>
  );
};

export default CompraRealizada;
