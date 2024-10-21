import { useEffect,useState } from "react"
import supabase from '../supabase/client'
import { useNavigate } from "react-router-dom";


function Login() {

    const navigate = useNavigate();
    const[email,setEmail] = useState('');
    const handleSubmit = async (e) =>{
        e.preventDefault();//No reinicies la página, sucede cuando presionamos un button submit
        
 
        try {
            const result = await supabase.auth.signInWithOtp({
                email,
                options:{
                    
                    shouldCreateUser: false,
                }
            });
            console.log(result);
        } catch (error) {
            console.error("Error during sign-up:", error.message, error);
        }
        
        
    }

//Si ya estás logeado, ve a home
/* useEffect(() => {
        
      if(supabase.auth.getUser()){
        navigate('/');
      }
    
    }, [navigate])
    */


  return (
    <div>

        <form action="" onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="tucorreoelectronico@email.com" 
            onChange={(e)=>setEmail(e.target.value)} //Cada TECLA que escribamos en el campo s eguardará en el estado de email.
            />
            
            <button type="submit">Enviar datos</button>
        </form>

    </div>
  )
}

export default Login
