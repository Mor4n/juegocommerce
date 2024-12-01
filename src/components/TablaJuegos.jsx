import React, { useEffect, useState } from 'react';
import supabase from '../supabase/client';
import Nav from './Nav';
import './modalgris.css';
import InsertarProducto from './InsertarProducto';
import EditarProducto from './EditarProducto';

const TablaJuegos = () => {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]); // Estado para productos filtrados
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [nombreABorrar, setNombreABorrar] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [showResultModal, setShowResultModal] = useState(false);
  const [activeComponent, setActiveComponent] = useState('tabla');
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('precioAsc'); // Estado para el criterio de ordenación
  const [searchQuery, setSearchQuery] = useState(''); // Estado para el cuadro de búsqueda

  // Función para obtener productos
  const fetchProductos = async () => {
    const { data, error } = await supabase.from('productos').select('*');
    if (error) console.error('Error fetching productos:', error);
    else {
      setProductos(data);
      setFilteredProductos(data); // Inicializar los productos filtrados con todos los productos
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Función para filtrar productos basados en la búsqueda
  const filterProducts = (query) => {
    if (!query) {
      setFilteredProductos(productos); // Si no hay búsqueda, mostrar todos los productos
    } else {
      const filtered = productos.filter((producto) => {
        return (
          producto.id.toString().includes(query) || // Filtrar por ID
          producto.nombre.toLowerCase().includes(query.toLowerCase()) || // Filtrar por Nombre
          producto.descripcion.toLowerCase().includes(query.toLowerCase()) || // Filtrar por Descripción
          producto.precio.toString().includes(query) || // Filtrar por Precio
          producto.categoria.toLowerCase().includes(query.toLowerCase()) || // Filtrar por Categoría
          producto.plataforma.toLowerCase().includes(query.toLowerCase()) || // Filtrar por Plataforma
          producto.stock.toString().includes(query) || // Filtrar por Precio
          new Date(producto.fecha_lanzamiento).toLocaleDateString().includes(query) // Filtrar por Fecha de Lanzamiento
        );
      });
      setFilteredProductos(filtered);
    }
  };

  // Cambiar el texto del cuadro de búsqueda y aplicar el filtro
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterProducts(query);
  };

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

  // Función para ordenar productos
  const sortProducts = (criteria) => {
    const sortedProducts = [...filteredProductos];
    switch (criteria) {
      case 'precioAsc':
        sortedProducts.sort((a, b) => a.precio - b.precio);
        break;
      case 'precioDesc':
        sortedProducts.sort((a, b) => b.precio - a.precio);
        break;
      case 'nombreAsc':
        sortedProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombreDesc':
        sortedProducts.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'fechaAsc':
        sortedProducts.sort((a, b) => new Date(a.fecha_lanzamiento) - new Date(b.fecha_lanzamiento));
        break;
      case 'fechaDesc':
        sortedProducts.sort((a, b) => new Date(b.fecha_lanzamiento) - new Date(a.fecha_lanzamiento));
        break;
      case 'idAsc':
        sortedProducts.sort((a, b) => a.id - b.id);
        break;
      case 'idDesc':
        sortedProducts.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }
    setFilteredProductos(sortedProducts);
  };

  // Cambiar el criterio de ordenación
  const handleSortChange = (event) => {
    const selectedCriteria = event.target.value;
    setSortCriteria(selectedCriteria);
    sortProducts(selectedCriteria);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'tabla':
        return (
          <div className="table-responsive">
            <div className="d-flex justify-content-between mb-3">
              <h2>Productos</h2>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control me-3"
                  placeholder="Buscar por ID, Nombre, Descripción,  Precio, Stock, Categoría, Plataforma, Fecha de Lanzamiento"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <select
                  className="form-select"
                  value={sortCriteria}
                  onChange={handleSortChange}
                >
                  <option value="precioAsc">Precio: Menor a Mayor</option>
                  <option value="precioDesc">Precio: Mayor a Menor</option>
                  <option value="nombreAsc">Nombre: A - Z</option>
                  <option value="nombreDesc">Nombre: Z - A</option>
                  <option value="fechaAsc">Fecha de Lanzamiento: Más Antigua</option>
                  <option value="fechaDesc">Fecha de Lanzamiento: Más Reciente</option>
                  <option value="idAsc">ID: Menor a Mayor</option>
                  <option value="idDesc">ID: Mayor a Menor</option>
                </select>
              </div>
            </div>
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
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProductos.map((producto) => (
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
                    <td>
                      <button className="btn btn-warning me-2" onClick={() => {
                        setSelectedProducto(producto);  // Establecer el producto seleccionado
                        setActiveComponent('editar');  // Cambiar el componente activo a "editar"
                      }}>
                        Modificar
                      </button>

                      <button
                        className="btn btn-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#confirmDeleteModal"
                        onClick={() => handleDeleteClick(producto.id, producto.nombre)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'insertar':
        return <InsertarProducto setActiveComponent={setActiveComponent} />;
      case 'editar':
        return <EditarProducto producto={selectedProducto} setActiveComponent={setActiveComponent} />;
      default:
        return <div>Componente no encontrado</div>;
    }
  };

  return (
    <div className="container mt-4">
      {activeComponent === 'tabla' && (
        <>
          <button className="btn btn-success mb-3" onClick={() => setActiveComponent('insertar')}>Agregar Producto</button>
        </>
      )}

      {renderComponent()}

      <div className="modal fade" id="confirmDeleteModal" tabIndex="-1" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-light">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmDeleteModalLabel">Confirmar Eliminación</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar el producto {nombreABorrar}?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-danger" onClick={() => deleteProduct(productIdToDelete)}>Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Resultado */}
      <div className={`modal fade ${showResultModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showResultModal ? 'block' : 'none' }} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-light">
            <div className="modal-header">
              <h5 className="modal-title">Resultado</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setShowResultModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>{resultMessage}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowResultModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaJuegos;
