//!Agregar juego a la BDD, solo por si se necesita
import  { useState } from 'react'
import supabase from '../supabase/client';


function JuegoFormulario() {
    
    const[nombreJuego, setNombreJuego] = useState("");
    const[precioJuego, setPrecioJuego] = useState(0);

    const handleSubmit = async e =>{
        e.preventDefault();
       
        try {

            const user = await supabase.auth.getUser();
            
            const resultado = await supabase.from('productos').insert(
                {
                    nombre:nombreJuego,
                    precio:precioJuego,
                    userID:user.data.user.id,
                }
            );
            console.log(resultado);

 
            
        } catch (error) {
            console.log(error);
            
        }


    }

  return (
    <div>
      
        <form action="" onSubmit={handleSubmit}>
                <input type="text" name="nombreJuego" id="" placeholder='Ingrese el nombre del juego' onChange={(e)=>setNombreJuego(e.target.value)} />
                <input type="number" step="0.01" name="precioJuego" id="" placeholder='Ingrese el precio del juego' onChange={(e)=>setPrecioJuego(e.target.value)} />
                <button type="submit">Agregar juego a la venta</button>


        </form>


    </div>
  )
}

export default JuegoFormulario
