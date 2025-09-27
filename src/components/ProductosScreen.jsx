import React, { useState, useEffect } from 'react';
import '../ProductoScreen.css';
import Header from './Header/header';
import { useCart } from '../context/CartContext';

const ProductosScreen = () => {
  const [productos, setProductos] = useState({});
  const [categorias, setCategorias] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagenesLoading, setImagenesLoading] = useState({});
  const [error, setError] = useState(null);

  const { addToCart, cart } = useCart();

  // ===== FUNCIÓN PARA OBTENER EL TOKEN =====
  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  };

  // ===== FUNCIÓN PARA CARGAR CATEGORÍAS DESDE EL BACKEND =====
  const cargarCategorias = async () => {
    try {
      const token = getAuthToken();
      
      const response = await fetch('/api/categorias', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const categoriasData = await response.json();
        
        // Crear un mapa de ID -> Nombre de categoría
        const categoriasMap = {};
        categoriasData.forEach(cat => {
          categoriasMap[cat.IdCategoria] = cat.NombreCategoria;
        });
        
        setCategorias(categoriasMap);
        return categoriasMap;
      } else {
        // Si no hay endpoint de categorías, usar valores por defecto
        const categoriasDefault = {
          1: 'Burritos',
          2: 'Refrescos y Bebidas',
          3: 'Antojitos',
        };
        setCategorias(categoriasDefault);
        return categoriasDefault;
      }
      
    } catch (error) {
      console.warn('No se pudieron cargar categorías, usando valores por defecto:', error);
      const categoriasDefault = {
        1: 'Burritos',
        2: 'Refrescos y Bebidas', 
        3: 'Antojitos',
      };
      setCategorias(categoriasDefault);
      return categoriasDefault;
    }
  };

  // ===== FUNCIÓN PARA CARGAR PRODUCTOS DESDE EL BACKEND =====
  const cargarProductosDesdeBackend = async (categoriasMap) => {
    try {
      const token = getAuthToken();
      
      const response = await fetch('/api/productos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const productosData = await response.json();
      
      // Organizar productos por categoría usando el mapa de categorías
      const productosOrganizados = {};
      
      productosData.forEach(producto => {
        const categoria = categoriasMap[producto.IdCategoriaProducto] || 'Sin Categoría';
        
        if (!productosOrganizados[categoria]) {
          productosOrganizados[categoria] = [];
        }
        
        productosOrganizados[categoria].push({
          id: producto.IdProducto,
          nombre: producto.NombreProducto,
          precio: producto.PrecioProducto,
          descripcion: producto.DescripcionProducto || `${producto.NombreProducto} - Delicioso producto disponible`,
          categoria: categoria,
          idCategoria: producto.IdCategoriaProducto,
          imageUrl: null // Se llenará después con las imágenes
        });
      });

      return productosOrganizados;
      
    } catch (error) {
      console.error('Error al cargar productos:', error);
      throw error;
    }
  };

  // ===== FUNCIÓN PARA CARGAR IMAGEN DESDE EL BACKEND =====
  const cargarImagenProducto = async (productoId) => {
    try {
      setImagenesLoading(prev => ({ ...prev, [productoId]: true }));
      
      const token = getAuthToken();
      
      const response = await fetch(`/api/productos/${productoId}/imagen`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        return imageUrl;
      } else {
        console.warn(`No se pudo cargar imagen para producto ${productoId}`);
        return null;
      }
      
    } catch (error) {
      console.error(`Error al cargar imagen del producto ${productoId}:`, error);
      return null;
    } finally {
      setImagenesLoading(prev => ({ ...prev, [productoId]: false }));
    }
  };

  // ===== FUNCIÓN PARA CARGAR TODAS LAS IMÁGENES =====
  const cargarTodasLasImagenes = async (productosData) => {
    const productosConImagenes = { ...productosData };
    
    for (const [categoria, productosCategoria] of Object.entries(productosConImagenes)) {
      for (let i = 0; i < productosCategoria.length; i++) {
        const producto = productosCategoria[i];
        const imageUrl = await cargarImagenProducto(producto.id);
        productosConImagenes[categoria][i] = {
          ...producto,
          imageUrl: imageUrl
        };
      }
    }
    
    return productosConImagenes;
  };

  // ===== FUNCIÓN PRINCIPAL PARA CARGAR TODO =====
  const inicializarDatos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Cargar categorías primero
      console.log('Cargando categorías...');
      const categoriasMap = await cargarCategorias();
      
      // 2. Cargar productos usando las categorías
      console.log('Cargando productos desde el backend...');
      const productosData = await cargarProductosDesdeBackend(categoriasMap);
      
      // 3. Establecer productos sin imágenes primero
      setProductos(productosData);
      
      // 4. Cargar imágenes de manera asíncrona
      console.log('Cargando imágenes de productos...');
      const productosConImagenes = await cargarTodasLasImagenes(productosData);
      
      // 5. Actualizar con imágenes
      setProductos(productosConImagenes);
      
      console.log('Productos cargados exitosamente:', productosConImagenes);
      
    } catch (error) {
      console.error('Error al inicializar datos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== EFECTO PARA CARGAR DATOS AL MONTAR =====
  useEffect(() => {
    inicializarDatos();
  }, []);

  // ===== FUNCIÓN PARA REINTENTAR =====
  const reintentar = () => {
    inicializarDatos();
  };

  // ===== COMPONENTE PARA CADA PRODUCTO =====
  const ProductoCard = ({ producto }) => (
    <div className="producto-card">
      <div className="producto-imagen">
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
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : null}
        
        <span 
          className="placeholder-text"
          style={{ 
            display: (!producto.imageUrl || imagenesLoading[producto.id]) ? 'block' : 'none' 
          }}
        >
          {imagenesLoading[producto.id] ? 'Cargando...' : 'Sin imagen'}
        </span>
      </div>
      
      <h3 className="producto-nombre">{producto.nombre}</h3>
      <p className="producto-descripcion">{producto.descripcion}</p>
      
      <div className="producto-footer">
        <span className="producto-precio">${producto.precio.toFixed(2)}</span>
        <button
          onClick={() => addToCart(producto)}
          className="btn-agregar"
        >
          🛒 Agregar al carrito
        </button>
      </div>
    </div>
  );

  // ===== COMPONENTE PARA CADA CATEGORÍA =====
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

  // ===== PANTALLA DE ERROR =====
  if (error) {
    return (
      <div className="productos-screen">
        <div className="main-container">
          <Header />
          <div className="error-container">
            <div className="error-content">
              <h2>❌ Error al cargar productos</h2>
              <p>{error}</p>
              <div className="error-details">
                <small>
                  Verifica que:
                  <br />• El backend esté funcionando
                  <br />• Los endpoints /api/productos y /api/categorias estén disponibles
                  <br />• El token de autenticación sea válido
                </small>
              </div>
              <button onClick={reintentar} className="btn-reintentar">
                🔄 Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== PANTALLA DE CARGA =====
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Cargando productos desde el servidor...</p>
          <small>Esto puede tomar unos segundos...</small>
        </div>
      </div>
    );
  }

  // ===== PANTALLA PRINCIPAL =====
  return (
    <div className="productos-screen">
      <div className="main-container">
        <div className="header-seccion">
          <Header />
          <h1 className="titulo-principal">MENÚ</h1>
          <div className="productos-info">
            <p>
              📋 Categorías: {Object.keys(productos).length} | 
              🍽️ Productos: {Object.values(productos).reduce((total, cat) => total + cat.length, 0)}
            </p>
          </div>
        </div>

        {/* Verificar si hay productos */}
        {Object.keys(productos).length === 0 ? (
          <div className="sin-productos">
            <h3>🍽️ No hay productos disponibles</h3>
            <p>No se encontraron productos en el servidor</p>
            <button onClick={reintentar} className="btn-reintentar">
              🔄 Recargar productos
            </button>
          </div>
        ) : (
          /* Secciones de productos por categoría */
          Object.entries(productos).map(([categoria, productosCategoria]) => (
            <CategoriaSeccion 
              key={categoria} 
              categoria={categoria} 
              productos={productosCategoria} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductosScreen;