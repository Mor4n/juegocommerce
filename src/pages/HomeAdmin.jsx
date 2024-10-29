import { useContext, useEffect } from "react"
import supabase from "../supabase/client"
import { useNavigate } from "react-router-dom"
import JuegoFormulario from '../components/JuegoFormulario'
import {useImportarContextoProd} from "../context/ProdContext"



function HomeAdmin() {
  
  const navigate = useNavigate();

  {/* //!ACTIVAR CUANDO OCUPE LO DEL LOGIN
  const obj = useImportarContextoProd();

  console.log(obj);
  

  useEffect(() => {
    
    if(!supabase.auth.getUser()){ //Si no existe un usuario en nuestro auth.user local (no se inició sesión)
        navigate("/login"); //llevame al login
    }
  
    
  }, [navigate]);
  
  */
}


  return (
<>


<p>a</p>

{/*
<div>
      <p>Home</p>

      <button type="button"  onClick={ () => supabase.auth.signOut()}>
        Cerrar sesión
      </button>
      <JuegoFormulario/>
    </div>
 */
  }
  </>
  )
}

export default HomeAdmin
