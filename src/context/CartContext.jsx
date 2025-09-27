import axios from "../api/axios";
//import { useCart } from "../context/CartContext";
import { createContext, useContext, useState } from "react";

//Crear el contexto
const CartContext = createContext();

//Crear el proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  //Agregar producto
    const addToCart = (producto) => {
    setCart(prev => {
      const existente = prev.find(item => item.id === producto.id);
      if (existente) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  //Remover producto
  const removeFromCart = (productoId) => {
    setCart((prev) => prev.filter((item) => item.id !== productoId));
  };

  //Incrementar cantidad
  const addOne = (productoId) => {
    setCart(prev => prev.map(item =>
      item.id === productoId ? { ...item, cantidad: item.cantidad + 1 } : item
    ));
  };

  //Disminuir cantidad
   const substractOne = (productoId) => {
    setCart(prev =>
      prev.map(item =>
        item.id === productoId
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      ).filter(item => item.cantidad > 0) // Qutar producto si la cantidad llega a 0
    );
  };

    //Vaciar carrito
  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.cantidad, 0);
  };

  const getTotalPrecio = () => {
    return carrito.reduce((total, item) => total + (item.cantidad * item.precio), 0);
  };

return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      addOne,
      clearCart,
      substractOne,
      getTotalItems,
      getTotalPrecio
    }}>
      {children}
    </CartContext.Provider>
  );
};

//export default CartContext;

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe ser usado dentro de un CartProvider");
    }
    return context;
};
