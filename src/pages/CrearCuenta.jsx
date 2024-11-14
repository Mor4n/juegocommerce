import { useState } from "react";
import supabase from '../supabase/client';
import { useNavigate, Link } from "react-router-dom";
import NavSolo from "../components/NavSolo";

function CrearCuenta() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validar si todos los campos están completos
    if (!email || !password || !nombre || !apellidos || !direccion || !telefono) {
      setErrorMessage("Rellene todos los campos");
      return;
    }

    const admin = false;
    const creado_en = new Date().toISOString(); // Marca de tiempo actual en formato ISO

    try {
      // Crear cuenta en Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      const { error: insertError } = await supabase.from('usuarios').insert([
        {
          email,
          nombre,
          apellidos,
          direccion,
          telefono,
          admin,
          creado_en,
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      console.log("Cuenta creada con éxito");
      setShowModal(true); // modal de éxito
    } catch (error) {
      console.error("Error durante la creación de la cuenta:", error.message);
      setErrorMessage(`Error al crear la cuenta. ${error.message}`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/login'); // inicio de sesión
  };

  return (
    <>
      <NavSolo />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            {/* Mostrar alert solo si hay un error */}
            {errorMessage && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error:</strong> {errorMessage}
                <button 
                  type="button" 
                  className="btn-close" 
                  aria-label="Close" 
                  onClick={() => setErrorMessage('')}
                ></button>
              </div>
            )}

            <div className="card">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Crear Cuenta</h3>
                <form onSubmit={handleSignUp}>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="nombre" 
                      placeholder="Tu nombre" 
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="apellidos" className="form-label">Apellidos</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="apellidos" 
                      placeholder="Tus apellidos" 
                      value={apellidos}
                      onChange={(e) => setApellidos(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="direccion" className="form-label">Dirección</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="direccion" 
                      placeholder="Tu dirección" 
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="telefono" 
                      placeholder="Tu teléfono" 
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo Electrónico</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                      placeholder="tucorreoelectronico@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="password" 
                      placeholder="Tu contraseña" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-success w-100">Crear Cuenta</button>
                </form>
                <div className="text-center mt-3">
                  <p>¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de éxito */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div> 
          <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">¡Cuenta Creada!</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Tu cuenta ha sido creada exitosamente, por favor, confirma tu correo electrónico.</p>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleCloseModal}
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default CrearCuenta;
