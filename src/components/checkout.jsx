import React, { useEffect } from 'react';
import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import axios from '../api/axios.js';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();
    
    // Obtener la hora actual local
    const getDefaultPickupTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 15);
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    
    // Obtener fecha y hora mínima (actual + 15 minutos)
    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 15);
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    
    // Obtener fecha de hoy en formato YYYY-MM-DD
    const getTodayDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const [pickupTime, setPickupTime] = useState(getDefaultPickupTime());
    const CHECKOUT_URL = '/orders/register'
    const [token, setToken] = useState(null);


    useEffect (() => {
        const storedToken = localStorage.getItem("accessToken");
        if (storedToken) {
            setToken(storedToken);
        } else {
            navigate('/login');
            console.warn("No se encontró un token de acceso. El usuario no está autenticado")
        }
    }, []);

    useEffect(() => {
        setPickupTime(getDefaultPickupTime());
    }, []);

    // Calcular el total del precio
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
            alert("No estás autenticado. Por favor, inicia sesión para realizar un pedido.");
            console.log('No hay token')
            navigate('/login');
            return;
        }

        // Validar horario antes de enviar
        const selectedTime = new Date(pickupTime);
        const now = new Date();
        const hours = selectedTime.getHours();
        
        // Verificar si la hora seleccionada es en el pasado
        if (selectedTime < now) {
            alert('⏰ No puedes seleccionar una hora en el pasado. Por favor, selecciona una hora futura (mínimo 15 minutos desde ahora).');
            return;
        }
        
        // Verificar si está dentro del horario establecido
        if (hours < 8 || hours >= 19) {
            alert('⏰ Lo sentimos, solo aceptamos pedidos entre las 8:00 AM y las 7:00 PM. Por favor, selecciona una hora dentro de este rango.');
            return;
        }

        const productosParaBackend = cart.map(item => ({
            idProducto: item.idProducto,
            cantidad: item.cantidad
        }));

        // Convertir la hora local a formato ISO manteniendo la zona horaria
        const fechaLocal = new Date(pickupTime);
        const offset = fechaLocal.getTimezoneOffset() * 60000; // offset en milisegundos
        const fechaAjustada = new Date(fechaLocal.getTime() - offset);
        const horaRecogidaISO = fechaAjustada.toISOString();

        console.log('Hora seleccionada (local):', pickupTime);
        console.log('Hora que se enviará al backend:', horaRecogidaISO);
        console.log('Hora extraída:', horaRecogidaISO.split('T')[1].substring(0, 5));

        const orderData = {
            productos: productosParaBackend,
            horaRecogida: horaRecogidaISO,
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
            clearCart();
            navigate('/status');
        } catch (error) {
            console.error('Error al enviar el pedido:', error);
            //alert('Hubo un error al procesar tu pedido. Inténtalo de nuevo.');
            // Verificar respuesta del servidor
            if (error.response) {
                const status = error.response.status;
                const errorData = error.response.data;

                // DEBUG: Ver qué mensaje exacto envía el backend
                console.log('Status del error:', status);
                console.log('Datos del error:', errorData);
                //console.log('Mensaje del error:', errorData.message);
                
                // Error 400 - Validación fallida (horario u otros)
                if (status === 400) {
                    // Verificar si es un error de horario específicamente
                    const mensajeError = errorData.error || errorData.message || '';
                    console.log('Mensaje extraído:', mensajeError);
                    
                    if (errorData.message && errorData.message.toLowerCase().includes('horario')) {
                        alert('⏰ Lo sentimos, solo aceptamos pedidos entre las 8:00 AM y las 7:00 PM. Por favor, selecciona una hora dentro de este rango.');
                    } else {
                        alert('Hay un problema con los datos del pedido: ' + (errorData.message || 'Por favor verifica la información e intenta nuevamente.'));
                    }
                }
                // Error 401 - No autorizado
                else if (status === 401) {
                    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                    navigate('/login');
                }
                // Error 500 - Error del servidor
                else if (status === 500) {
                    alert('Hubo un problema en nuestro servidor. Por favor, intenta nuevamente en unos momentos.');
                }
                // Otros errores
                else {
                    alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
                }
            } else if (error.request) {
                // No hubo respuesta del servidor
                alert('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.');
            } else {
                // Error al configurar la petición
                alert('Hubo un error al procesar tu pedido. Inténtalo de nuevo.');
            }
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
                        <label htmlFor="pickupTime">Hora de Recogida (Hoy):</label>
                        <input
                            type="datetime-local"
                            id="pickupTime"
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            className=""
                            min={getMinDateTime()}
                            max={`${getTodayDate()}T19:00`}
                        />
                    </div>

                    <button className="confirm-btn" onClick={handlePlaceOrder}>
                        Confirmar Pedido
                    </button>
                </>
            )}
        </div>
    );
};

export default Checkout;