import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/cafeteria.css";

const VistaCafeteria = () => {
  const [estadoActivo, setEstadoActivo] = useState("ENT"); // Cambiado de "REALIZADO" a "ENT"
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  // URL base del backend
  const API_BASE_URL = "http://localhost:5265/api/orders";

  // Configurar axios para incluir el token en todas las peticiones
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    
    console.log("🔑 Token guardado:", token ? "Sí existe" : "❌ NO EXISTE");
    
    if (!token) {
      console.warn("⚠️ No hay token disponible");
      return {};
    }
    
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Mapeo de estados para mostrar nombres amigables
  const estadosConfig = {
    SOLI: { label: "Solicitado", className: "tab-solicitado" },
    PROC: { label: "En Proceso", className: "tab-proceso" },
    ENT: { label: "Entregado", className: "tab-entregado" },
    RECH: { label: "Rechazado", className: "tab-rechazado" }
  };

  // Cargar pedidos desde el backend según el estado
  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("🔍 Consultando pedidos con estado:", estadoActivo);
        
        // Enviar con el nombre correcto que espera el backend: "estado"
        const url = `${API_BASE_URL}/estadosfiltrados?estado=${estadoActivo}`;
        
        console.log(" URL completa:", url);
        console.log(" Headers:", getAuthHeaders());
        
        const response = await axios.get(url, getAuthHeaders());
        
        console.log("Pedidos recibidos:", response.data);
        console.log("Cantidad de pedidos:", response.data.length);
        setPedidos(response.data);
      } catch (err) {
        console.error(" Error al cargar pedidos:", err);
        console.error(" URL intentada:", `${API_BASE_URL}/estadosfiltrados?claveEstado=${estadoActivo}`);
        console.error(" Respuesta del servidor:", err.response?.data);
        console.error(" Código de estado:", err.response?.status);
        console.error(" Detalles del error:", err.response?.data?.errors);
        
        // Manejo específico de errores
        if (err.code === 'ERR_NETWORK') {
          setError(" No se puede conectar al servidor. Verifica que el backend esté corriendo en el puerto 5265");
        } else if (err.response?.status === 401) {
          setError(" Sesión expirada o no autorizado. Por favor inicia sesión nuevamente.");
          // Opcional: Redirigir al login
          // localStorage.removeItem("token");
          // window.location.href = "/login";
        } else if (err.response?.status === 400) {
          setError(` Petición incorrecta: ${err.response?.data?.message || 'Verifica los parámetros'}`);
        } else if (err.response?.status === 404) {
          setError(" Endpoint no encontrado. Verifica la URL del backend.");
        } else {
          setError(`Error al cargar los pedidos: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, [estadoActivo]);

  // Cambiar estado de un pedido
  const cambiarEstado = async (idPedido, nuevoEstado) => {
    try {
      console.log(`🔄 Cambiando pedido ${idPedido} a estado ${nuevoEstado}`);
      
      const response = await axios.put(
        `${API_BASE_URL}/cambiar-estado`,
        {
          idPedido: idPedido,
          claveNuevoEstado: nuevoEstado
        },
        getAuthHeaders()
      );

      console.log(" Estado actualizado correctamente:", response.data);

      // Recargar pedidos después de actualizar
      const pedidosResponse = await axios.get(
        `${API_BASE_URL}/estadosfiltrados`,
        {
          params: { claveEstado: estadoActivo },
          ...getAuthHeaders()
        }
      );
      
      setPedidos(pedidosResponse.data);
      setPedidoSeleccionado(null);
      
    } catch (err) {
      console.error(" Error al cambiar estado:", err);
      
      if (err.response?.status === 401) {
        alert(" Sesión expirada. Por favor inicia sesión nuevamente.");
        // Opcional: Redirigir al login
        // localStorage.removeItem("token");
        // window.location.href = "/login";
      } else if (err.response?.status === 404) {
        alert(" No se encontró el pedido o el endpoint.");
      } else if (err.response?.status === 400) {
        alert(` Error: ${err.response?.data?.message || 'Datos inválidos'}`);
      } else {
        alert(` Error al cambiar el estado del pedido: ${err.message}`);
      }
    }
  };

  // Formatear fecha para mostrar
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    try {
      return new Date(fecha).toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Fecha no disponible';
    }
  };

  return (
    <div className="vista-cafeteria">
      <h1 className="titulo">Gestión de Pedidos</h1>

      {/* Botones de pestañas */}
      <div className="tabs">
        {Object.entries(estadosConfig).map(([estado, config]) => (
          <button
            key={estado}
            className={`tab ${estadoActivo === estado ? `activo ${config.className}` : ""}`}
            onClick={() => setEstadoActivo(estado)}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Lista de pedidos */}
      <div className="contenedor-pedidos">
        {loading && <p className="mensaje">⏳ Cargando pedidos...</p>}
        {error && <p className="error">{error}</p>}
        
        {!loading && !error && pedidos.length === 0 && (
          <p className="mensaje">
            📦 No hay pedidos en {estadosConfig[estadoActivo].label}
          </p>
        )}
        
        {!loading && !error && pedidos.length > 0 && pedidos.map((pedido) => (
          <div key={pedido.idPedido} className="card-pedido">
            <div className="card-header">
              <h3 className="numero-orden">
                Orden {pedido.numeroOrden || `#${pedido.idPedido}`}
              </h3>
              <button 
                className="btn-detalles"
                onClick={() => setPedidoSeleccionado(
                  pedidoSeleccionado?.idPedido === pedido.idPedido ? null : pedido
                )}
              >
                {pedidoSeleccionado?.idPedido === pedido.idPedido ? "Cerrar" : "Detalles"}
              </button>
            </div>
            
            <div className="card-body">
              <p><strong>Nombre:</strong> {pedido.usuario || 'No especificado'}</p>
              <p>
                <strong>Hora Recogida:</strong> {formatearFecha(pedido.horaRecogida)}
              </p>
              <p>
                <strong>Total:</strong> $
                {typeof pedido.total === 'number' ? pedido.total.toFixed(2) : '0.00'}
              </p>
              
              {/* Detalles expandibles */}
              {pedidoSeleccionado?.idPedido === pedido.idPedido && (
                <div className="detalles-productos">
                  <strong>Detalles del Pedido</strong>
                  <ul className="productos-list">
                    {pedido.productos && pedido.productos.length > 0 ? (
                      pedido.productos.map((prod, idx) => (
                        <li key={idx}>
                          {prod.cantidad}x {prod.nombre}
                        </li>
                      ))
                    ) : (
                      <li>No hay productos</li>
                    )}
                  </ul>
                  
                  {/* Botones de acción según el estado */}
                  <div className="acciones">
                    {estadoActivo === "SOLI" && (
                      <>
                        <button 
                          className="btn-aceptar"
                          onClick={() => cambiarEstado(pedido.idPedido, "PROC")}
                        >
                          ✅ Aceptar
                        </button>
                        <button 
                          className="btn-rechazar"
                          onClick={() => cambiarEstado(pedido.idPedido, "RECH")}
                        >
                          ❌ Rechazar
                        </button>
                      </>
                    )}
                    {estadoActivo === "PROC" && (
                      <button 
                        className="btn-finalizar"
                        onClick={() => cambiarEstado(pedido.idPedido, "ENT")}
                        title="Marcar como entregado"
                      >
                        ✓ Finalizar
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VistaCafeteria;