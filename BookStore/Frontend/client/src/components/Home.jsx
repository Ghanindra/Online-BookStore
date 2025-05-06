// ;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Home.css';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//   const [newArrivals, setNewArrivals] = useState([]);
//   const [comingSoon, setComingSoon] = useState([]);
//   const [bestAuthors, setBestAuthors] = useState([]);
//   const [physicalBooks, setPhysicalBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState('grid');
//   const [cartItems, setCartItems] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const navigate = useNavigate();

//   const handleAddToCart = async (BookId) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       await axios.post(
//         'http://localhost:5023/api/user/cart/add',
//         { BookId, quantity: 1 },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const addedBook =
//         newArrivals.find((book) => book.id === BookId) ||
//         comingSoon.find((book) => book.id === BookId) ||
//         physicalBooks.find((book) => book.id === BookId);

//       const updatedCartItems = [...cartItems, { ...addedBook, quantity: 1 }];
//       setCartItems(updatedCartItems);

//       toast.success(`${addedBook?.title} has been added to your cart.`);
//       navigate('/cart');
//     } catch (error) {
//       console.error('Failed to add to cart:', error);
//       if (error.response?.status === 401) {
//         toast.error('Please log in to add kitabs to the cart.');
//         navigate('/login');
//       } else {
//         toast.error('Something went wrong! Please try again later.');
//       }
//     }
//   };

//   const handleNavigateToDetails = (bookId) => {
//     navigate(`/book/${bookId}`);
//   };

//   const fetchBooks = async () => {
//     try {
//       setLoading(true);

//       const [newArrivalsRes, comingSoonRes, bestAuthorsRes] = await Promise.all([
//         axios.get('http://localhost:5023/api/books/filter?category=newarrivals'),
//         axios.get('http://localhost:5023/api/books/filter?category=comingsoon'),
//         axios.get('http://localhost:5023/api/books/filter?category=bestsellers'),
//       ]);

//       setNewArrivals(newArrivalsRes.data);
//       setComingSoon(comingSoonRes.data);
//       setBestAuthors(bestAuthorsRes.data);

//       if (localStorage.getItem('token')) {
//         const physicalBooksRes = await axios.get('http://localhost:5023/api/books/physical');
//         setPhysicalBooks(physicalBooksRes.data);
//         setIsLoggedIn(true);
//       } else {
//         setPhysicalBooks([]); // Clear physical books on logout
//         setIsLoggedIn(false);
//       }

//       setLoading(false);
//     } catch (error) {
//       console.error('Failed to fetch data:', error);
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     const checkLoginStatus = () => {
//       const token = localStorage.getItem('token');
//       const loggedIn = !!token;
//       setIsLoggedIn(loggedIn);
//       if (!loggedIn) {
//         setPhysicalBooks([]); // Clear physical books immediately on logout
//       }
//     };
  
//     checkLoginStatus();
  
//     window.addEventListener('storage', checkLoginStatus);
//     return () => {
//       window.removeEventListener('storage', checkLoginStatus);
//     };
//   }, []);
  
  
//   useEffect(() => {
//     fetchBooks();
//   }, [isLoggedIn]);
  
//   return (
//     <div className="homepage-container">
//       {/* View Toggle */}
//       <div className="view-toggle">
//         <button className={`view-button ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
//           Grid View
//         </button>
//         <button className={`view-button ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
//           List View
//         </button>
//       </div>

//       {/* New Arrivals Section */}
//       <Section title="New Arrivals" books={newArrivals} viewMode={viewMode} loading={loading} onDetails={handleNavigateToDetails} onAddToCart={handleAddToCart} />

//       {/* Coming Soon Section */}
//       <Section title="Coming Soon" books={comingSoon} viewMode={viewMode} loading={loading} onDetails={handleNavigateToDetails} onAddToCart={handleAddToCart} />

//       {/* ✅ Physical Books - Only for Logged In Users */}
//       {isLoggedIn && (
//         <Section title="Physical Available Books" books={physicalBooks} viewMode={viewMode} loading={loading} onDetails={handleNavigateToDetails} onAddToCart={handleAddToCart} />
//       )}
//     </div>
//   );
// };

// // ✅ Reusable Section Component
// const Section = ({ title, books, viewMode, loading, onDetails, onAddToCart }) => (
//   <section className="section">
//     <h2>{title}</h2>
//     {loading ? (
//       <p className="loading-text">Loading kitabs...</p>
//     ) : books.length === 0 ? (
//       <p>No kitabs found.</p>
//     ) : viewMode === 'grid' ? (
//       <div className="kitabs-grid">
//         {books.map((kitab) => (
//           <div key={kitab.id} className="kitab-card" onClick={() => onDetails(kitab.id)}>
//             <img src={`http://localhost:5023${kitab.imageUrl}`} alt="Book" />
//             <h2>{kitab.title}</h2>
//             <p>By {kitab.author}</p>
//             <p>Genre: {kitab.genre}</p>
//             <p>Price: ${kitab.price}</p>
//             {kitab.discountPrice > 0 && <p className="discount-price">Discount: ${kitab.discountPrice}</p>}
//             {kitab.hasAwards && <span className="kitab-award">🏆 Award Winner</span>}
//             <button onClick={(e) => { e.stopPropagation(); onAddToCart(kitab.id); }}>🛒 Add to Cart</button>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <div className="kitab-list">
//         {books.map((kitab) => (
//           <div key={kitab.id} className="kitab-list-item" onClick={() => onDetails(kitab.id)}>
//             <strong>{kitab.title}</strong> by {kitab.author}
//             <div>
//               <span className="kitab-list-price">${kitab.price}</span>
//               {kitab.discountPrice > 0 && (
//                 <span className="kitab-list-discount"> (Discount: ${kitab.discountPrice})</span>
//               )}
//               {kitab.hasAwards && <span className="kitab-award"> 🏆</span>}
//             </div>
//             <button className="add-to-cart-btn" onClick={(e) => { e.stopPropagation(); onAddToCart(kitab.id); }}>
//               🛒 Add to Cart
//             </button>
//           </div>
//         ))}
//       </div>
//     )}
//   </section>
// );

// export default Home;

// ;






// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Home.css';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//   const [newArrivals, setNewArrivals] = useState([]);
//   const [comingSoon, setComingSoon] = useState([]);
//   const [bestAuthors, setBestAuthors] = useState([]);
//   const [physicalBooks, setPhysicalBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState('grid');
//   const [cartItems, setCartItems] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [sortBy, setSortBy] = useState('');
//   const [sortDirection, setSortDirection] = useState('asc');
  
//   const navigate = useNavigate();

//   const handleAddToCart = async (BookId) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       await axios.post(
//         'http://localhost:5023/api/user/cart/add',
//         { BookId, quantity: 1 },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const addedBook =
//         newArrivals.find((book) => book.id === BookId) ||
//         comingSoon.find((book) => book.id === BookId) ||
//         physicalBooks.find((book) => book.id === BookId);

//       const updatedCartItems = [...cartItems, { ...addedBook, quantity: 1 }];
//       setCartItems(updatedCartItems);

//       toast.success(`${addedBook?.title} has been added to your cart.`);
//       navigate('/cart');
//     } catch (error) {
//       console.error('Failed to add to cart:', error);
//       if (error.response?.status === 401) {
//         toast.error('Please log in to add kitabs to the cart.');
//         navigate('/login');
//       } else {
//         toast.error('Something went wrong! Please try again later.');
//       }
//     }
//   };

//   const handleNavigateToDetails = (bookId) => {
//     navigate(`/book/${bookId}`);
//   };

//   const fetchBooks = async () => {
//     try {
//       setLoading(true);
//       const sortParams = sortBy ? `&sortBy=${sortBy}&sortDirection=${sortDirection}` : '';
  
//       const [newArrivalsRes, comingSoonRes, bestAuthorsRes] = await Promise.all([
//         axios.get(`http://localhost:5023/api/books/filter?category=newarrivals${sortParams}`),
//         axios.get(`http://localhost:5023/api/books/filter?category=comingsoon${sortParams}`),
//         axios.get(`http://localhost:5023/api/books/filter?category=bestsellers${sortParams}`),
//       ]);
  
//       setNewArrivals(newArrivalsRes.data);
//       setComingSoon(comingSoonRes.data);
//       setBestAuthors(bestAuthorsRes.data);
  
//       if (localStorage.getItem('token')) {
//         const physicalBooksRes = await axios.get(`http://localhost:5023/api/books/physical?${sortParams}`);
//         setPhysicalBooks(physicalBooksRes.data);
//         setIsLoggedIn(true);
//       } else {
//         setPhysicalBooks([]);
//         setIsLoggedIn(false);
//       }
  
//       setLoading(false);
//     } catch (error) {
//       console.error('Failed to fetch data:', error);
//       setLoading(false);
//     }
//   };
  
//   useEffect(() => {
//     const checkLoginStatus = () => {
//       const token = localStorage.getItem('token');
//       const loggedIn = !!token;
//       setIsLoggedIn(loggedIn);
//       if (!loggedIn) {
//         setPhysicalBooks([]); // Clear physical books immediately on logout
//       }
//     };
  
//     checkLoginStatus();
  
//     window.addEventListener('storage', checkLoginStatus);
//     return () => {
//       window.removeEventListener('storage', checkLoginStatus);
//     };
//   }, []);
  
  
//   useEffect(() => {
//     fetchBooks();
//   }, [sortBy, sortDirection, isLoggedIn]);
  
//   return (
//     <div className="homepage-container">
//       {/* View Toggle */}
//       <div className="view-toggle">
//         <button className={`view-button ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
//           Grid View
//         </button>
//         <button className={`view-button ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
//           List View
//         </button>
//       </div>
//       <div className="sort-controls">
//   <label>Sort by:</label>
//   <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//     <option value="">Default</option>
//     <option value="title">Title</option>
//     <option value="price">Price</option>
//     <option value="publicationDate">Publication Date</option>
//   </select>

//   <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
//     <option value="asc">Ascending</option>
//     <option value="desc">Descending</option>
//   </select>
// </div>

//       {/* New Arrivals Section */}
//       <Section title="New Arrivals" books={newArrivals} viewMode={viewMode} loading={loading} onDetails={handleNavigateToDetails} onAddToCart={handleAddToCart} />

//       {/* Coming Soon Section */}
//       <Section title="Coming Soon" books={comingSoon} viewMode={viewMode} loading={loading} onDetails={handleNavigateToDetails} onAddToCart={handleAddToCart} />

//       {/* ✅ Physical Books - Only for Logged In Users */}
//       {isLoggedIn && (
//         <Section title="Physical Available Books" books={physicalBooks} viewMode={viewMode} loading={loading} onDetails={handleNavigateToDetails} onAddToCart={handleAddToCart} />
//       )}
//     </div>
//   );
// };


// // ✅ Reusable Section Component
// const Section = ({ title, books, viewMode, loading, onDetails, onAddToCart }) => (
//   <section className="section">
//     <h2>{title}</h2>
//     {loading ? (
//       <p className="loading-text">Loading kitabs...</p>
//     ) : books.length === 0 ? (
//       <p>No kitabs found.</p>
//     ) : viewMode === 'grid' ? (
//       <div className="kitabs-grid">
//         {books.map((kitab) => (
//           <div key={kitab.id} className="kitab-card" onClick={() => onDetails(kitab.id)}>
//             <img src={`http://localhost:5023${kitab.imageUrl}`} alt="Book" />
//             <h2>{kitab.title}</h2>
//             <p>By {kitab.author}</p>
//             <p>Genre: {kitab.genre}</p>
//             <p>Price: ${kitab.price}</p>
//             {kitab.discountPrice > 0 && <p className="discount-price">Discount: ${kitab.discountPrice}</p>}
//             {kitab.hasAwards && <span className="kitab-award">🏆 Award Winner</span>}
//             <button onClick={(e) => { e.stopPropagation(); onAddToCart(kitab.id); }}>🛒 Add to Cart</button>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <div className="kitab-list">
//         {books.map((kitab) => (
//           <div key={kitab.id} className="kitab-list-item" onClick={() => onDetails(kitab.id)}>
//             <strong>{kitab.title}</strong> by {kitab.author}
//             <div>
//               <span className="kitab-list-price">${kitab.price}</span>
//               {kitab.discountPrice > 0 && (
//                 <span className="kitab-list-discount"> (Discount: ${kitab.discountPrice})</span>
//               )}
//               {kitab.hasAwards && <span className="kitab-award"> 🏆</span>}
//             </div>
//             <button className="add-to-cart-btn" onClick={(e) => { e.stopPropagation(); onAddToCart(kitab.id); }}>
//               🛒 Add to Cart
//             </button>
//           </div>
//         ))}
//       </div>
//     )}
//   </section>
// );

// export default Home;

// ;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [bestAuthors, setBestAuthors] = useState([]);
  const [physicalBooks, setPhysicalBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // New state variables for filters
  const [filters, setFilters] = useState({
    author: '',
    genre: '',
    availability: '',
    priceRange: '',
    rating: '',
    language: '',
    format: '',
  });
  
  const navigate = useNavigate();

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
        physicalBooks.find((book) => book.id === BookId);

      const updatedCartItems = [...cartItems, { ...addedBook, quantity: 1 }];
      setCartItems(updatedCartItems);

      toast.success(`${addedBook?.title} has been added to your cart.`);
      navigate('/cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in to add kitabs to the cart.');
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

  // Fetch books with filters
  const fetchBooks = async () => {
    try {
      setLoading(true);

      const sortParams = sortBy ? `&sortBy=${sortBy}&sortDirection=${sortDirection}` : '';
      
      // Prepare filter parameters
      const filterParams = new URLSearchParams({
        category: 'all', // or use a dynamic category
        author: filters.author,
        genre: filters.genre,
        availability: filters.availability,
        priceRange: filters.priceRange,
        rating: filters.rating,
        language: filters.language,
        format: filters.format,
      }).toString();

      const [newArrivalsRes, comingSoonRes, bestAuthorsRes] = await Promise.all([
        axios.get(`http://localhost:5023/api/books/filter?${filterParams}${sortParams}`),
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

  // Update filters and fetch books
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [name]: value };
      fetchBooks();
      return newFilters;
    });
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const loggedIn = !!token;
      setIsLoggedIn(loggedIn);
      if (!loggedIn) {
        setPhysicalBooks([]); // Clear physical books immediately on logout
      }
    };

    checkLoginStatus();

    window.addEventListener('storage', checkLoginStatus);
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);
  
  useEffect(() => {
    fetchBooks();
  }, [sortBy, sortDirection, filters, isLoggedIn]);

  return (
    <div className="homepage-container">
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
        {/* <input
          type="text"
          name="availability"
          value={filters.availability}
          placeholder="Filter by Availability"
          onChange={handleFilterChange}
        /> */}
        {/* <input
          type="text"
          name="priceRange"
          value={filters.priceRange}
          placeholder="Filter by Price Range"
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="rating"
          value={filters.rating}
          placeholder="Filter by Rating"
          onChange={handleFilterChange}
        /> */}
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

      {/* New Arrivals Section */}
      <Section title="New Arrivals" books={newArrivals} viewMode={viewMode} loading={loading} onDetails={handleNavigateToDetails} onAddToCart={handleAddToCart} />

      {/* Coming Soon Section */}
      <Section title="Coming Soon" books={comingSoon} viewMode={viewMode} loading={loading} onDetails={handleNavigateToDetails} onAddToCart={handleAddToCart} />

      {/* Physical Books - Only for Logged In Users */}
      {isLoggedIn && (
        <Section title="Physical Available Books" books={physicalBooks} viewMode={viewMode} loading={loading} onDetails={handleNavigateToDetails} onAddToCart={handleAddToCart} />
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
            <h2>{book.title}</h2>
            <p>By {book.author}</p>
            <p>Genre: {book.genre}</p>
            <p>Price: ${book.price}</p>
            {book.discountPrice > 0 && <p className="discount-price">Discount: ${book.discountPrice}</p>}
            {book.hasAwards && <span className="book-award">🏆 Award Winner</span>}
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
              {book.hasAwards && <span className="book-award"> 🏆</span>}
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
