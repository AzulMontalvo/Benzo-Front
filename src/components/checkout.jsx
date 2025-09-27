import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import axios from '../api/axios.js';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();
    const [pickupTime, setPickupTime] = useState(new Date().toISOString().slice(0, 16));
    const CHECKOUT_URL = '/orders/register'

    // Calcular el total del precio (si necesitas mostrarlo en el checkout)
    const getTotalPrecio = () => {
        return cart.reduce((total, item) => total + (item.cantidad * item.precio), 0);
    };

    // Función para enviar el pedido al backend
    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            alert("El carrito está vacío. Agrega productos antes de ordenar.");
            return;
        }

        const productosParaBackend = cart.map(item => ({
            idProducto: item.id,
            cantidad: item.cantidad
        }));

        const orderData = {
            productos: productosParaBackend,
            horaRecogida: new Date().toISOString()
        };

        try {
            
            const response = await axios.post(CHECKOUT_URL, orderData);
            console.log('Pedido enviado con éxito:', response.data);
            alert('¡Tu pedido ha sido realizado con éxito!');
            clearCart(); // Vaciar el carrito después de la compra
            navigate('/'); // Redirigir a la página de status del pedido
        } catch (error) {
            console.error('Error al enviar el pedido:', error);
            alert('Hubo un error al procesar tu pedido. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Resumen de Tu Pedido</h2>

            {cart.length === 0 ? (
                <p className="checkout-empty-message">No hay productos en tu carrito. Agrega algo para realizar un pedido.</p>
            ) : (
                <>
                    <div className="checkout-items-list">
                        {cart.map(item => (
                            <div key={item.id} className="checkout-item">
                                <span className="">{item.nombre}</span>
                                <span className="">x {item.cantidad}</span>
                                <span className="">${(item.precio * item.cantidad).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="">
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

                    <button className="" onClick={handlePlaceOrder}>
                        Confirmar Pedido
                    </button>
                </>
            )}
            <button className="" onClick={() => navigate('/productos')}>
                Volver a la tienda
            </button>
        </div>
    );
};

export default Checkout;