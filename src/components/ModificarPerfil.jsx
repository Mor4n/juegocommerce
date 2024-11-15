// src/pages/ModificarPerfil.js
import React, { useState, useEffect } from 'react';
import supabase from '../supabase/client';
import { useNavigate } from 'react-router-dom';

const ModificarPerfil = () => {
  const [userData, setUserData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    direccion: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      // obtener el usuario actual logueado
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user:', userError);
        return;
      }

      //  el usuario está logueado?
      if (!user || !user.email) {
        console.error('No hay usuario logueado');
        return;
      }

      // obten datos coincidentes
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error) {
        console.error('Error al obtener los datos del usuario:', error);
      } else {
        // rellena inputs
        setUserData({
          nombre: data.nombre || '',
          apellidos: data.apellidos || '',
          telefono: data.telefono || '',
          direccion: data.direccion || ''
        });
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // obtener user logeado
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error fetching user:', userError);
      return;
    }

    if (!user || !user.email) {
      console.error('No hay usuario logueado');
      return;
    }

    // update
    const { error } = await supabase
      .from('usuarios')
      .update({
        nombre: userData.nombre,
        apellidos: userData.apellidos,
        telefono: userData.telefono,
        direccion: userData.direccion,
      })
      .eq('email', user.email);

    if (error) {
      console.error('Error al actualizar los datos:', error);
      setMessage('Error al actualizar los datos.');
    } else {
      setMessage('¡Datos actualizados con éxito!');

    }
  };

  if (loading) return <div>Cargando datos...</div>;

  return (
    <div className="container mt-4">
      <h2>Modificar Perfil</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={userData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellidos</label>
          <input
            type="text"
            className="form-control"
            name="apellidos"
            value={userData.apellidos}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="number"
            className="form-control"
            name="telefono"
            value={userData.telefono}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            name="direccion"
            value={userData.direccion}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Actualizar Datos</button>
      </form>
    </div>
  );
};

export default ModificarPerfil;
