import { useEffect } from "react"
import supabase from "../supabase/client"
import { useNavigate } from "react-router-dom"
import JuegoFormulario from '../components/JuegoFormulario'




function Home() {
  
  const navigate = useNavigate();

  useEffect(() => {
    
    if(!supabase.auth.getUser()){ //Si no existe un usuario en nuestro auth.user local (no se inició sesión)
        navigate("/login"); //llevame al login
    }
  
    
  }, [navigate]);
  


  return (
    <div>
      <p>Home</p>

      <button type="button"  onClick={ () => supabase.auth.signOut()}>
        Cerrar sesión
      </button>
      <JuegoFormulario/>
    </div>
  )
}

export default Home
