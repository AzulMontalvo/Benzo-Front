import axios from "../api/axios";
//import { useCart } from "../context/CartContext";
import { createContext, useContext, useState } from "react";

//Crear el contexto
const CartContext = createContext();

const MAX_PRODUCTOS = 10;

//Crear el proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

    // Función auxiliar para calcular el total de items
  const calcularTotalItems = (carritoActual) => {
    return carritoActual.reduce((total, item) => total + item.cantidad, 0);
  };

  //Agregar producto
    const addToCart = (producto) => {
    setCart(prev => {
      const totalActual = calcularTotalItems(prev);
      const existente = prev.find(item => item.idProducto === producto.idProducto);
      if (existente) {
        if (totalActual >= MAX_PRODUCTOS) {
          alert(`⚠️ Has alcanzado el límite de ${MAX_PRODUCTOS} productos en el carrito`);
          return prev; // No hacer cambios
        }
        return prev.map(item =>
          item.idProducto === producto.idProducto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        if (totalActual >= MAX_PRODUCTOS) {
          alert(`⚠️ Has alcanzado el límite de ${MAX_PRODUCTOS} productos en el carrito`);
          return prev; // No hacer cambios
        }
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  //Remover producto
  const removeFromCart = (idProducto) => {
    setCart((prev) => prev.filter((item) => item.idProducto !== idProducto));
  };

  //Incrementar cantidad
  const addOne = (idProducto) => {
    setCart(prev => prev.map(item =>
      item.idProducto === idProducto ? { ...item, cantidad: item.cantidad + 1 } : item
    ));
  };

  //Disminuir cantidad
   const substractOne = (idProducto) => {
    setCart(prev =>
      prev.map(item =>
        item.idProducto === idProducto
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
    return cart.reduce((total, item) => total + (item.cantidad * item.precioProducto), 0);
  };

    // Verificar si se puede agregar más productos
  const canAddMore = () => {
    return calcularTotalItems(cart) < MAX_PRODUCTOS;
  };

  // Obtener productos restantes que se pueden agregar
  const getRemainingSlots = () => {
    return MAX_PRODUCTOS - calcularTotalItems(cart);
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
      getTotalPrecio,
      canAddMore,
      getRemainingSlots,
      MAX_PRODUCTOS
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
