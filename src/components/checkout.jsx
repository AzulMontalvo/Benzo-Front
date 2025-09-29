import React, { useEffect } from 'react';
import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import axios from '../api/axios.js';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();
    //Hora por defecto si no selecciona ninguna
    const defaultPickup = new Date(Date.now() + 15 * 60000).toISOString().slice(0, 16);
    const [pickupTime, setPickupTime] = useState (defaultPickup);
    const CHECKOUT_URL = '/orders/register'
    const [token, setToken] = useState(null);

    useEffect (() => {
        const storedToken = localStorage.getItem("accessToken");
        if (storedToken) {
            setToken(storedToken);
        } else {
            //navigate('/login');
            console.warn("No se encontró un token de acceso. El usuario no está autenticado")
        }
    }, []);

    // Calcular el total del precio (si necesitas mostrarlo en el checkout)
    const getTotalPrecio = () => {
        return cart.reduce((total, item) => total + (item.cantidad * item.precioProducto), 0);
    };

    // Función para enviar el pedido al backend
    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            alert("El carrito está vacío. Agrega productos antes de ordenar.");
            return;
        }

        if (!token) {
            // alert("No estás autenticado. Por favor, inicia sesión para realizar un pedido.");
            console.log('No hay token')
            navigate('/login'); // Redirigir al login
            return;
        }

        const productosParaBackend = cart.map(item => ({
            idProducto: item.idProducto,
            cantidad: item.cantidad
        }));

        const orderData = {
            productos: productosParaBackend,
            horaRecogida: new Date(pickupTime).toISOString(),
        };

        try {
            const response = await axios.post(CHECKOUT_URL, orderData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
            console.log('Pedido enviado con éxito:', response.data);
            alert('¡Tu pedido ha sido realizado con éxito!');
            clearCart(); // Vaciar el carrito después de la compra
            navigate('/order-confirmed'); // Redirigir a la página de status del pedido
        } catch (error) {
            console.error('Error al enviar el pedido:', error);
            alert('Hubo un error al procesar tu pedido. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="checkout-container">
            {/* <button><i class="bi bi-arrow-left-circle"></i></button> */}
            <h2 className="checkout-title">Resumen del Pedido</h2>

            {cart.length === 0 ? (
                <p className="checkout-empty-message">No hay productos en tu carrito. Agrega algo para realizar un pedido.</p>
            ) : (
                <>
                    <div className="checkout-items-list">
                        {cart.map(item => (
                            <div key={item.id} className="checkout-item">
                                <span className="">{item.nombreProducto}</span>
                                <span className="">x {item.cantidad}</span>
                                <span className="">${(item.precioProducto * item.cantidad).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="checkout-total">
                        <span>Total del pedido:</span>
                        <span>${getTotalPrecio().toFixed(2)}</span>
                    </div>

                    <div className="checkout-info">
                        <label htmlFor="pickupTime">Hora de Recogida:</label>
                        <input
                            type="datetime-local"
                            id="pickupTime"
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            className=""
                        />
                    </div>

                    <button className="confirm-btn" onClick={handlePlaceOrder}>
                        Confirmar Pedido
                    </button>
                </>
            )}
            <button className="back-btn" onClick={() => navigate('/productos')}>
                Volver a la tienda
            </button>
        </div>
    );
};

export default Checkout;
