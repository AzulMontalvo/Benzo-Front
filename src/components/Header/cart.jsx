import React from 'react';
import '../../css/header.css';
import { useCart } from '../../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

  const { cart, addOne, substractOne, removeFromCart, clearCart, getTotalItems } = useCart();

  const navigate = useNavigate();

  const handleCheckoutClick = () => {
        navigate('/checkout');
    };

  const getTotalPrecio = () => {
        return cart.reduce((total, item) => total + (item.cantidad * item.precio), 0);
    };

  return (
    <div className="cart-dropdown">
      <h3 className="cart-dropdown-title">Tu Carrito</h3>
      {cart.length === 0 ? (
        <p className="cart-empty-message">No hay productos en el carrito.</p>
      ) : (
        <div className="cart-items-list">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <span className="cart-item-name">{item.nombre}</span>
              <div className="cart-item-controls">
                <button onClick={() => substractOne(item.id)} className="cart-item-btn-qty">-</button>
                <span className="cart-item-quantity">{item.cantidad}</span>
                <button onClick={() => addOne(item.id)} className="cart-item-btn-qty">+</button>
                <span className="cart-item-price">${(item.precio * item.cantidad).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.id)} className="cart-item-btn-remove">
                    <i class="bi bi-x-circle-fill"></i>
                </button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <span>Total:</span>
            <span>${getTotalPrecio().toFixed(2)}</span>
          </div>
        </div>
      )}
      <button className="checkout-button" onClick={handleCheckoutClick} disabled={cart.length === 0}>
        Ordenar
        </button>
    </div>
  );
};

export default Cart;
