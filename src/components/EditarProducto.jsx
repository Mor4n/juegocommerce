// src/pages/EditProduct.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import  supabase  from '../supabase/client';
import Nav from './Nav';

const EditarProducto = () => {
    const { id } = useParams(); // Obtener el ID del producto de la URL
    const navigate = useNavigate();
    
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
      descuento: ''
    });
    
    const fetchProducto = async () => {
      const { data, error } = await supabase.from('productos').select('*').eq('id', id).single();
      if (error) {
        console.error('Error fetching producto:', error);
      } else {
        setProducto(data);
      }
    };
  
    useEffect(() => {
      fetchProducto();
    }, [id]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setProducto({
        ...producto,
        [name]: name === 'es_destacado' ? e.target.checked : value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const { error } = await supabase
        .from('productos')
        .update(producto)
        .eq('id', id);
        
      if (error) {
        console.error('Error updating producto:', error);
      } else {
        navigate('/'); // Redirigir a la lista de productos después de la edición
      }
    };
  
    return (
      <>
      
      
      <div className="container mt-4">
        <h2>Editar Producto</h2>
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
            <label className="form-check-label">Destacado</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Descuento (%)</label>
            <input type="number" name="descuento" className="form-control" value={producto.descuento} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary">Guardar Cambios</button>
        </form>
      </div>
      </>
    );
  };

export default EditarProducto;
