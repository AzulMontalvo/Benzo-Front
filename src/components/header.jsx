import React, { useState } from 'react';
import { useRef } from "react";
import "../css/header.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Header = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        console.log("Buscando:", e.target.value);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo navbar-left me-3">
                    <a href="/">Benzo</a>
                </div>

                <div className="navbar-center-user">
                    <p>Logged User</p>
                </div>

                <div className="navbar-right">
                    <button className="cart-toggle" onClick={() => setIsCartOpen(!isCartOpen)}>
                        <i class="bi bi-cart3"></i>
                    </button>
                    {isCartOpen && (
                        <div className="cart-dropdown">
                            <h3>Tu Carrito</h3>
                            {/* Aquí iría la lista de productos del carrito */}
                            <p>No hay productos en el carrito.</p> {/* Ejemplo */}
                            <button className="checkout-button">Ordenar</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="navbar-container">
                <div className="navbar-center">
                    {/* Aquí va la funcionalidad de búsqueda */}
                    {/* <form onSubmit={handleSearch} className="search-form"> */}
                    <button type="submit" className="search-button">
                        <i class="bi bi-search"></i>
                    </button>
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {/* </form> */}
                </div>
            </div>
        </nav>
    );
};

export default Header;