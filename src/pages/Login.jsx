import { useEffect, useState } from "react";
import supabase from '../supabase/client';
import { useNavigate, Link } from "react-router-dom";
import NavSolo from "../components/NavSolo";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      console.log("Login exitoso");
      navigate('/'); 
    } catch (error) {
      console.error("Error en login:", error.message);
      setErrorMessage(error.message);
    }
  };

  const closeAlert = () => {
    setErrorMessage(''); // Limpiareé el mensaje de error para ocultar la alerta
  };

  
  return (<>

  <NavSolo/>
  <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {errorMessage && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Error:</strong> {errorMessage}
              <button type="button" className="btn-close" onClick={closeAlert}></button>
            </div>
          )}
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Iniciar Sesión</h3>
              <form onSubmit={handleSubmit}>
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
                <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
              </form>
              <div className="text-center mt-3">
                <p>¿No tienes una cuenta? <Link to="/registro">Crear Cuenta</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;
