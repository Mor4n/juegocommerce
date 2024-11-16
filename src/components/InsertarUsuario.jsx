import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase/client';

const InsertarUsuario = () => {
  const [usuario, setUsuario] = useState({
    //email,nombre,apellidos, direccion,telefono,creado_en,admin(booleano)
    nombre: '',
    apellidos: '',
    email: '',
    direccion: '',
    telefono: '',
    creado_en: '',
    admin: false,
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: name === 'admin' ? e.target.checked : value
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


    // Insertar el usuario en la base de datos
    const { error } = await supabase
      .from('usuario')
      .insert([usuario]);
      
    if (error) {
      console.error('Error al insertar usuario:', error);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Agregar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input type="text" name="nombre" className="form-control" value={usuario.nombre} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellidos</label>
          <textarea name="apellidos" className="form-control" value={usuario.apellidos} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="text" name="email" className="form-control" value={usuario.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Direccion</label>
          <input type="text" name="direccion" className="form-control" value={usuario.direccion} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Telefono</label>
          <input type="number" name="stock" className="form-control" value={usuario.telefono} onChange={handleChange} required />
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
        <button type="submit" className="btn btn-primary">Agregar usuario</button>
      </form>
    </div>
  );
};

export default InsertarUsuario;
