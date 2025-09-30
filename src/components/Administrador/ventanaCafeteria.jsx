import React, { useState } from "react";
import "../../css/cafeteria.css";

const VentanaCafeteria = () => {
  const [activeTab, setActiveTab] = useState("ordenes");
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      nombre: "Juan Pérez",
      hora: "10:30 AM",
      total: 25.5,
      detalles: ["1x Ensalada César", "1x Té Helado"],
      estado: "ordenes",
      showDetails: false,
    },
    {
      id: "ORD002",
      nombre: "Carlos Ruiz",
      hora: "09:45 AM",
      total: 30.75,
      detalles: ["1x Sándwich", "1x Café", "1x Brownie"],
      estado: "ordenes",
      showDetails: false,
    },
  ]);

  const toggleDetalles = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, showDetails: !order.showDetails } : order
      )
    );
  };

  const moverOrden = (id, nuevoEstado) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? { ...order, estado: nuevoEstado, showDetails: false }
          : order
      )
    );
  };

  return (
    <div className="container">
      <h1>Gestión de Pedidos</h1>

      {/* Botones de prueba hasta que esté el navbar */}
      <div className="tabs">
        <button
          onClick={() => setActiveTab("ordenes")}
          className={activeTab === "ordenes" ? "active" : ""}
        >
          Órdenes
        </button>
        <button
          onClick={() => setActiveTab("enProceso")}
          className={activeTab === "enProceso" ? "active" : ""}
        >
          En Proceso
        </button>
        <button
          onClick={() => setActiveTab("realizado")}
          className={activeTab === "realizado" ? "active" : ""}
        >
          Realizado
        </button>
        <button
          onClick={() => setActiveTab("rechazado")}
          className={activeTab === "rechazado" ? "active" : ""}
        >
          Rechazado
        </button>
      </div>

      {/* Tarjetas */}
      <div className="cards-container">
        {orders
          .filter((order) => order.estado === activeTab)
          .map((order) => (
            <div key={order.id} className="card">
              <h2>Orden #{order.id}</h2>
              <p>
                <strong>Nombre:</strong> {order.nombre}
              </p>
              <p>
                <strong>Hora Recogida:</strong> {order.hora}
              </p>
              <p>
                <strong>Total:</strong> ${order.total}
              </p>

              {/* Botón detalles */}
              <button
                className="btn btn-detalles"
                onClick={() => toggleDetalles(order.id)}
              >
                {order.showDetails ? "Ocultar" : "Detalles"}
              </button>

              {/* Mostrar detalles solo si showDetails es true */}
              {order.showDetails && (
                <div className="detalles">
                  <h3>Detalles del Pedido:</h3>
                  <ul>
                    {order.detalles.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  {activeTab === "ordenes" && (
                    <div className="acciones">
                      <button
                        className="btn btn-aceptar"
                        onClick={() => moverOrden(order.id, "enProceso")}
                      >
                        Aceptar
                      </button>
                      <button
                        className="btn btn-rechazar"
                        onClick={() => moverOrden(order.id, "rechazado")}
                      >
                        Rechazar
                      </button>
                    </div>
                  )}

                  {activeTab === "enProceso" && (
                    <div className="acciones">
                      <button
                        className="btn btn-realizado"
                        onClick={() => moverOrden(order.id, "realizado")}
                      >
                        Realizado
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default VentanaCafeteria;
