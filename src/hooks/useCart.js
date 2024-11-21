import { useEffect, useState, useMemo } from "react";
import { useImportarContextoProd } from "../context/ProdContext";

const useCart = () => {
    const carritoInicial = () => {
        const localStorageCarrito = localStorage.getItem("cart")
        return localStorageCarrito ? JSON.parse(localStorageCarrito): []
    }
    const [cart, setCart] = useState(carritoInicial);

    const { juegos, getJuegos } = useImportarContextoProd();
    useEffect(() => {
        getJuegos();
    }, [getJuegos]);
    
    const ITEM_MAXIMOS = 5;
    const ITEM_MINIMOS = 1;

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
    }, [cart]);

    function eliminarDeCarro(id) {
        setCart(prevCart => prevCart.filter(juego => juego.id !== id));
    }

    function decrementarCantidad(id) {
        const carroActualizado = cart.map(producto => {
            if(producto.id === id && producto.cantidad > ITEM_MINIMOS){
                return {
                    ...producto,
                    cantidad: producto.cantidad - 1
                }
            }
            return producto
        })
        setCart(carroActualizado)
    }

    function incrementarCantidad(id) {
        const producto = cart.find(item => item.id === id);
        const juegoOriginal = juegos.find(juego => juego.id === id);
        
        // Verificar si incrementar excedería el stock original
        if (producto && juegoOriginal && producto.cantidad < ITEM_MAXIMOS) {
            const stockDisponible = juegoOriginal.stock - producto.cantidad;
            if (stockDisponible > 0) {
                const carroActualizado = cart.map(item => {
                    if(item.id === id) {
                        return {
                            ...item,
                            cantidad: item.cantidad + 1
                        }
                    }
                    return item
                });
                setCart(carroActualizado);
            }
        }
    }

    function agregarCarro(producto) {
        const productoExiste = cart.findIndex((juego) => juego.id === producto.id);
        
        if (productoExiste >= 0) {
            const stockDisponible = producto.stock - cart[productoExiste].cantidad;
            if (cart[productoExiste].cantidad >= ITEM_MAXIMOS || stockDisponible <= 0) return;
            
            const carritoActualizado = [...cart];
            carritoActualizado[productoExiste].cantidad++;
            
            setCart(carritoActualizado);
        } else {
            if (producto.stock <= 0) return;
            
            const nuevoProducto = {
                ...producto,
                cantidad: 1
            };
            setCart([...cart, nuevoProducto]);
        }
    }

    function limpiarCarrito() {
        setCart([]);
    }

    const vacio = useMemo(() => cart.length === 0, [cart]);
    const totalPagar = useMemo(() => 
        cart.reduce((total, productoActual) => {
            const precioFinal = productoActual.descuento 
                ? productoActual.precio * (1 - productoActual.descuento / 100)
                : productoActual.precio;
            
            return total + (productoActual.cantidad * precioFinal);
        }, 0),
        [cart]
    );

    return {
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
    }
}

export default useCart;