/* eslint-disable react/prop-types */
import { useEffect,useState } from "react";
import "./nav.css"
import { useNavigate } from "react-router-dom"
import supabase from "../supabase/client";
import Checkout from "./Checkout";

function Nav({cart,eliminarDeCarro,incrementarCantidad,decrementarCantidad,limpiarCarrito,vacio,totalPagar}) {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary " data-bs-theme="dark">
  <div className="container-fluid">
    <a className="navbar-brand" href="/">
    <img src="\src\assets\Logo1.png" alt="Logo de JuegoCommerce" width="120" height="27"></img>
    </a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="/">Inicio</a>
        </li>

        
        
        {/*
        <li className="nav-item">
          <a className="nav-link" href="#">Inicio</a>
        </li> */
        }
       
      </ul>
      <form className="d-flex me-auto" role="search">
        <input className="form-control me-2" type="search" placeholder="Ingrese un juego" aria-label="Search"></input>
        <button className="btn btn-outline-success" type="submit">Buscar</button>
      </form>
      


      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
       <li className="nav-item">
       {user ? (
                <div className="nav-link">
                                    
                                    <span style={{ cursor: 'pointer', margin:'0px 30px 0px 0px' }} onClick={()=> navigate('/')}>Bienvenido, {user.user_metadata.email}</span>
 
                                    <span style={{ cursor: 'pointer', margin:'0px 0px 0px 50px' }} onClick={handleLogout}>Cerrar sesión</span>

                  </div>
               
              ) : (
                <button className="nav-link active" type="button" onClick={() => navigate('/login')}>Iniciar sesión</button>
              )}
        </li>  
      </ul>


      
      <div className="carrito">
        <img className="img-fluid" src="\img\carrito.png" alt="imagen carrito" width={30} />
       
        <div id="carrito" className="bg-dark p-3">
                            
                            {vacio ?
                            (<p className="text-center text-white">El carrito esta vacio</p>)
                            :
                            (
                              <>
                            <table className="w-100 table">
                                <thead>
                                    <tr>
                                        <th>Imagen</th>
                                        <th>Nombre</th>
                                        <th>Precio</th>
                                        <th>Cantidad</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                  {cart.map (juego=>(

                                  
                                    <tr key={juego.id}>
                                        <td>
                                            <img className="img-fluid" src={juego.imagen_url} alt="Imagen juego" />
                                        </td>
                                        <td>{juego.nombre}</td>
                                        <td className="fw-bold">
                                        ${juego.descuento ? (juego.precio * (1 - juego.descuento / 100)).toFixed(2) : juego.precio} MXN

                                        </td>
                                        <td className="flex align-items-start gap-4">
                                            <button type="button" className="btn btn-dark" onClick={()=>decrementarCantidad(juego.id)} >
                                                -
                                            </button>
                                                {juego.cantidad}
                                            <button type="button" className="btn btn-dark" onClick={()=>incrementarCantidad(juego.id)}>
                                                +
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger" type="button" onClick={()=>eliminarDeCarro(juego.id)}>
                                                X
                                            </button>
                                        </td>
                                    </tr>
                                  ))}
                                </tbody>
                            </table>

                            <p className="text-end text-white">Total pagar: <span className="fw-bold">$ {totalPagar.toFixed(2)} MXN</span></p>

                            </>

                          )
                          }
                            <Checkout/>
                            <button className="btn btn-light w-100 mt-3 p-2" onClick={limpiarCarrito}>Vaciar Carrito</button>

      </div>
      </div>

     

    </div>
  </div>
</nav>
    

    
  )
}

export default Nav
