/* eslint-disable no-unused-vars */
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import useCart from '../hooks/useCart';

const Checkout = () => {
  const handleCheckout = async () => {
    // Obtener directamente el carrito desde localStorage
    const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart")) || [];

    const response = await fetch('http://localhost:5000/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart: cartFromLocalStorage.map(producto => ({
          nombre: producto.nombre,
          imagen_url: producto.imagen_url,
          precio: producto.precio && producto.descuento 
            ? (producto.precio * (1 - producto.descuento / 100)) // Precio con descuento en centavos
            : producto.precio, // Sin descuento
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
    <button onClick={handleCheckout} className="btn btn-primary w-100">
      Pagar con Stripe 
    </button>
  );
};

export default Checkout;
