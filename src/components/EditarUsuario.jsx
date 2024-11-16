import React, { useState, useEffect } from 'react';
import supabase from '../supabase/client';

const EditarUsuario = ({ usuario }) => {
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellidos: '',
    direccion: '',
    telefono: '',
    admin: false
  });

  // Verifica si los datos de usuario han cambiado y actualiza el formulario
  useEffect(() => {
    if (usuario) {
      console.log('Cargando datos del usuario para editar:', usuario);  // Verifica los datos del usuario
      setFormData((prevFormData) => {
        if (
          prevFormData.email !== usuario.email ||
          prevFormData.nombre !== usuario.nombre ||
          prevFormData.apellidos !== usuario.apellidos ||
          prevFormData.direccion !== usuario.direccion ||
          prevFormData.telefono !== usuario.telefono ||
          prevFormData.admin !== usuario.admin
        ) {
          return {
            email: usuario.email,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            direccion: usuario.direccion,
            telefono: usuario.telefono,
            admin: usuario.admin
          };
        }
        return prevFormData;
      });
    }
  }, [usuario]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, nombre, apellidos, direccion, telefono, admin } = formData;
    console.log('Datos enviados para actualizar:', formData);  // Verifica los datos antes de enviarlos

    const { error } = await supabase
      .from('usuarios')
      .update({ email, nombre, apellidos, direccion, telefono, admin })
      .eq('id', usuario.id);

    if (error) {
      alert('Error al actualizar el usuario:', error.message);
    } else {
      alert('Usuario actualizado exitosamente.');
    }
  };

  return (
    <div>
      <h2>Modificar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            className="form-control"
            value={formData.nombre}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellidos</label>
          <input
            type="text"
            name="apellidos"
            className="form-control"
            value={formData.apellidos}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            name="direccion"
            className="form-control"
            value={formData.direccion}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            className="form-control"
            value={formData.telefono}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Admin</label>
          <input
            type="checkbox"
            name="admin"
            className="form-check-input"
            checked={formData.admin}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditarUsuario;
