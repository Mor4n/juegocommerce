import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const stripe = Stripe(process.env.VITE_STRIPE_SECRET_KEY);


app.use(express.json());
app.use(cors());

app.post('/create-checkout-session', async (req, res) => {
    console.log('Cuerpo de la solicitud:', req.body);
    const { cart } = req.body; // Recibimos el carrito desde el frontend

    // Verificar si cart está definido y es un array
    if (!Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ error: 'El carrito debe ser un array y no estar vacío.' });
    }

    try {
        // Convertimos los items del carrito a formato de Stripe
        const lineItems = cart.map(item => ({
            price_data: {
                currency: 'mxn',
                product_data: {
                    name: item.nombre,
                    images: [item.imagen_url],
                },
                unit_amount: Math.round(item.precio * 100), // Precio en centavos
            },
            quantity: item.cantidad,
        }));

        // Creamos la sesión de checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success`,  // URL para éxito
            cancel_url: `${process.env.CLIENT_URL}/`,    // URL para cancelación
        });

        res.json({ url: session.url }); // Devolvemos la URL de pago de Stripe
    } catch (error) {
        console.error('Error creando sesión de pago:', error);
        res.status(500).json({ error: 'Error creando sesión de pago' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
