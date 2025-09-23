import React, { useState, useEffect } from 'react';
import '../ProductoScreen.css';

// datos como ejemplo
const productosEjemplo = {
  "Burritos": [
    { 
      id: 1, 
      nombre: "Burrito de Frijoles", 
      precio: 25.00, 
      descripcion: "Burrito de frijoles con queso",
      imageUrl: null // Se llenará desde la API
    },
    { 
      id: 2, 
      nombre: "Burrito de Pollo en crema", 
      precio: 25.00, 
      descripcion: "Burrito de pollo desmenusado en crema",
      imageUrl: null // Se llenará desde la API
    },
    { 
      id: 3, 
      nombre: "Burrito de winie con chipotle", 
      precio: 25.00, 
      descripcion: "winie baniado en salsa chipotle",
      imageUrl: null // Se llenará desde la API
    }
  ],
  "Refrescos y Bebidas": [
    { 
      id: 4, 
      nombre: "Coca Cola", 
      precio: 20.00, 
      descripcion: "Refresco de cola 355ml",
      imageUrl: null // Se llenará desde la API
    },
    { 
      id: 5, 
      nombre: "Agua Natural", 
      precio: 10.00, 
      descripcion: "Agua purificada 500ml",
      imageUrl: null // Se llenará desde la API
    },
    { 
      id: 6, 
      nombre: "Jugo Jumex Mango", 
      precio: 18.00, 
      descripcion: "Jugo jumex 300ml",
      imageUrl: null // Se llenará desde la API
    },
    { 
      id: 7, 
      nombre: "Arizona", 
      precio: 20.00, 
      descripcion: "juego arizona de sabor",
      imageUrl: null // Se llenará desde la API
    }
  ]
};

const ProductosScreen = () => {
  const [productos, setProductos] = useState(productosEjemplo);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagenesLoading, setImagenesLoading] = useState({}); 

  // ===== CARGAR LA IMAGEN DESDE EL BACK =====
  const cargarImagenProducto = async (productoId) => {
    try {
      setImagenesLoading(prev => ({ ...prev, [productoId]: true }));
      
      /* 
      --------------DESCOMENTAR CUANDO ESTE LISTO PARA CONECTAR EL BACK---------------------
      
      const response = await fetch(`/api/productos/${productoId}/imagen`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Si usas autenticación
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Si el backend devuelve la imagen como blob
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        return imageUrl;
        
        // O si el backend devuelve solo la URL de la imagen
        // const data = await response.json();
        // return data.imageUrl;
      } else {
        throw new Error('Error al cargar imagen');
      }
      =================================================================
      */
      
      // SIMULACIÓN  : Tengo que borrar este estas lineas de la 100 a la 110 cuando tenga la api lista para cargar las imagenes.
      await new Promise(resolve => setTimeout(resolve, 800));
      return `https://via.placeholder.com/300x200/4a90e2/ffffff?text=Producto+${productoId}`;
      
    } catch (error) {
      console.error(`Error al cargar imagen del producto ${productoId}:`, error);
      return null;
    } finally {
      setImagenesLoading(prev => ({ ...prev, [productoId]: false }));
    }
  };

  // ===== FUNCIÓN PARA CARGAR TODAS LAS IMÁGENES =====
  const cargarTodasLasImagenes = async () => {
    const productosActualizados = { ...productos };
    
    for (const [categoria, productosCategoria] of Object.entries(productosActualizados)) {
      for (let i = 0; i < productosCategoria.length; i++) {
        const producto = productosCategoria[i];
        if (!producto.imageUrl) { // Solo cargar si no tiene imagen
          const imageUrl = await cargarImagenProducto(producto.id);
          productosActualizados[categoria][i] = {
            ...producto,
            imageUrl: imageUrl
          };
        }
      }
    }
    
    setProductos(productosActualizados);
  };

  // Función para inicializar productos y cargar imágenes del backend
  const cargarProductos = async () => {
    setLoading(true);
    try {
   
      
      // Establecemos los productos locales
      setProductos(productosEjemplo);
      
      // Cargamos las imágenes desde el backend
      await cargarTodasLasImagenes();
      
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
    } finally {
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
        {/* 
       
        AQUÍ SE VA A MOSTRAR LA IMAGEN CARGADA DESDE EL BACKEND
        
        */}
        {imagenesLoading[producto.id] ? (
          <div className="imagen-loading">
            <div className="spinner-small"></div>
            <span>Cargando imagen...</span>
          </div>
        ) : producto.imageUrl ? (
          <img 
            src={producto.imageUrl} 
            alt={producto.nombre}
            className="producto-img"
            onError={(e) => {
              // Si hay error al cargar la imagen, mostrar placeholder
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : null}
        
        {/* Por si no se ve la imagen */}
        <span 
          className="placeholder-text"
          style={{ 
            display: (!producto.imageUrl || imagenesLoading[producto.id]) ? 'block' : 'none' 
          }}
        >
          {imagenesLoading[producto.id] ? 'Cargando...' : 'Imagen del producto'}
        </span>
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

  // Componentes 
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
          <p>Cargando imágenes...</p>
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