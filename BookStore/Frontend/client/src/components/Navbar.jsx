import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const { count } = useCart();
  const role = localStorage.getItem("role");
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogoutClick = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      onLogout();
      navigate("/");
    }
  };

 const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/books?title=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };



  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Bookstore</Link>

        <form className="search-book" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by title, ISBN, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="navbar-search-input"
          />
          <button type="submit" className="navbar-search-button">Search</button>
        </form>

        <div className="navbar-links">
          <div className="navbar-item dropdown">
            <Link to="/books" className="navbar-link">Books</Link>
            <div className="dropdown-content">
              <Link to="/books/filter/bestsellers" className="navbar-link">Bestsellers</Link>
              <Link to="/books/filter/awardwinners" className="navbar-link">Award Winners</Link>
              <Link to="/books/filter/newreleases" className="navbar-link">New Releases</Link>
              <Link to="/books/filter/newarrivals" className="navbar-link">New Arrivals</Link>
              <Link to="/books/filter/comingsoon" className="navbar-link">Coming Soon</Link>
            </div>
          </div>

          {isAuthenticated && role === "User" && (
            <>
              <Link to="/orderhistory" className="navbar-cart">Order History</Link>
              <Link to="/cart" className="navbar-cart">
                <FaShoppingCart size={20} />
                {count > 0 && <span className="cart-badge">{count}</span>}
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <button className="navbar-button" onClick={handleLogoutClick}>Logout</button>
          ) : (
            <Link to="/login" className="navbar-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
