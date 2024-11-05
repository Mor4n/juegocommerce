/* eslint-disable no-unused-vars */

import { useEffect,useState, useMemo } from "react";

import { useImportarContextoProd } from "../context/ProdContext";

  const useCart = () =>{


    const carritoInicial = () => {
        const localStorageCarrito = localStorage.getItem("cart")
        return localStorageCarrito ? JSON.parse(localStorageCarrito): []//Si localstorage tiene algo setea el valor, de lo contrario será []
    }
    const [cart,setCart] = useState(carritoInicial);


    const { juegos, getJuegos } = useImportarContextoProd();
    useEffect(() => {
        getJuegos();
    }, [getJuegos]); // Agrega getJuegos en las dependencias para evitar advertencias
    
    // Obtener el carrito directamente del local storage
    const getCartData = () => JSON.parse(localStorage.getItem("cart")) || [];

    
    const ITEM_MAXIMOS = 5;
    const ITEM_MINIMOS = 1;

    useEffect(() => {
    localStorage.setItem("cart",JSON.stringify(cart))
    }, [cart]) //Cuando carrito haya sido modificado, ENTONCES, SOLO HASTA ENTONCES, actualiza el local storage
    //Esto se hace pq local storage es ASINCRONO, entonces al momento de ejecutar la pagina, se ejecuta esa funcion asincrona
    

    function agregarCarro(producto){

        const productoExiste = cart.findIndex((juego)=>juego.id===producto.id) //Si es el mismo id que alguno que exista

        
        if(productoExiste>=0){
            if(cart[productoExiste].cantidad>=ITEM_MAXIMOS) return
            const carritoActualizado = [...cart]
            carritoActualizado[productoExiste].cantidad++;
            setCart(carritoActualizado);//Cada que escribamos en state, lo seteamos. siempre.
            console.log("Actualizado!");
            
        }else{
            //Si no existe, le agergamos la cantidad de 1:
            producto.cantidad = 1; //Le creamos un nuevo atributo y lo iniciamos como 1
            console.log("Agregado!");
            setCart([...cart,producto])
        }

        
       
        
    }

    function eliminarDeCarro(id){

        setCart(prevCart => prevCart.filter(juego => juego.id !==id))
    }


    function decrementarCantidad(id) {
        const carroActualizado = cart.map(producto => {
            if(producto.id ===id && producto.cantidad>ITEM_MINIMOS){
                return{
                    
                ...producto,
                cantidad:producto.cantidad-1
                }
            }
            return producto
        })
        setCart(carroActualizado)
    }

    function incrementarCantidad(id) {
        const carroActualizado = cart.map(producto => {
            if(producto.id ===id && producto.cantidad<ITEM_MAXIMOS){
                return{
                    
                ...producto,
                cantidad:producto.cantidad+1
                }
            }
            return producto
        })
        setCart(carroActualizado)
    }


    function limpiarCarrito(e){
        setCart([])
    }
    //State derivado

  const vacio = useMemo(() =>cart.length ===0, [cart]);//Cada que modifiquemos el carro ejecuta esto. nunca antes o despues
  const totalPagar = useMemo(() => 
    cart.reduce((total, productoActual) => {
      // Si el producto tiene un descuento, calcula el precio descontado
      const precioFinal = productoActual.descuento 
        ? productoActual.precio * (1 - productoActual.descuento / 100)
        : productoActual.precio;
      
      // Añadir al total el precio con descuento (si aplica) multiplicado por la cantidad
      return total + (productoActual.cantidad * precioFinal);
    }, 0),
    [cart]
  );
  

    return{

        juegos,
        cart,
        agregarCarro,
        eliminarDeCarro,
        decrementarCantidad,
        incrementarCantidad,
        limpiarCarrito,
        setCart,
        vacio,
        totalPagar,
        getCartData
    }
}

export default useCart;
