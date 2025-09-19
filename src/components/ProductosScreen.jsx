import React, { useState, useEffect } from 'react';
import '../ProductoScreen.css';

// Datos de ejemplo - estos vendrán del backend
const productosEjemplo = {
  "Burritos": [
    { id: 1, nombre: "Burrito de Frijoles", precio: 35.00, descripcion: "Burrito con frijoles refritos y queso" },
    { id: 2, nombre: "Burrito de Pollo", precio: 45.00, descripcion: "Burrito con pollo desmenuzado y verduras" },
    { id: 3, nombre: "Burrito Mixto", precio: 50.00, descripcion: "Burrito con carne, pollo y frijoles" }
  ],
  "Refrescos y Bebidas": [
    { id: 4, nombre: "Coca Cola", precio: 15.00, descripcion: "Refresco de cola 355ml" },
    { id: 5, nombre: "Agua Natural", precio: 10.00, descripcion: "Agua purificada 500ml" },
    { id: 6, nombre: "Jugo de Naranja", precio: 20.00, descripcion: "Jugo natural de naranja 300ml" },
    { id: 7, nombre: "Horchata", precio: 18.00, descripcion: "Horchata tradicional 400ml" }
  ],
  "Quesadillas": [
    { id: 8, nombre: "Quesadilla Simple", precio: 25.00, descripcion: "Quesadilla con queso Oaxaca" },
    { id: 9, nombre: "Quesadilla con Jamón", precio: 35.00, descripcion: "Quesadilla con jamón y queso" },
    { id: 10, nombre: "Quesadilla Especial", precio: 40.00, descripcion: "Quesadilla con pollo y verduras" }
  ],
  "Postres": [
    { id: 11, nombre: "Flan", precio: 25.00, descripcion: "Flan casero con caramelo" },
    { id: 12, nombre: "Gelatina", precio: 15.00, descripcion: "Gelatina de diferentes sabores" },
    { id: 13, nombre: "Pay de Queso", precio: 30.00, descripcion: "Rebanada de pay de queso con fresas" }
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