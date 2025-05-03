import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Register from "./components/Register";
import Login from "./components/Login";
import CartPage from './components/CartPage';
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Book from "./components/Book";
import BookCategory from "./components/BookCategory"; // at top
import { ToastContainer } from "react-toastify";
// import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
// const navigate=useNavigate()
const handleLogout = () => {
  setIsAuthenticated(false);
  toast.success("Logged out successfully");
  // navigate('/')
};

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
      <Route path="/books/filter/:category" element={<BookCategory />} />
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/books" element={<Book/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />}/>
        {/* Route for book category filters */}
        <Route path="/books/filter/:category" element={<div>Category Page</div>} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
