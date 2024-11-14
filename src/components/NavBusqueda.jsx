import React, { useState } from 'react';
import supabase from '../supabase/client';
import { Link } from 'react-router-dom'; 

const NavBusqueda = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length < 3) {
      setFilteredProducts([]); // No buscar si la longitud del término es menor que 3
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('productos')
        .select('id, nombre, precio, descuento, imagen_url') 
        .ilike('nombre', `%${value}%`);

      if (error) throw error;

      setFilteredProducts(data);
    } catch (error) {
      console.error('Error al buscar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para calcular el precio con descuento
  const getDiscountedPrice = (price, discount) => {
    if (discount > 0) {
      return price - (price * discount / 100);
    }
    return price;
  };

  return (
    <div>
      <form className="d-flex me-auto" role="search">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Ingrese un juego"
          aria-label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="btn btn-outline-success" type="submit">
          Buscar
        </button>
      </form>

      {loading && <p>Buscando productos...</p>}

      {searchTerm && !loading && filteredProducts.length > 0 && (
        <ul className="list-group mt-3">
          {filteredProducts.map((producto) => {
            const discountedPrice = getDiscountedPrice(producto.precio, producto.descuento);
            return (
              <li key={producto.id} className="list-group-item d-flex align-items-center">
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="img-fluid"
                  style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                />
                <div>
                  <h5 className="mb-1">{producto.nombre}</h5>
                  <p className="mb-1">
                    <strong>Precio:</strong> ${discountedPrice.toFixed(2)}{' '}
                    {producto.descuento > 0 && (
                      <span className="text-muted text-decoration-line-through">
                        ${producto.precio.toFixed(2)}
                      </span>
                    )}
                  </p>
                </div>
                <Link to={`/juego/${producto.id}`} className="stretched-link" />
              </li>
            );
          })}
        </ul>
      )}

      {searchTerm && !loading && filteredProducts.length === 0 && (
        <p>No se encontraron productos.</p>
      )}
    </div>
  );
};

export default NavBusqueda;
