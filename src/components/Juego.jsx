/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import "./Juego.css"
import { useNavigate } from 'react-router-dom';

function Juego({juego, agregarCarro, cart}) {
    const {id, imagen_url, plataforma, nombre, precio, stock: stockInicial} = juego;
    const navigate = useNavigate();
    
    // Calcular stock disponible basado en el carrito
    const getStockDisponible = () => {
        const productoEnCarrito = cart.find(item => item.id === id);
        return productoEnCarrito ? stockInicial - productoEnCarrito.cantidad : stockInicial;
    };

    const [stockDisponible, setStockDisponible] = useState(getStockDisponible());

     // Verificar la cantidad actual del producto en el carrito
     const getCantidadEnCarrito = () => {
      const productoEnCarrito = cart.find(item => item.id === id);
      return productoEnCarrito ? productoEnCarrito.cantidad : 0;
  };

    // Actualizar stock cuando cambie el carrito
    useEffect(() => {
        setStockDisponible(getStockDisponible());
    }, [cart]);

    const verDetalles = () => {
        navigate(`/juego/${id}`);
    };

    const precioDescontado = juego.descuento 
        ? juego.precio * (1 - juego.descuento / 100) 
        : null;

 const handleAgregarCarro = () => {
        if (stockDisponible > 0 && getCantidadEnCarrito() < 5) {
            agregarCarro(juego);
            setStockDisponible(prev => prev - 1);
        }
    };

    // Verificar si el carrito ha alcanzado la cantidad máxima (5)
    const cantidadEnCarrito = getCantidadEnCarrito();
    const maxCantidadAlcanzada = cantidadEnCarrito >= 5;

    return (
        <div className="col-xl-3 col-lg-4 col-md-6 mb-3" key={id}>
            <div className="card producto" style={{cursor: 'pointer'}}>
                <img onClick={verDetalles} src={imagen_url} alt="Card image cap" />
                <div className="card-body">
                    <h6 className="card-subtitle mb-2 text-muted">{plataforma}</h6>
                    <h5 className="card-title">{nombre}</h5>
                    <p className="card-text"><strong>Precio:</strong> ${precio} MXN</p>
                    
                    {juego.descuento && (
                        <>
                            <p className="card-text">
                                <strong>Descuento:</strong> {juego.descuento}%
                            </p>
                            <p className="card-text text-success">
                                <strong>Juego con descuento:</strong> ${precioDescontado.toFixed(2)}
                            </p>
                        </>
                    )}
                    
                    <p className="card-text">
                        <strong>Stock disponible:</strong> {stockDisponible}
                    </p>
                    
                    <button 
                        className="btn btn-primary" 
                        onClick={handleAgregarCarro}
                        disabled={stockDisponible <= 0}
                    >
                        {maxCantidadAlcanzada ? 'Cantidad máxima' : stockDisponible > 0 ? 'Añadir a carrito' : 'Agotado'}
               
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Juego;