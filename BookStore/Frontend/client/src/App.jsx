import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Register from "./components/Register";
import Login from "./components/Login";
import CartPage from './components/CartPage';
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Book from "./components/Book";
import AdminDashboard from "./components/AdminDashboard";
import EditBook from "./components/EditBook";
import BookDetails from "./components/BookDetails";
import BookCategory from "./components/BookCategory"; // at top
import OrderHistory from "./components/OrderHistory"; // at top
import Bookmarks from "./components/Bookmarks"; // at top
import StaffPortal from "./components/StaffPortal"; // at top
import { RequireAuth } from "./components/RequireAuth";
import { ToastContainer } from "react-toastify";

// import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from 'react-router-dom';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
// const navigate=useNavigate();
  // On first mount, check localStorage for a token
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Call this when your login form succeeds
  const handleLogin = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setIsAuthenticated(true);
  };

  // Pass this down to Navbar so it can clear out auth state
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
      <Route path="/books/filter/:category" element={<BookCategory />} />
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={ <RequireAuth><CartPage /></RequireAuth>} />
        <Route path="/books" element={<Book/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/admindashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />}/>
        {/* Route for book category filters */}
        <Route path="/books/filter/:category" element={<div>Category Page</div>} />
        <Route path="/admin/edit-book/:id" element={<RequireAuth><EditBook /></RequireAuth>} />
        <Route path="/book/:bookId" element={<RequireAuth><BookDetails /></RequireAuth>} />
        <Route path="/orderhistory" element={<RequireAuth><OrderHistory /></RequireAuth>} />
        <Route path="/bookmarks" element={<RequireAuth><Bookmarks /></RequireAuth>} />
        <Route path="/staffportal" element={<RequireAuth><StaffPortal /></RequireAuth>} />
      
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
