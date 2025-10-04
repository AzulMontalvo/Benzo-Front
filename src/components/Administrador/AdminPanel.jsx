import React, { useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';

const AdminPanel = () => {
  const [user, setUser] = useState({ name: '', controlNumber: '', role: 'Estudiante', email: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const registeredUsers = [
    { name: 'David Torres', email: 'LZ1540009@delicias.tecnm.mx', controlNumber: 'A0001', role: 'Estudiante', date: '2025-09-28' },
    { name: 'Martin Languro', email: '-', controlNumber: 'A0001', role: 'Administrador', date: '2025-09-27' },
    { name: 'Juan Martinez', email: '-', controlNumber: 'CA0001', role: 'Cafetería', date: '2025-09-29' },
  ];

  const [newRole, setNewRole] = useState('');

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-light bg-primary mb-4">
        <div className="navbar-nav">
          <a className="nav-link text-white" href="#panel">Panel Administración</a>
          <a className="nav-link text-white" href="#usuarios">Usuarios</a>
          <a className="nav-link text-white" href="#roles">Roles</a>
        </div>
        <div className="navbar-text text-white">Admin1 (Administrador)</div>
        <button className="btn btn-light ml-auto">Cerrar sesión</button>
      </nav>

      <h2>Crear Usuario</h2>
      <form className="mb-4">
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" className="form-control" name="name" value={user.name} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Número de control</label>
          <input type="text" className="form-control" name="controlNumber" value={user.controlNumber} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" className="form-control" name="password" value={user.password} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Correo institucional (@delicias.tecnm.mx)</label>
          <input type="email" className="form-control" name="email" value={user.email} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Rol</label>
          <select className="form-control" name="role" value={user.role} onChange={handleInputChange}>
            <option>Estudiante</option>
            <option>Administrador</option>
            <option>Cafetería</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-25">Guardar</button>
        <button type="button" className="btn btn-secondary w-25 ml-2">Cancelar</button>
      </form>

      <h2>Usuarios Registrados</h2>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Número de Control</th>
            <th>Rol</th>
            <th>Fecha de creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registeredUsers.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.controlNumber}</td>
              <td>{user.role}</td>
              <td>{user.date}</td>
              <td>
                <button className="btn btn-warning btn-sm mr-2">Editar</button>
                <button className="btn btn-danger btn-sm">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Agregar Rol</h2>
      <div className="input-group mb-3 w-50">
        <input
          type="text"
          className="form-control"
          placeholder="Nombre del rol"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        />
        <div className="input-group-append">
          <button className="btn btn-primary" type="button">Agregar</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;