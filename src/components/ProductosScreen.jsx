import React, { useState, useEffect } from 'react';
import '../ProductoScreen.css';

// Datos de ejemplo - estos vendrán del backend
const productosEjemplo = {
  "Burritos": [
    { id: 1, nombre: "Burrito de Frijoles", precio: 25.00, descripcion: "Burrito de frijoles con queso" },
    { id: 2, nombre: "Burrito de Pollo en crema", precio: 25.00, descripcion: "Burrito de pollo desmenusado en crema" },
    { id: 3, nombre: "Burrito de winie con chipotle", precio: 25.00, descripcion: "winie baniado en salsa chipotle" }
  ],
  "Refrescos y Bebidas": [
    { id: 4, nombre: "Coca Cola", precio: 20.00, descripcion: "Refresco de cola 355ml" },
    { id: 5, nombre: "Agua Natural", precio: 10.00, descripcion: "Agua purificada 500ml" },
    { id: 6, nombre: "Jugo Jumex Mango", precio: 18.00, descripcion: "Jugo jumex 300ml" },
    { id: 7, nombre: "Arizona", precio: 20.00, descripcion: "juego arizona de sabor" }
  ]
};

const ProductosScreen = () => {
  const [productos, setProductos] = useState(productosEjemplo);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para cargar productos del backend
  const cargarProductos = async () => {
    setLoading(true);
    try {
      // Aquí harás la llamada a tu API del backend
      // const response = await fetch('/api/productos');
      // const data = await response.json();
      // setProductos(data);
      
      // Por ahora usamos datos de ejemplo
      setTimeout(() => {
        setProductos(productosEjemplo);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setLoading(false);
    }
  };

  // Función para agregar al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
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

  useEffect(() => {
    cargarProductos();
  }, []);

  // Componente para cada producto individual
  const ProductoCard = ({ producto }) => (
    <div className="producto-card">
      <div className="producto-imagen">
        {/* Aquí irá la imagen del producto desde la base de datos */}
        <span className="placeholder-text">Imagen del producto</span>
      </div>
      
      <h3 className="producto-nombre">{producto.nombre}</h3>
      <p className="producto-descripcion">{producto.descripcion}</p>
      
      <div className="producto-footer">
        <span className="producto-precio">${producto.precio.toFixed(2)}</span>
        <button
          onClick={() => agregarAlCarrito(producto)}
          className="btn-agregar"
        >
          + Agregar al carrito
        </button>
      </div>
    </div>
  );

  // Componente para cada categoría
  const CategoriaSeccion = ({ categoria, productos }) => (
    <div className="categoria-seccion">
      <h2 className="categoria-titulo">{categoria}</h2>
      <div className="productos-grid">
        {productos.map(producto => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="productos-screen">
      {/* Contenedor principal */}
      <div className="main-container">
        {/* Header de la sección */}
        <div className="header-seccion">
          <h1 className="titulo-principal">MENU</h1>
        </div>

    
        {/* Secciones de productos por categoría */}
        {Object.entries(productos).map(([categoria, productosCategoria]) => (
          <CategoriaSeccion 
            key={categoria} 
            categoria={categoria} 
            productos={productosCategoria} 
          />
        ))}

      </div>
    </div>
  );
};

export default ProductosScreen;