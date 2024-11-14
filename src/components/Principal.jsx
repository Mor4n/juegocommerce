import "./Principal.css";
import Nav from './Nav';
import Juego from "./Juego";
import useCart from "../hooks/useCart";
import { useState } from "react";


function Principal() {
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const { juegos, cart, agregarCarro, eliminarDeCarro, decrementarCantidad, incrementarCantidad, limpiarCarrito, setCart, vacio, totalPagar } = useCart();

  // Filtrar juegos que coincidan con el término de búsqueda
  const juegosFiltrados = juegos.filter(juego => juego.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

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
        searchTerm={searchTerm}  // Pasamos el término de búsqueda al Nav
        setSearchTerm={setSearchTerm}  // Pasamos la función para actualizar el término de búsqueda
      />

      <div className="container">
        <div className="row">
          {juegosFiltrados.length > 0 ? (
            juegosFiltrados.map((juego) => (
              <Juego
                key={juego.id}
                juego={juego}
                cart={cart}
                setCart={setCart}
                agregarCarro={agregarCarro}
              />
            ))
          ) : (
            <div className="col-12 text-center">
              <h2>No se encontraron juegos para tu búsqueda.</h2>
              <br />
              <img 
                src="src\assets\tite.gif" 
                alt="Gif de búsqueda" 
                className="img-fluid" 
                style={{ maxWidth: "300px" }} 
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Principal;
