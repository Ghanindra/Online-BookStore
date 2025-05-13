
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import { toast } from 'react-toastify';
import { useNavigate ,useParams} from 'react-router-dom';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [bestAuthors, setBestAuthors] = useState([]);
  const [physicalBooks, setPhysicalBooks] = useState([]);
  const [booksOnSale, setBooksOnSale] = useState([]); // State for books on sale
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
    const [banner, setBanner] = useState([]);
 
  // const { bannerId } = useParams()

  // New state variables for filters
  const [filters, setFilters] = useState({
    author: '',
    genre: '',
    language: '',
    format: '',
  });

  const navigate = useNavigate();

  const fetchBanner = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found. Please log in.');
    return;
  }

  try {
    const response = await axios.get(`http://localhost:5023/api/books/banners`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBanner(response.data);
  } catch (error) {
    console.error('Error fetching banner:', error);
    if (error.response && error.response.status === 400) {
      alert('Bad request. Please check the API endpoint or request format.');
    }
  } finally {
    setLoading(false);
  }
};
  // Fetch books on sale
  const fetchBooksOnSale = async () => {
    try {
      const response = await axios.get(`http://localhost:5023/api/books/deals`);
      const books = response.data;

      // Filter out books with expired sales (if backend doesn't handle it)
      // const currentTime = new Date();
      // const activeBooks = books.filter(book => {
        // return book.isOnSale && new Date(book.saleEnd) > currentTime;
         // Convert SaleEnd to local time
      const booksWithLocalTime = books.map(book => ({
        ...book,
        saleEndLocal: book.saleEnd ? new Date(book.saleEnd).toLocaleString() : null,
      })
    );

      // }
    // );

     setBooksOnSale(booksWithLocalTime);
    } catch (error) {
      console.error('Error fetching books on sale:', error);
    }
  };

  // Fetch other books with filters and sorting
  const fetchBooks = async () => {
    try {
      setLoading(true);

      const sortParams = sortBy ? `&sortBy=${sortBy}&sortDirection=${sortDirection}` : '';

      // Prepare filter parameters
      const filterParams = new URLSearchParams({
        author: filters.author,
        genre: filters.genre,
        language: filters.language,
        format: filters.format,
      }).toString();

      const [newArrivalsRes, comingSoonRes, bestAuthorsRes] = await Promise.all([
        axios.get(`http://localhost:5023/api/books/filter?category=newarrivals&${filterParams}${sortParams}`),
        axios.get(`http://localhost:5023/api/books/filter?category=comingsoon&${filterParams}${sortParams}`),
        axios.get(`http://localhost:5023/api/books/filter?category=bestsellers&${filterParams}${sortParams}`),
      ]);

      setNewArrivals(newArrivalsRes.data);
      setComingSoon(comingSoonRes.data);
      setBestAuthors(bestAuthorsRes.data);

      if (localStorage.getItem('token')) {
        const physicalBooksRes = await axios.get(`http://localhost:5023/api/books/physical?${filterParams}${sortParams}`);
        setPhysicalBooks(physicalBooksRes.data);
        setIsLoggedIn(true);
      } else {
        setPhysicalBooks([]);
        setIsLoggedIn(false);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  // Handle adding to the cart
  const handleAddToCart = async (BookId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(
        'http://localhost:5023/api/user/cart/add',
        { BookId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const addedBook =
        newArrivals.find((book) => book.id === BookId) ||
        comingSoon.find((book) => book.id === BookId) ||
        physicalBooks.find((book) => book.id === BookId) ||
        booksOnSale.find((book) => book.id === BookId);

      const updatedCartItems = [...cartItems, { ...addedBook, quantity: 1 }];
      setCartItems(updatedCartItems);

      toast.success(`${addedBook?.title} has been added to your cart.`);
      navigate('/cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in to add books to the cart.');
        navigate('/login');
      } else {
        toast.error('Something went wrong! Please try again later.');
      }
    }
  };

  // Navigate to book details
  const handleNavigateToDetails = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  // Update filters and fetch books
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [name]: value };
      fetchBooks();
      return newFilters;
    });
  };

  // Fetch books on component mount
  useEffect(() => {
        fetchBanner(); // Fetch banners on component mount
    fetchBooks();
    fetchBooksOnSale();
  }, [sortBy, sortDirection]);

  return (
    <div className="homepage-container">
       {/* Banner Section */}
      {banner.length > 0 && (
        <div className="banner-section">
          {banner.map((banner) => (
            <div key={banner.id} className="banner">
              <p>{banner.message}</p>
            </div>
          ))}
        </div>
      )}
      {/* Filter Controls */}
      <div className="filter-controls">
        <input
          type="text"
          name="author"
          value={filters.author}
          placeholder="Filter by Author"
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="genre"
          value={filters.genre}
          placeholder="Filter by Genre"
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="language"
          value={filters.language}
          placeholder="Filter by Language"
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="format"
          value={filters.format}
          placeholder="Filter by Format"
          onChange={handleFilterChange}
        />
      </div>

      {/* Sort Controls */}
      <div className="sort-controls">
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Default</option>
          <option value="title">Title</option>
          <option value="price">Price</option>
          <option value="publicationDate">Publication Date</option>
        </select>

        <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
     

      {/* Deals Section */}
      <Section
        title="Deals of the Day"
        books={booksOnSale}
        viewMode={viewMode}
        loading={loading}
        onDetails={handleNavigateToDetails}
        onAddToCart={handleAddToCart}
      />

      {/* New Arrivals Section */}
      <Section
        title="New Arrivals"
        books={newArrivals}
        viewMode={viewMode}
        loading={loading}
        onDetails={handleNavigateToDetails}
        onAddToCart={handleAddToCart}
      />

      {/* Coming Soon Section */}
      <Section
        title="Coming Soon"
        books={comingSoon}
        viewMode={viewMode}
        loading={loading}
        onDetails={handleNavigateToDetails}
        onAddToCart={handleAddToCart}
      />

      {/* Physical Books Section */}
      {isLoggedIn && (
        <Section
          title="Physical Available Books"
          books={physicalBooks}
          viewMode={viewMode}
          loading={loading}
          onDetails={handleNavigateToDetails}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

// Reusable Section Component
const Section = ({ title, books, viewMode, loading, onDetails, onAddToCart }) => (
  <section className="section">
    <h2>{title}</h2>
    {loading ? (
      <p className="loading-text">Loading books...</p>
    ) : books.length === 0 ? (
      <p>No books found.</p>
    ) : viewMode === 'grid' ? (
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card" onClick={() => onDetails(book.id)}>
            <img src={`http://localhost:5023${book.imageUrl}`} alt="Book" />
            {book.isOnSale && <span className="sale-badge">{book.discountPercentage}% Off</span>}
            <h2>{book.title}</h2>
            <p>By {book.author}</p>
            <p>Genre: {book.genre}</p>
            <p>Price: ${book.price}</p>
            {book.discountPrice > 0 && <p className="discount-price">Discount: ${book.discountPrice}</p>}
             {book.saleEndLocal && <p>Sale Ends: {book.saleEndLocal}</p>}
            <button onClick={(e) => { e.stopPropagation(); onAddToCart(book.id); }}>🛒 Add to Cart</button>
          </div>
        ))}
      </div>
    ) : (
      <div className="book-list">
        {books.map((book) => (
          <div key={book.id} className="book-list-item" onClick={() => onDetails(book.id)}>
            <strong>{book.title}</strong> by {book.author}
            <div>
              <span className="book-list-price">${book.price}</span>
              {book.discountPrice > 0 && (
                <span className="book-list-discount"> (Discount: ${book.discountPrice})</span>
              )}
              {book.isOnSale && <span className="sale-label"> 🔥 {book.discountPercentage}% Off</span>}
               {book.saleEndLocal && <p>Sale Ends: {book.saleEndLocal}</p>}
            </div>
            <button className="add-to-cart-btn" onClick={(e) => { e.stopPropagation(); onAddToCart(book.id); }}>
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>
    )}
  </section>
);

export default Home;