// src/pages/InsertProduct.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase/client';

const InsertarProducto = () => {
  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen_url: '',
    stock: '',
    categoria: '',
    fecha_lanzamiento: '',
    plataforma: '',
    es_destacado: false,
    descuento: '',
    userID: '', // Añadir el campo userID
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({
      ...producto,
      [name]: name === 'es_destacado' ? e.target.checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtener el ID del usuario logueado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error fetching user:', userError);
      return;
    }

    // Verificar que el usuario esté logueado
    if (!user || !user.id) {
      console.error('No hay usuario logueado');
      return;
    }

    // Añadir el ID del usuario al producto
    const newProduct = {
      ...producto,
      userID: user.id, // Asigna el ID del usuario al nuevo producto
    };

    // Insertar el producto en la base de datos
    const { error } = await supabase
      .from('productos')
      .insert([newProduct]);
      
    if (error) {
      console.error('Error inserting producto:', error);
    } else {
      navigate('/'); // Redirigir a la lista de productos después de la inserción
    }
  };

  return (
    <div className="container mt-4">
      <h2>Agregar Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input type="text" name="nombre" className="form-control" value={producto.nombre} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea name="descripcion" className="form-control" value={producto.descripcion} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input type="number" name="precio" className="form-control" value={producto.precio} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">URL de la Imagen</label>
          <input type="text" name="imagen_url" className="form-control" value={producto.imagen_url} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input type="number" name="stock" className="form-control" value={producto.stock} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <input type="text" name="categoria" className="form-control" value={producto.categoria} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de Lanzamiento</label>
          <input type="date" name="fecha_lanzamiento" className="form-control" value={producto.fecha_lanzamiento} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Plataforma</label>
          <input type="text" name="plataforma" className="form-control" value={producto.plataforma} onChange={handleChange} required />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" name="es_destacado" className="form-check-input" checked={producto.es_destacado} onChange={handleChange} />
          <label className="form-check-label">Destacar Producto</label>
        </div>
        <div className="mb-3">
          <label className="form-label">Descuento (%)</label>
          <input type="number" name="descuento" className="form-control" value={producto.descuento} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Agregar Producto</button>
      </form>
    </div>
  );
};

export default InsertarProducto;
