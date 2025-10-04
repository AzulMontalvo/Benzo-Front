import React, { useState, useEffect } from 'react';

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Actualización (cada 10 segundos)
  const POLLING_INTERVAL = 10000;

  // Obtener los pedidos
  const fetchOrders = async () => {
    try {
      // const token = localStorage.getItem('token');
      // const response = await fetch('', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      
      // if (!response.ok) throw new Error('Error al obtener pedidos');
      // const data = await response.json();
      
      // DATOS DE EJEMPLO - Eliminar cuando conectes con el back
      const data = [
        {
          id: 1,
          fecha: '2025-10-03T10:30:00',
          total: 125.50,
          estado: 'PENDIENTE',
          productos: [
            { nombre: 'Pizza Margherita', cantidad: 2, precio: 45.00 },
            { nombre: 'Refresco 600ml', cantidad: 3, precio: 11.83 }
          ]
        },
        {
          id: 2,
          fecha: '2025-10-02T14:20:00',
          total: 89.00,
          estado: 'EN_PREPARACION',
          productos: [
            { nombre: 'Hamburguesa Doble', cantidad: 1, precio: 89.00 }
          ]
        },
        {
          id: 3,
          fecha: '2025-10-01T12:00:00',
          total: 210.00,
          estado: 'COMPLETADO',
          productos: [
            { nombre: 'Combo Familiar', cantidad: 1, precio: 210.00 }
          ]
        }
      ];

      setOrders(data);
      setError(null);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos inicialmente y configurar polling
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Configuración de estilos y íconos según el estado
  const getStatusConfig = (estado) => {
    const configs = {
      'PENDIENTE': {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: <Clock className="w-5 h-5" />,
        label: 'Pendiente',
        description: 'Tu pedido está en espera de confirmación'
      },
      'EN_PREPARACION': {
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: <Package className="w-5 h-5" />,
        label: 'En Preparación',
        description: 'Estamos preparando tu pedido'
      },
      'LISTO': {
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: <CheckCircle className="w-5 h-5" />,
        label: 'Listo',
        description: 'Tu pedido está listo para recoger'
      },
      'EN_CAMINO': {
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: <Truck className="w-5 h-5" />,
        label: 'En Camino',
        description: 'Tu pedido está en camino'
      },
      'COMPLETADO': {
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: <CheckCircle className="w-5 h-5" />,
        label: 'Completado',
        description: 'Pedido entregado exitosamente'
      },
      'CANCELADO': {
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: <XCircle className="w-5 h-5" />,
        label: 'Cancelado',
        description: 'Este pedido ha sido cancelado'
      }
    };
    return configs[estado] || configs['PENDIENTE'];
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Seguimiento en tiempo real de tus pedidos
            </p>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Actualizar</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Última actualización: {lastUpdate.toLocaleTimeString('es-MX')}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No tienes pedidos
            </h2>
            <p className="text-gray-500">
              Tus pedidos aparecerán aquí una vez que realices tu primera compra
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.estado);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Pedido #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.fecha)}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.color}`}>
                        {statusConfig.icon}
                        <span className="font-medium">{statusConfig.label}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{statusConfig.description}</p>
                  </div>

                  {/* Order Details */}
                  <div className="p-6">
                    <h4 className="font-medium text-gray-900 mb-3">Productos</h4>
                    <div className="space-y-2 mb-4">
                      {order.productos && order.productos.map((producto, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {producto.cantidad}x {producto.nombre}
                          </span>
                          <span className="text-gray-900 font-medium">
                            {formatPrice(producto.precio)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-blue-600">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Auto-update indicator */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Esta página se actualiza automáticamente cada 10 segundos
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;