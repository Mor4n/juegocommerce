import { Routes,Route, useNavigate } from 'react-router-dom'
import './App.css'
import Home from './Home'
import Login from './Login'
import NotFound from './NotFound'
import { useEffect } from 'react'
import supabase from '../supabase/client'





/*Home será visitado  */
function App() {

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) =>{
        //Si la sesión no existe
      if(!session){
          navigate('/login'); //Si no está autenticado, no refresques la página, sólo muestrale el login
      }

    })
  
  }, [])
  


  return (
    <div className="App">
        <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />

        </Routes>
        
    </div>
  )
}

export default App
