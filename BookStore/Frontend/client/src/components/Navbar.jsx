import {React,useState }from "react";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("")
  const handleLogoutClick = () => {
    onLogout();       // update auth state
    navigate("/");    // redirect to home
  };
  const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchTerm.trim()) {
          navigate(`/books?title=${encodeURIComponent(searchTerm)}`)
          setSearchTerm("")
        }
      }
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Bookstore</Link>
        <div className="search">
        <form className="search-book" onSubmit={handleSearchSubmit}>
         <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="navbar-search-input"
            aria-label="Search books"
          />
          <button type="submit" className="navbar-search-button">
            Search
          </button>
        </form>
        </div>
        
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

// "use client"

// import { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import "./Navbar.css"

// const Navbar = ({ isAuthenticated, onLogout }) => {
//   const [searchTerm, setSearchTerm] = useState("")
//   const navigate = useNavigate()

//   const handleLogoutClick = () => {
//     onLogout() // update auth state
//     navigate("/") // redirect to home
//   }

//   const handleSearchSubmit = (e) => {
//     e.preventDefault()
//     if (searchTerm.trim()) {
//       navigate(`/books?title=${encodeURIComponent(searchTerm)}`)
//       setSearchTerm("")
//     }
//   }

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <Link to="/" className="navbar-logo">
//           Bookstore
//         </Link>

//         <form  onSubmit={handleSearchSubmit}>
//           <input
//             type="text"
//             placeholder="Search books..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="navbar-search-input"
//             aria-label="Search books"
//           />
//           <button type="submit" className="navbar-search-button">
//             Search
//           </button>
//         </form>

//         <div className="navbar-links">
//           <div className="navbar-item dropdown">
//             <Link to="/books" className="navbar-link">
//               Books
//             </Link>
//             <div className="dropdown-content">
//               <Link to="/books/filter/bestsellers" className="navbar-link">
//                 Bestsellers
//               </Link>
//               <Link to="/books/filter/awardwinners" className="navbar-link">
//                 Award Winners
//               </Link>
//               <Link to="/books/filter/newreleases" className="navbar-link">
//                 New Releases
//               </Link>
//               <Link to="/books/filter/newarrivals" className="navbar-link">
//                 New Arrivals
//               </Link>
//               <Link to="/books/filter/comingsoon" className="navbar-link">
//                 Coming Soon
//               </Link>
//             </div>
//           </div>

//           {isAuthenticated ? (
//             <button className="navbar-button" onClick={handleLogoutClick}>
//               Logout
//             </button>
//           ) : (
//             <Link to="/login" className="navbar-link">
//               Login
//             </Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   )
// }

// export default Navbar
