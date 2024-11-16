import React, { useEffect, useState } from 'react';
import supabase from '../supabase/client';
import EditarUsuario from './EditarUsuario';

const TablaUsuarios = ({ onEdit, onGoBack }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioIdToDelete, setUsuarioIdToDelete] = useState(null);
  const [nombreABorrar, setNombreABorrar] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [showResultModal, setShowResultModal] = useState(false);

  const fetchUsuarios = async () => {
    const { data, error } = await supabase.from('usuarios').select('*');
    if (error) {
      console.error('Error fetching usuarios:', error);
    } else {
      setUsuarios(data);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleDeleteClick = (id, nombre) => {
    setUsuarioIdToDelete(id);
    setNombreABorrar(nombre);
  };

  // Función para eliminar un usuario
  const deleteUser = async (id) => {
    const { error } = await supabase.from('usuarios').delete().eq('id', id);
    if (error) {
      setResultMessage(`Hubo un error: ${error.message}`);
      setShowResultModal(true);
    } else {
      setResultMessage(`Se ha eliminado ${nombreABorrar} exitosamente.`);
      fetchUsuarios(); // Refrescar la lista de usuarios
      setShowResultModal(true);
    }
  };

  const handleEditClick = (usuario) => {
    onEdit(usuario);  // Llamamos a la función pasada desde el componente padre (GestionUsuarios)
  };

  return (
    <div className="container mt-4">
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Dirección</th>
              <th>Telefono</th>
              <th>Fecha de creación</th>
              <th>Admin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.email}</td>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellidos}</td>
                <td>{usuario.direccion}</td>
                <td>{usuario.telefono}</td>
                <td>{new Date(usuario.creado_en).toLocaleDateString()}</td>
                <td>{usuario.admin ? 'Sí' : 'No'}</td>
                <td>
                  <button className="btn btn-warning me-2" onClick={() => handleEditClick(usuario)}>
                    Modificar
                  </button>

                  {/* Botón de eliminación */}
                  <button
                    className="btn btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#confirmDeleteModal"
                    onClick={() => handleDeleteClick(usuario.id, usuario.nombre)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Confirmación de eliminación */}
      <div className="modal fade" id="confirmDeleteModal" tabIndex="-1" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-light">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmDeleteModalLabel">Confirmar Eliminación</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>¿Está seguro de que desea eliminar el usuario <strong>{nombreABorrar}</strong>?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-danger"
                onClick={() => {
                  deleteUser(usuarioIdToDelete);
                  setUsuarioIdToDelete(null); // Resetear el ID del usuario
                }} data-bs-dismiss="modal">Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Resultado de la eliminación */}
      <div className={`modal fade ${showResultModal ? 'show confirmacion' : ''}`} style={{ display: showResultModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content bg-light modal-bg-gray">
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

export default TablaUsuarios;
