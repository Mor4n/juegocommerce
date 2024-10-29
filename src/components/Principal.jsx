import "./Principal.css"
import Nav from './Nav'
import Juego from "./Juego"
import useCart from "../hooks/useCart";


function Principal() {

    const {
        juegos,
        cart,
        agregarCarro,
        eliminarDeCarro,
        decrementarCantidad,
        incrementarCantidad,
        limpiarCarrito,
        setCart,
        vacio,
        totalPagar
    
    } = useCart();


   

  

  return (
    
    <>

    <Nav
    cart={cart}
    eliminarDeCarro={eliminarDeCarro}
    incrementarCantidad={incrementarCantidad}  
    decrementarCantidad={decrementarCantidad}    
    limpiarCarrito={limpiarCarrito}
    vacio={vacio}
    totalPagar={totalPagar}
    />  

    

    <div className="container">
        <div className="row">
          
        {juegos.map((juego)=> ( 
            <Juego
              key={juego.id}
              juego={juego}   
              cart={cart}
              setCart={setCart}      
              agregarCarro={agregarCarro}     
              />
            ))
        }

        </div>
    </div>


    </>
  )
}

export default Principal
