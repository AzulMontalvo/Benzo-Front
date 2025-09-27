import React, { useState } from 'react';
import { useRef } from "react";
import '../../css/header.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SearchBar from './searchBar.jsx';
import Cart from './cart.jsx';
import UserInfo from './userInfo.jsx';
import { useCart } from '../../context/CartContext.jsx';

const Header = ({searchTerm, setSearchTerm}) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { getTotalItems } = useCart();

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo navbar-left me-3">
                    <a href="/productos">Benzo</a>
                </div>

                <div className="navbar-center-user">
                    <UserInfo />
                </div>

                <div className="navbar-right">
                    <button className="cart-toggle" onClick={toggleCart}>
                        <i className="bi bi-cart3"></i>
                        {getTotalItems() > 0 && (
                        <span className="cart-count">{getTotalItems()}</span>)}
                    </button>
                    {isCartOpen && <Cart />}
                </div>
            </div>
            
            <div className="navbar-container">
                <div className="navbar-center">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </div>
            </div>
        </nav>
    );
};

export default Header;