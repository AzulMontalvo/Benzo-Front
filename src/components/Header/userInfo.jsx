import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const UserInfo = () => {
  const [usuario, setUsuario] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioData = localStorage.getItem("usuario");
    if (usuarioData) 
      setUsuario(JSON.parse(usuarioData));
  }, []);

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Limpia el localStorage
    localStorage.removeItem('usuario');
    localStorage.removeItem('token'); // Si tienes token
    // Redirige al login
    navigate('/login');
  };

  const handleOrders = () => {
    navigate('/status'); // Ajusta la ruta según tu app
    setIsUserMenuOpen(false);
  };

  if (!usuario) return <p>No has iniciado sesión</p>;

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button 
        className="user-info-button" 
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
      >
        <span className="">Hola, {usuario.nombre} {usuario.apellido}</span>
      </button>

      {isUserMenuOpen && (
        <div className="user-dropdown">
          <button className="user-dropdown-item" onClick={handleOrders}>
            <i className="bi bi-bag-check"></i>
            Mis Pedidos
          </button>
          <button className="user-dropdown-item logout" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;