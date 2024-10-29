import { Routes,Route, useNavigate, } from 'react-router-dom'


import HomeAdmin from './HomeAdmin'
import Login from './Login'
import NotFound from './NotFound'
import { ProdContextProvider } from '../context/ProdContext'

import Principal from '../components/Principal'
import Nav from '../components/Nav'
import { useEffect } from 'react'
import supabase from '../supabase/client'
import JuegoDetalles from '../components/JuegoDetalles'




/*Home será visitado  */
function App() {

  const navigate = useNavigate();

  /*
  !ACTIVAR CUANDO SEA NECESARIO ENTRAR A LA PAGINA ADMIN
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) =>{
        //Si la sesión no existe
      if(!session){
          navigate('/login'); //Si no está autenticado, no refresques la página, sólo muestrale el login
      }

    })
  
  }, [])
  

  */

  return (
    <ap className="App">
        <ProdContextProvider>
          <Routes>

            <Route path="/" element={<Principal/>}></Route>
            <Route path="/HomeAdmin" element={<HomeAdmin />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/juego/:id" element={<JuegoDetalles />} />
          </Routes>
        </ProdContextProvider>
        
    </ap>
  )
}

export default App
