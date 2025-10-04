//ProductosScreen.jsx
import React, { useState, useEffect } from "react";
import "../ProductoScreen.css";
import Header from "./Header/header";
import { useCart } from "../context/CartContext";

// --- Componentes Auxiliares (definidos fuera para claridad) ---

/**
 * Componente para mostrar una tarjeta de producto individual.
 */
const ProductoCard = ({ producto, onAddToCart }) => (
  <div className="producto-card">
    <div className="producto-imagen">
      {producto.imageUrl ? (
        <img
          src={producto.imageUrl}
          alt={producto.nombreProducto}
          className="producto-img"
        />
      ) : (
        <span className="placeholder-text">Sin imagen</span>
      )}
    </div>

    <h3 className="producto-nombre">{producto.nombreProducto}</h3>
    <p className="producto-descripcion">
      {producto.descripcion || "Sin descripción"}
    </p>

    <div className="producto-footer">
      <span className="producto-precio">
        ${producto.precioProducto.toFixed(2)}
      </span>
      <button onClick={() => onAddToCart(producto)} className="btn-agregar">
        🛒 Agregar al carrito
      </button>
    </div>
  </div>
);

/**
 * Componente para mostrar una sección completa de una categoría.
 */
const CategoriaSeccion = ({ categoria, productos, onAddToCart }) => (
  <section className="categoria-seccion">
    <h2 className="categoria-titulo">{categoria}</h2>
    <div className="productos-grid">
      {productos.map((producto) => (
        <ProductoCard
          key={producto.idProducto}
          producto={producto}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  </section>
);

// --- Componente Principal ---

const ProductosScreen = () => {
  const [productosAgrupados, setProductosAgrupados] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para la búsqueda
  const { addToCart } = useCart();

  /**
   * Función para transformar un array plano de productos
   * en un objeto agrupado por 'nombreCategoria'.
   */
  const agruparProductosPorCategoria = (productos) => {
    return productos.reduce((acc, producto) => {
      const categoria = producto.nombreCategoria;
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(producto);
      return acc;
    }, {});
  };

  /**
   * Función para filtrar productos según el término de búsqueda
   */
  const filtrarProductos = (productosAgrupados, termino) => {
    if (!termino.trim()) {
      return productosAgrupados; // Sin filtro, devolver todo
    }

    const terminoLower = termino.toLowerCase();
    const productosFiltrados = {};

    Object.entries(productosAgrupados).forEach(([categoria, productos]) => {
      const productosDeLaCategoria = productos.filter((producto) =>
        producto.nombreProducto.toLowerCase().includes(terminoLower) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(terminoLower))
      );

      // Solo agregar la categoría si tiene productos que coincidan
      if (productosDeLaCategoria.length > 0) {
        productosFiltrados[categoria] = productosDeLaCategoria;
      }
    });

    return productosFiltrados;
  };

  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/Productos");

        if (!response.ok) {
          throw new Error(
            `Error en la respuesta del servidor: ${response.status} ${response.statusText}`
          );
        }

        const productosDesdeApi = await response.json();

        if (!Array.isArray(productosDesdeApi)) {
          throw new TypeError("La respuesta de la API no es un array.");
        }

        const productosListos = agruparProductosPorCategoria(productosDesdeApi);
        setProductosAgrupados(productosListos);
      } catch (err) {
        console.error("Error detallado al cargar productos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  // Aplicar el filtro de búsqueda
  const productosFiltrados = filtrarProductos(productosAgrupados, searchTerm);

  // --- Renderizado Condicional ---

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Cargando menú...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="productos-screen">
        <div className="main-container">
          <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="error-container">
            <h3>❌ Error al cargar productos</h3>
            <p>
              No se pudo obtener la información del servidor. Por favor, intenta
              de nuevo más tarde.
            </p>
            <pre className="error-details">{error}</pre>
            <button
              onClick={() => window.location.reload()}
              className="btn-reintentar"
            >
              🔄 Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Renderizado Principal ---

  return (
    <div className="productos-screen">
      <div className="main-container">
        <div className="header-seccion">
          <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <h1 className="titulo-principal">MENÚ</h1>
        </div>

        {Object.keys(productosFiltrados).length === 0 ? (
          <div className="sin-productos">
            <h3>🔍 {searchTerm ? "No se encontraron resultados" : "No hay productos disponibles"}</h3>
            <p>
              {searchTerm 
                ? `No se encontraron productos que coincidan con "${searchTerm}".`
                : "Parece que no hay nada en el menú por ahora."}
            </p>
          </div>
        ) : (
          Object.entries(productosFiltrados).map(([categoria, productos]) => (
            <CategoriaSeccion
              key={categoria}
              categoria={categoria}
              productos={productos}
              onAddToCart={addToCart}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductosScreen;