import React, { useEffect, useState } from 'react';
import supabase from '../supabase/client';

const EditarProducto = ({ producto, setActiveComponent }) => {
  const [productoData, setProductoData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen_url: '',
    stock: '',
    categoria: '',
    fecha_lanzamiento: '',
    plataforma: '',
    es_destacado: false,
    descuento: ''
  });

  const fetchProducto = async () => {
    const { data, error } = await supabase.from('productos').select('*').eq('id', producto.id).single();
    if (error) {
      console.error('Error fetching producto:', error);
    } else {
      setProductoData(data);
    }
  };

  useEffect(() => {
    if (producto) {
      fetchProducto();
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductoData({
      ...productoData,
      [name]: name === 'es_destacado' ? e.target.checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('productos')
      .update(productoData)
      .eq('id', productoData.id);

    if (error) {
      console.error('Error updating producto:', error);
    } else {
      alert('Producto actualizado correctamente');
      setActiveComponent('tabla');  // Mantenerse en la misma página pero volver a la tabla
    }
  };

  return (
    <div className="container mt-4">
      <h2>Editar Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={productoData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            className="form-control"
            value={productoData.descripcion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input
            type="number"
            name="precio"
            className="form-control"
            value={productoData.precio}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Imagen URL</label>
          <input
            type="text"
            name="imagen_url"
            className="form-control"
            value={productoData.imagen_url}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input
            type="number"
            name="stock"
            className="form-control"
            value={productoData.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <input
            type="text"
            name="categoria"
            className="form-control"
            value={productoData.categoria}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de Lanzamiento</label>
          <input
            type="date"
            name="fecha_lanzamiento"
            className="form-control"
            value={productoData.fecha_lanzamiento}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Plataforma</label>
          <input
            type="text"
            name="plataforma"
            className="form-control"
            value={productoData.plataforma}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            name="es_destacado"
            checked={productoData.es_destacado}
            onChange={handleChange}
          />
          <label className="form-check-label">Destacado</label>
        </div>
        <div className="mb-3">
          <label className="form-label">Descuento (%)</label>
          <input
            type="number"
            name="descuento"
            className="form-control"
            value={productoData.descuento}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Actualizar Producto</button>
      </form>
    </div>
  );
};

export default EditarProducto;
