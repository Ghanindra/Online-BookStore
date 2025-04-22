import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [category, setCategory] = useState('all');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const navigate = useNavigate();

  const handleAddToCart = async (bookId) => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage (or cookies)
      if (!token) {
        // If no token, redirect to login page
        navigate('/login');
        return;
      }

      await axios.post(
        'http://localhost:5023/api/user/cart/add', // API endpoint to add book to cart
        { bookId, quantity: 1 }, // Book ID and quantity (you can adjust quantity based on your needs)
        {
          headers: {
            Authorization: `Bearer ${token}`, // Sending token for authentication
          },
        }
      );

      // Navigate to the cart page after successfully adding to cart
      navigate('/cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      if (error.response && error.response.status === 401) {
        alert('Please log in to add books to the cart.');
        navigate('/login');
      } else {
        alert('Something went wrong! Please try again later.');
      }
    }
  };

  const fetchBooks = async (selectedCategory) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5023/api/books/filter?category=${selectedCategory}`
      );
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(category);
  }, [category]);

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Book Store 🛍️</h1>

      <div className="top-bar">
        <div className="category-buttons">
          {['all', 'bestsellers', 'awardwinners', 'newreleases', 'newarrivals', 'comingsoon', 'deals'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`category-button ${category === cat ? 'active' : ''}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="view-toggle">
          <button
            className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </button>
          <button
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
        </div>
      </div>

      {/* Book Display */}
      {loading ? (
        <p className="loading-text">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="no-books">No books found.</p>
      ) : viewMode === 'grid' ? (
        <div className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <h2 className="book-title">{book.title}</h2>
              <p className="book-author">by {book.author}</p>
              <p className="book-genre">{book.genre}</p>
              <p className="book-price">${book.price}</p>
              {book.discountPrice > 0 && (
                <p className="book-discount">Discount: ${book.discountPrice}</p>
              )}
              {book.hasAwards && <span className="book-award">🏆 Award Winner</span>}
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(book.id)}
              >
                🛒 Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="book-list">
          {books.map((book) => (
            <div key={book.id} className="book-list-item">
              <div>
                <strong>{book.title}</strong> by {book.author}
              </div>
              <div>
                <span className="book-list-price">${book.price}</span>
                {book.discountPrice > 0 && (
                  <span className="book-list-discount"> (Discount: ${book.discountPrice})</span>
                )}
                {book.hasAwards && <span className="book-award"> 🏆</span>}
              </div>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(book.id)}
              >
                🛒 Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
