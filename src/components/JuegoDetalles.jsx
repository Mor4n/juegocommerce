import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../supabase/client';
import Nav from './Nav';
import useCart from "../hooks/useCart";
import "./Principal.css"

function JuegoDetalles() {

    const {
        juegos,
        cart,
        agregarCarro,
        eliminarDeCarro,
        decrementarCantidad,
        incrementarCantidad,
        limpiarCarrito,
        setCart,
        vacio,
        totalPagar
    
    } = useCart();





  const { id } = useParams();
  const navigate = useNavigate();
  const [juego, setJuego] = useState(null);

  useEffect(() => {
    const fetchJuego = async () => {
      const { data, error } = await supabase.from('productos').select('*').eq('id', id).single();
      if (error) console.error("Error al obtener el juego:", error);
      else setJuego(data);
    };
    fetchJuego();
  }, [id]);


  if (!juego) return <p className="text-center mt-5">Cargando detalles...</p>;

  // Cálculo del precio con descuento si el juego tiene un valor en "descuento"
  const precioDescontado = juego.descuento ? juego.precio * (1 - juego.descuento / 100) : null;


  return (

    <>
    
    <Nav
    cart={cart}
    eliminarDeCarro={eliminarDeCarro}
    incrementarCantidad={incrementarCantidad}  
    decrementarCantidad={decrementarCantidad}    
    limpiarCarrito={limpiarCarrito}
    vacio={vacio}
    totalPagar={totalPagar}
    />  


<div className="container mt-5">
<button onClick={() => navigate(-1)} className="btn btn-primary mt-3">Volver atrás</button>
      <div className="card mb-3">
        <div className="row g-0">
          <div className="col-md-4">
            <img src={juego.imagen_url} width={310} className="img-fluid rounded-start producto" alt={juego.nombre} />
          </div>

          <div className="col-md-8">
            <div className="card-body">
              <h1 className="card-title">{juego.nombre}</h1>
              <p className="card-text"><strong>Descripcion:</strong> {juego.descripcion}</p>
              <p className="card-text"><strong>Precio:</strong> ${juego.precio}</p>

              {juego.descuento && (<>
                <p className="card-text"><strong>Descuento:</strong> {juego.descuento}%</p>
                <p className="card-text text-success">
                  <strong>Juego con descuento:</strong> ${precioDescontado.toFixed(2)}
                </p>
                </>
              )}


              <p className="card-text"><strong>Stock disponible:</strong> {juego.stock}</p>
              <p className="card-text"><strong>Categoría:</strong> {juego.categoria}</p>
              <p className="card-text"><strong>Fecha de lanzamiento:</strong> {juego.fecha_lanzamiento}</p>
              <p className="card-text"><strong>Plataforma:</strong> {juego.plataforma}</p>
              <button className="btn btn-primary" onClick={()=>agregarCarro(juego) /*{copia lo que tengo y agrega algo al carrito}*/}
                        >Añadir a carrito</button>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  

    </>
  );
}

export default JuegoDetalles;
