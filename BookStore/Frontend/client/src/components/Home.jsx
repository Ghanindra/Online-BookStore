// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Home.css';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//   const [category, setCategory] = useState('all');
//   const [kitabs, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState('grid');
//   const [cartItems, setCartItems] = useState([]); // Local cart state to keep track of added items
//   const navigate = useNavigate();

//   const handleAddToCart = async (kitabId) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       // Make API call to add to cart
//       await axios.post(
//         'http://localhost:5023/api/user/cart/add',
//         { kitabId, quantity: 1 },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Optionally, update local state for the cart (this will show cart in the UI without navigating)
//       const updatedCartItems = [...cartItems];
//       const addedBook = kitabs.find((kitab) => kitab.id === kitabId);
//       updatedCartItems.push({ ...addedBook, quantity: 1 });
//       setCartItems(updatedCartItems);  // Update the local cart state

//       // Optionally, show success message
//       toast.success(`${addedBook.title} has been added to your cart.`);

      
//       // Navigate to the cart page if needed
//       navigate('/cart');
      
//     } catch (error) {
//       console.error('Failed to add to cart:', error);
//       if (error.response && error.response.status === 401) {
//         toast.failure('Please log in to add kitabs to the cart.');
//         navigate('/login');
//       } else {
//         toast.error('Something went wrong! Please try again later.');
//       }
//     }
//   };

//   const fetchBooks = async (selectedCategory) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `http://localhost:5023/api/kitabs/filter?category=${selectedCategory}`
//       );
     
//       console.log('Books fetched:', response.data);  // Log the fetched data
      
//       setBooks(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Failed to fetch kitabs:', error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBooks(category);
//   }, [category]);

//   return (
//     <div className="homepage-container">
//       <h1 className="homepage-title">Book Store 🛍️</h1>

//       <div className="top-bar">
//         <div className="category-buttons">
//           {['all', 'bestsellers', 'awardwinners', 'newreleases', 'newarrivals', 'comingsoon', 'deals'].map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setCategory(cat)}
//               className={`category-button ${category === cat ? 'active' : ''}`}
//             >
//               {cat.charAt(0).toUpperCase() + cat.slice(1)}
//             </button>
//           ))}
//         </div>

//         {/* View Toggle */}
//         <div className="view-toggle">
//           <button
//             className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
//             onClick={() => setViewMode('grid')}
//           >
//             Grid View
//           </button>
//           <button
//             className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
//             onClick={() => setViewMode('list')}
//           >
//             List View
//           </button>
//         </div>
//       </div>

//       {/* Book Display */}
//       {loading ? (
//         <p className="loading-text">Loading kitabs...</p>
//       ) : kitabs.length === 0 ? (
//         <p className="no-kitabs">No kitabs found.</p>
//       ) : viewMode === 'grid' ? (
//         <div className="kitabs-grid">
//           {kitabs.map((kitab) => (
          
//             <div key={kitab.id} className="kitab-card">
// <img src={`http://localhost:5023${kitab.imageUrl}`} alt="Book Image" />
//               <h2 className="kitab-title">{kitab.title}</h2>
//               <p className="kitab-author">by {kitab.author}</p>
//               <p className="kitab-genre">{kitab.genre}</p>
//               <p className="kitab-price">${kitab.price}</p>
//               {kitab.discountPrice > 0 && (
//                 <p className="kitab-discount">Discount: ${kitab.discountPrice}</p>
//               )}
//               {kitab.hasAwards && <span className="kitab-award">🏆 Award Winner</span>}
//               <button
//                 className="add-to-cart-btn"
//                 onClick={() => handleAddToCart(kitab.id)}
//               >
//                 🛒 Add to Cart
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="kitab-list">
//           {kitabs.map((kitab) => (
            
//             <div key={kitab.id} className="kitab-list-item">
//               <div>
//               <img src={`http://localhost:5023${kitab.imageUrl}`} alt="Book Image" />
//                 <strong>{kitab.title}</strong> by {kitab.author}
//               </div>
//               <div>
//                 <span className="kitab-list-price">${kitab.price}</span>
//                 {kitab.discountPrice > 0 && (
//                   <span className="kitab-list-discount"> (Discount: ${kitab.discountPrice})</span>
//                 )}
//                 {kitab.hasAwards && <span className="kitab-award"> 🏆</span>}
//               </div>
//               <button
//                 className="add-to-cart-btn"
//                 onClick={() => handleAddToCart(kitab.id)}
//               >
//                 🛒 Add to Cart
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [bestAuthors, setBestAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const handleAddToCart = async (BookId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Make API call to add to cart
      await axios.post(
        'http://localhost:5023/api/user/cart/add',
        { BookId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optionally, update local state for the cart (this will show cart in the UI without navigating)
      const updatedCartItems = [...cartItems];
      const addedBook = newArrivals.find((book) => book.id === BookId) || comingSoon.find((book) => book.id === BookId);
      updatedCartItems.push({ ...addedBook, quantity: 1 });
      setCartItems(updatedCartItems);  // Update the local cart state

      toast.success(`${addedBook?.title} has been added to your cart.`);
      navigate('/cart');  // Navigate to the cart page
    } catch (error) {
      console.error('Failed to add to cart:', error);
      if (error.response && error.response.status === 401) {
        toast.error('Please log in to add kitabs to the cart.');
        navigate('/login');
      } else {
        toast.error('Something went wrong! Please try again later.');
      }
    }
  };

  // Fetch kitabs for each category
  const fetchBooks = async () => {
    try {
      setLoading(true);
      // Fetch New Arrivals
      const newArrivalsResponse = await axios.get('http://localhost:5023/api/books/filter?category=newarrivals');
      setNewArrivals(newArrivalsResponse.data);

      // Fetch Coming Soon
      const comingSoonResponse = await axios.get('http://localhost:5023/api/books/filter?category=comingsoon');
      setComingSoon(comingSoonResponse.data);

      // Fetch Best Authors
      const authorsResponse = await axios.get('http://localhost:5023/api/books/filter?category=bestsellers');
      setBestAuthors(authorsResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);
  const handleNavigateToDetails = (bookId) => {
    navigate(`/book/${bookId}`);
  };
  return (
    <div className="homepage-container">
      {/* <h1 className="homepage-title">Book Store 🛍️</h1> */}

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

      {/* New Arrivals Section */}
      <section className="section">
        <h2>New Arrivals</h2>
        {loading ? (
          <p className="loading-text">Loading kitabs...</p>
        ) : newArrivals.length === 0 ? (
          <p>No new arrivals found.</p>
        ) : viewMode === 'grid' ? (
          <div className="kitabs-grid">
            {newArrivals.map((kitab) => {
              return (
                // <div key={kitab.id} className="kitab-card">
                <div key={kitab.id} className="kitab-card" onClick={() => handleNavigateToDetails(kitab.id)}>
                     <img src={`http://localhost:5023${kitab.imageUrl}`} alt="Book Image" />
                  <h2>{kitab?.title}</h2>
                  <p>By {kitab?.author}</p>
                  <p>Genre: {kitab?.genre}</p>
                  <p>Price: ${kitab?.price}</p>
                  {kitab?.discountPrice && kitab.discountPrice > 0 && (
                    <p className="discount-price">
                      Discount Price: ${kitab?.discountPrice}
                    </p>
                  )}
                  {kitab?.hasAwards && <span className="kitab-award">🏆 Award Winner</span>}
                  <button onClick={() => handleAddToCart(kitab.id)}>Add to Cart</button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="kitab-list">
            {newArrivals.map((kitab) => {
              return (
                // <div key={kitab.id} className="kitab-card">
                <div key={kitab.id} className="kitab-card" onClick={() => handleNavigateToDetails(kitab.id)}>
                     <img src={`http://localhost:5023${kitab.imageUrl}`} alt="Book Image" />
                  <h2>{kitab?.title}</h2>
                  <p>By {kitab?.author}</p>
                  <p>Genre: {kitab?.genre}</p>
                  <p>Price: ${kitab?.price}</p>
                  {kitab?.discountPrice && kitab.discountPrice > 0 && (
                    <p className="discount-price">
                      Discount Price: ${kitab?.discountPrice}
                    </p>
                  )}
                  <button onClick={() => handleAddToCart(kitab.id)}>Add to Cart</button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Coming Soon Section */}
      <section className="section">
        <h2>Coming Soon</h2>
        {loading ? (
          <p className="loading-text">Loading kitabs...</p>
        ) : comingSoon.length === 0 ? (
          <p>No coming soon kitabs found.</p>
        ) : viewMode === 'grid' ? (
          <div className="kitabs-grid">
            {comingSoon.map((kitab) => {
              return (
                // <div key={kitab.id} className="kitab-card">
                <div key={kitab.id} className="kitab-card" onClick={() => handleNavigateToDetails(kitab.id)}>
                     <img src={`http://localhost:5023${kitab.imageUrl}`} alt="Book Image" />
                  <h2>{kitab?.title}</h2>
                  <p>By {kitab?.author}</p>
                  <p>Genre: {kitab?.genre}</p>
                  <p>Price: ${kitab?.price}</p>
                  {kitab?.discountPrice && kitab.discountPrice > 0 && (
                    <p className="kitab-discount">Discount: ${kitab?.discountPrice}</p>
                  )}
                  {kitab?.hasAwards && <span className="kitab-award">🏆 Award Winner</span>}
                  <button
                    onClick={() => handleAddToCart(kitab.id)}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="kitab-list">
            {comingSoon.map((kitab) => {
              return (
                // <div key={kitab.id} className="kitab-list-item">
                <div key={kitab.id} className="kitab-list-item" onClick={() => handleNavigateToDetails(kitab.id)}>
                  <div>
                    <strong>{kitab.title}</strong> by {kitab.author}
                  </div>
                  <div>
                    <span className="kitab-list-price">${kitab.price}</span>
                    {kitab.discountPrice && kitab.discountPrice > 0 && (
                      <span className="kitab-list-discount"> (Discount: ${kitab.discountPrice})</span>
                    )}
                    {kitab.hasAwards && <span className="kitab-award"> 🏆</span>}
                  </div>
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(kitab.id)}  
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

     
    </div>
  );
};

export default Home;
