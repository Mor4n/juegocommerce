import "./Principal.css";
import Nav from './Nav';
import Juego from "./Juego";
import useCart from "../hooks/useCart";
import { useState, useEffect } from "react";
import supabase from "../supabase/client"; // Importar Supabase

function Principal() {
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [filtroPrecio, setFiltroPrecio] = useState(""); // Estado para filtro por precio
  const [filtroCategoria, setFiltroCategoria] = useState(""); // Estado para filtro por categoría
  const [filtroPlataforma, setFiltroPlataforma] = useState(""); // Estado para filtro por plataforma
  const [categorias, setCategorias] = useState([]); // Estado para almacenar categorías
  const [orden, setOrden] = useState(""); // Nuevo estado para manejar el tipo de ordenamiento

  const { juegos, cart, agregarCarro, eliminarDeCarro, decrementarCantidad, incrementarCantidad, limpiarCarrito, setCart, vacio, totalPagar } = useCart();

  // Obtener categorías de Supabase
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const { data, error } = await supabase
          .from('categorias')
          .select('*');

        if (error) {
          console.error('Error al obtener categorías:', error);
        } else {
          setCategorias(data);
        }
      } catch (error) {
        console.error('Error en la consulta a Supabase:', error);
      }
    };

    fetchCategorias();
  }, []);

  // Filtrar juegos según los filtros activos
  const juegosFiltrados = juegos
    .filter(juego => juego.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(juego => {
      if (filtroPrecio === "menor50") return juego.precio < 50;
      if (filtroPrecio === "mayor50") return juego.precio >= 50;
      return true; // No hay filtro por precio
    })
    .filter(juego => (filtroCategoria ? juego.categoria === filtroCategoria : true))
    .filter(juego => (filtroPlataforma ? juego.plataforma === filtroPlataforma : true));

  // Aplicar ordenamiento
  const juegosOrdenados = [...juegosFiltrados].sort((a, b) => {
    if (orden === "alfabetico") {
      return a.nombre.localeCompare(b.nombre);
    } else if (orden === "precioAsc") {
      return a.precio - b.precio;
    } else if (orden === "precioDesc") {
      return b.precio - a.precio;
    }
    return 0; // Sin ordenamiento si no hay opción seleccionada
  });


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
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="container mt-4">
        <div className="row mb-4">
          <div className="col-md-3">
            {/* Filtro por precio */}
            <label htmlFor="filtroPrecio">Filtrar por precio</label>
            <select
              id="filtroPrecio"
              className="form-select"
              value={filtroPrecio}
              onChange={(e) => setFiltroPrecio(e.target.value)}
            >
              <option value="">Todos los precios</option>
              <option value="menor50">Menor a $50</option>
              <option value="mayor50">Mayor o igual a $50</option>
            </select>
          </div>

          <div className="col-md-3">
            {/* Filtro por categoría */}
            <label htmlFor="filtroCategoria">Filtrar por categoría</label>
            <select
              id="filtroCategoria"
              className="form-select"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.nombre}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            {/* Filtro por plataforma */}
            <label htmlFor="filtroPlataforma">Filtrar por plataforma</label>
            <select
              id="filtroPlataforma"
              className="form-select"
              value={filtroPlataforma}
              onChange={(e) => setFiltroPlataforma(e.target.value)}
            >
              <option value="">Todas las plataformas</option>
              <option value="PC">PC</option>
              <option value="PlayStation">PlayStation</option>
              <option value="Xbox">Xbox</option>
              
            </select>
          </div>

          <div className="col-md-3">
            <label htmlFor="orden">Ordenar por</label>
            <select
              id="orden"
              className="form-select"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="">Agregados recientemente</option>
              <option value="alfabetico">Alfabéticamente (A-Z)</option>
              <option value="precioAsc">Precio (menor a mayor)</option>
              <option value="precioDesc">Precio (mayor a menor)</option>
            </select>
          </div>
        </div>

        

        <div className="row">
          {juegosOrdenados.length > 0 ? (
            juegosOrdenados.map((juego) => (
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
                src="src/assets/tite.gif" 
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
