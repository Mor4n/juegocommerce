/* eslint-disable react/prop-types */

//!Componente de juego, tarjeta que se agrega con cada juego en el inicio


import "./Juego.css"
import { useNavigate } from 'react-router-dom';


function Juego({juego,agregarCarro}) {

    const{id,imagen_url,plataforma,nombre,precio} = juego
    const navigate = useNavigate();

    const verDetalles = () => {
        navigate(`/juego/${juego.id}`);
      };


    return (
        <>
              <div className="col-xl-3 col-lg-4 col-md-6 mb-3" key={id} >
                <div className="card producto" style={{cursor: 'pointer'}} onClick={()=>console.log(juego.nombre)}>
                    {/*
                    Recuerdo de primer intento :D:
                    <img src="https://cdn5.travelconline.com/unsafe/fit-in/2000x0/filters:quality(75):strip_metadata():format(webp)/https%3A%2F%2Ftr2storage.blob.core.windows.net%2Fimagenes%2FCepFu9RAtqVN-YZCPyV6ulrjpeg.jpeg" alt="Card image cap"></img> */}
                    <img onClick={verDetalles} src={imagen_url} alt="Card image cap" ></img>
                    <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">{plataforma}</h6>
                        <h5 className="card-title">{nombre}</h5>
                        <p className="card-text">$ {precio} MXN</p>
                        <button className="btn btn-primary" onClick={()=>agregarCarro(juego) /*{copia lo que tengo y agrega algo al carrito}*/}
                        >Añadir a carrito</button>
                        
                    </div>
                </div>
            </div>
   
        </>
    );
}

export default Juego;