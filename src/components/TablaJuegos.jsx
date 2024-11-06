// src/components/ProductsTable.js
import React, { useEffect, useState } from 'react';
import  supabase  from '../supabase/client';
import Nav from "./Nav"
import "./modalgris.css"
import { Link } from 'react-router-dom';

const TablaJuegos = () => {
    const [productos, setProductos] = useState([]);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [nombreABorrar, setNombreABorrar] = useState(''); 
  const [resultMessage, setResultMessage] = useState('');
  const [showResultModal, setShowResultModal] = useState(false);

  // Función para obtener productos
  const fetchProductos = async () => {
    const { data, error } = await supabase.from('productos').select('*');
    if (error) console.error('Error fetching productos:', error);
    else setProductos(data);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleDeleteClick = (id, nombre) => {
    setProductIdToDelete(id);
    setNombreABorrar(nombre); 
  };

  // Función para eliminar un producto
  const deleteProduct = async (id) => {
    const { error } = await supabase.from('productos').delete().eq('id', id);
    if (error) {
      setResultMessage(`Hubo un error: ${error.message}`);
      setShowResultModal(true);
    } else {
      setResultMessage(`Se ha eliminado ${nombreABorrar} exitosamente.`);
      fetchProductos(); // Refrescar la lista
      setShowResultModal(true);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Productos</h2>
      <Link to="/insertarjuego" className="btn btn-success mb-3">Agregar Producto</Link>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Imagen</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Fecha de Lanzamiento</th>
              <th>Plataforma</th>
              <th>Destacado</th>
              <th>Descuento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.precio}</td>
                <td><img src={producto.imagen_url} alt={producto.nombre} style={{ width: '50px' }} /></td>
                <td>{producto.stock}</td>
                <td>{producto.categoria}</td>
                <td>{new Date(producto.fecha_lanzamiento).toLocaleDateString()}</td>
                <td>{producto.plataforma}</td>
                <td>{producto.es_destacado ? 'Sí' : 'No'}</td>
                <td>{producto.descuento}%</td>
                <td>
  <Link to={`/editarjuego/${producto.id}`} className="btn btn-warning me-2">
    Modificar
  </Link>
  <button 
    className="btn btn-danger" 
    data-bs-toggle="modal" 
    data-bs-target="#confirmDeleteModal" 
   onClick={() => handleDeleteClick(producto.id, producto.nombre)}>
    Eliminar
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Confirmación */}
      <div className="modal fade" id="confirmDeleteModal" tabIndex="-1" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-light"> {/* Cambia a un fondo gris claro aquí */}
            <div className="modal-header">
              <h5 className="modal-title" id="confirmDeleteModalLabel">Confirmar Eliminación</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>¿Está seguro de que desea eliminar el juego <strong>{nombreABorrar}</strong>?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-danger" 
                onClick={() => {
                  deleteProduct(productIdToDelete);
                  setProductIdToDelete(null); // Resetear el ID del producto
                }} data-bs-dismiss="modal">Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Resultado */}
      <div className={`modal fade ${showResultModal ? 'show confirmacion' : ''}`} style={{ display: showResultModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content bg-light modal-bg-gray"> {/* Aplicar fondo gris aquí */}
            <div className="modal-header">
              <h5 className="modal-title">Resultado de la Eliminación</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowResultModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>{resultMessage}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setShowResultModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaJuegos;
