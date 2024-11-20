import React, { useEffect, useState } from 'react';
import supabase from '../supabase/client';

const TablaUsuarios = ({ onEdit, onGoBack }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioIdToDelete, setUsuarioIdToDelete] = useState(null);
  const [nombreABorrar, setNombreABorrar] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [showResultModal, setShowResultModal] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [orden, setOrden] = useState('asc');
  const [campoOrdenar, setCampoOrdenar] = useState('id');

  // Obtener la lista de usuarios
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

  // Función para filtrar los usuarios
  const filterUsuarios = (query = '') => {
    const lowercasedQuery = query ? query.toLowerCase() : '';

    return usuarios.filter((usuario) => {
      return (
        String(usuario.id).includes(lowercasedQuery) ||
        (usuario.email && usuario.email.toLowerCase().includes(lowercasedQuery)) ||
        (usuario.nombre && usuario.nombre.toLowerCase().includes(lowercasedQuery)) ||
        (usuario.apellidos && usuario.apellidos.toLowerCase().includes(lowercasedQuery)) ||
        (usuario.direccion && usuario.direccion.toLowerCase().includes(lowercasedQuery)) ||
        (usuario.telefono && String(usuario.telefono).includes(lowercasedQuery)) ||
        (usuario.creado_en && new Date(usuario.creado_en).toLocaleDateString().includes(lowercasedQuery)) 
      );
    });
  };

  // Función para ordenar los usuarios
  const sortUsuarios = (usuarios) => {
    return usuarios.sort((a, b) => {
      if (campoOrdenar === 'id' || campoOrdenar === 'telefono') {
        return orden === 'asc' ? a[campoOrdenar] - b[campoOrdenar] : b[campoOrdenar] - a[campoOrdenar];
      }
      if (campoOrdenar === 'creado_en') {
        const dateA = new Date(a[campoOrdenar]);
        const dateB = new Date(b[campoOrdenar]);
        return orden === 'asc' ? dateA - dateB : dateB - dateA;
      }
      const valA = a[campoOrdenar] ? a[campoOrdenar].toLowerCase() : '';
      const valB = b[campoOrdenar] ? b[campoOrdenar].toLowerCase() : '';
      return orden === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  };

  // Filtrar y ordenar usuarios antes de renderizarlos
  const filteredAndSortedUsuarios = sortUsuarios(filterUsuarios(filtro));

  return (
    <div className="container mt-4">
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            onChange={(e) => {
              const [campo, orden] = e.target.value.split('-');
              setCampoOrdenar(campo);
              setOrden(orden);
            }}
          >
            <option value="id-asc">Ordenar por ID (ascendente)</option>
            <option value="id-desc">Ordenar por ID (descendente)</option>
            <option value="email-asc">Ordenar por Email (A-Z)</option>
            <option value="email-desc">Ordenar por Email (Z-A)</option>
            <option value="nombre-asc">Ordenar por Nombre (A-Z)</option>
            <option value="nombre-desc">Ordenar por Nombre (Z-A)</option>
            <option value="apellidos-asc">Ordenar por Apellidos (A-Z)</option>
            <option value="apellidos-desc">Ordenar por Apellidos (Z-A)</option>
            <option value="creado_en-asc">Ordenar por Fecha de creación (más antigua)</option>
            <option value="creado_en-desc">Ordenar por Fecha de creación (más reciente)</option>
            <option value="admin-asc">Ordenar por Admin (No Admin primero)</option>
            <option value="admin-desc">Ordenar por Admin (Admin primero)</option>
          </select>
        </div>
      </div>

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
            {filteredAndSortedUsuarios.map((usuario) => (
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
                  <button className="btn btn-warning me-2" onClick={() => onEdit(usuario)}>
                    Modificar
                  </button>

                  {/* Botón de eliminación */}
                  <button
                    className="btn btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#confirmDeleteModal"
                    onClick={() => {
                      setUsuarioIdToDelete(usuario.id);
                      setNombreABorrar(usuario.nombre);
                    }}
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
              <button type="button" className="btn btn-primary" onClick={() => setShowResultModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default TablaUsuarios;
