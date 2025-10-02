import React, { useState, useEffect } from "react";
import axios from "axios";

const VistaCafeteria = () => {
  const [estadoActivo, setEstadoActivo] = useState("ORDENES");
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Configurar axios para incluir el token en todas las peticiones
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // O sessionStorage, dependiendo de dónde guardes el token
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // ✅ Cargar pedidos desde el backend según el estado
  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("🔍 Consultando pedidos con estado:", estadoActivo);
        const response = await axios.get(
          "http://localhost:7297/api/orders/estadosfiltrados",
          {
            params: { claveEstado: estadoActivo },
            ...getAuthHeaders() // ✅ Incluir token
          }
        );
        console.log("✅ Pedidos recibidos:", response.data);
        setPedidos(response.data);
      } catch (error) {
        console.error("❌ Error al cargar pedidos:", error);
        if (error.response?.status === 401) {
          setError("No autorizado. Por favor inicia sesión nuevamente.");
        } else {
          setError("Error al cargar los pedidos");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, [estadoActivo]);

  // ✅ Cambiar estado de un pedido
  const cambiarEstado = async (idPedido, nuevoEstado) => {
    try {
      console.log(`🔄 Cambiando pedido ${idPedido} a estado ${nuevoEstado}`);
      await axios.put(
        "http://localhost:7297/api/orders/cambiar-estado",
        {
          idPedido: idPedido,
          claveNuevoEstado: nuevoEstado
        },
        getAuthHeaders() // ✅ Incluir token
      );

      // Recargar pedidos después de actualizar
      const response = await axios.get(
        "http://localhost:7297/api/orders/estadosfiltrados",
        {
          params: { claveEstado: estadoActivo },
          ...getAuthHeaders() // ✅ Incluir token
        }
      );
      setPedidos(response.data);
      console.log("✅ Estado actualizado correctamente");
    } catch (error) {
      console.error("❌ Error al cambiar estado:", error);
      if (error.response?.status === 401) {
        alert("Sesión expirada. Por favor inicia sesión nuevamente.");
      } else {
        alert("Error al cambiar el estado del pedido");
      }
    }
  };

  return (
    <div className="vista-cafeteria">
      <h1 className="titulo">Gestión de Pedidos</h1>

      {/* Botones de pestañas */}
      <div className="tabs">
        {["ORDENES", "EN_PROCESO", "REALIZADO", "RECHAZADO"].map((estado) => (
          <button
            key={estado}
            className={`tab ${estadoActivo === estado ? "activo" : ""}`}
            onClick={() => setEstadoActivo(estado)}
          >
            {estado.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Lista de pedidos */}
      <div className="contenedor-pedidos">
        {loading && <p className="mensaje">⏳ Cargando pedidos...</p>}
        {error && <p className="error">{error}</p>}
        
        {!loading && !error && pedidos.length === 0 && (
          <p className="mensaje">No hay pedidos en {estadoActivo.replace("_", " ")}</p>
        )}
        
        {!loading && !error && pedidos.length > 0 && pedidos.map((pedido) => (
          <div key={pedido.idPedido} className="card-pedido">
            <div className="card-header">
              <h3>{pedido.numeroOrden}</h3>
              <span className="badge">{pedido.estado}</span>
            </div>
            
            <div className="card-body">
              <p><strong>Cliente:</strong> {pedido.usuario}</p>
              <p><strong>Hora de recogida:</strong> {new Date(pedido.horaRecogida).toLocaleString()}</p>
              <p><strong>Total:</strong> ${pedido.total.toFixed(2)}</p>
              
              <div className="productos-container">
                <strong>Productos:</strong>
                <ul className="productos-list">
                  {pedido.productos.map((prod, idx) => (
                    <li key={idx}>
                      {prod.nombre} x{prod.cantidad}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Botones según el estado */}
            <div className="acciones">
              {estadoActivo === "ORDENES" && (
                <>
                  <button 
                    className="btn-aceptar"
                    onClick={() => cambiarEstado(pedido.idPedido, "EN_PROCESO")}
                  >
                    ✓ Aceptar
                  </button>
                  <button 
                    className="btn-rechazar"
                    onClick={() => cambiarEstado(pedido.idPedido, "RECHAZADO")}
                  >
                    ✕ Rechazar
                  </button>
                </>
              )}
              {estadoActivo === "EN_PROCESO" && (
                <button 
                  className="btn-finalizar"
                  onClick={() => cambiarEstado(pedido.idPedido, "REALIZADO")}
                >
                  ✓ Finalizar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VistaCafeteria;