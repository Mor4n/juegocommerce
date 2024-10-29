import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import useCart from '../hooks/useCart';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
  const { cart, totalPagar } = useCart();

  const handleCheckout = async () => {
    

    const response = await fetch('http://localhost:5000/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart: cart.map(producto => ({
            nombre: producto.nombre,
            imagen_url: producto.imagen_url,
            precio: producto.precio && producto.descuento 
            ? (producto.precio * (1 - producto.descuento / 100))// Precio con descuento en centavos
            : producto.precio, // Sin descuento, asegurándote que ya está en centavos
            cantidad: producto.cantidad
        })),
      })
    });
    if (!response.ok) {
        console.error('Error en la solicitud:', response.statusText);
        return;
    }

    const { url } = await response.json();
    window.location.href = url; // Redirigir al usuario a la URL de Stripe
  };

  return (
    <button onClick={handleCheckout} className="btn btn-primary">
      Pagar con Stripe (${totalPagar.toFixed(2)})
    </button>
  );
};

export default Checkout;
