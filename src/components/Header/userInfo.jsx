import React, { useState, useEffect, use } from 'react';

const UserInfo = () => {

  const [usuario, setUsuario] = useState(null);
  useEffect(() => {
    const usuarioData = localStorage.getItem("usuario");
    if (usuarioData) 
      setUsuario(JSON.parse(usuarioData));
    }, []);
  if (!usuario) return <p>No has iniciado sesión</p>;

  return (
    <p className="user-info">
      Hola, {usuario.nombre} {usuario.apellido}
    </p>
  );
};

export default UserInfo;