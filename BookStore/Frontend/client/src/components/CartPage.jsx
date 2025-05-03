// ;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './CartPage.css';

// const CartPage = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [books, setBooks] = useState([]); // To store available books to be added to the cart
//   const navigate = useNavigate(); // For redirect

//   const fetchCart = async () => {
//     try {
//       const token = localStorage.getItem('token'); //  Get JWT from localStorage
//       const response = await axios.get('http://localhost:5023/api/user/cart', {
//         headers: {
//           Authorization: `Bearer ${token}`, // 👈 Send as Bearer token
//         },
//       });
//       console.log('cart',response.data);
      
//       setCartItems(response.data);
//     } catch (err) {
//       if (err.response && err.response.status === 401) {
//         navigate('/login');
//       } else {
//         console.error('Error fetching cart:', err);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBooks = async () => {
//     try {
//       // Assuming you have an endpoint to fetch all available books to display in the catalog
//       const response = await axios.get('http://localhost:5023/api/books');
//       setBooks(response.data); // Set the available books
//     } catch (err) {
//       console.error('Error fetching books:', err);
//     }
//   };

//   const addToCart = async (bookId) => {
//     try {
//       const token = localStorage.getItem('token'); // 👈 Get JWT from localStorage
//       const response = await axios.post(
//         'http://localhost:5023/api/user/cart/add',
//         { bookId, quantity: 1 }, // Add with quantity 1
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log(response.data); // Optionally log the response for debugging
//       fetchCart(); // Refresh cart items
//     } catch (err) {
//       console.error('Error adding item to cart:', err);
//     }
//   };

//   const removeFromCart = async (bookId) => {
//     try {
//       await axios.delete(`http://localhost:5023/api/user/cart/remove?bookId=${bookId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       fetchCart(); // Refresh cart items after removal
//     } catch (err) {
//       console.error('Error removing item:', err);
//     }
//   };

//   const updateQty = async (bookId, quantity) => {
//     try {
//       await axios.post(
//         'http://localhost:5023/api/user/cart/add',
//         { bookId, quantity },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       fetchCart();
//     } catch (err) {
//       console.error('Error updating quantity:', err);
//     }
//   };

//   const increaseQty = (item) => updateQty(item.bookId, 1);
//   const decreaseQty = (item) =>
//     item.quantity > 1 ? updateQty(item.bookId, -1) : removeFromCart(item.bookId);

//   const calculateTotal = () =>
//     cartItems.reduce((total, item) => {
//       const price = item.book.discountPrice > 0 ? item.book.discountPrice : item.book.price;
//       return total + price * item.quantity;
//     }, 0);

//   useEffect(() => {
//     fetchCart();
//     fetchBooks(); // Fetch available books to display on page load
//   }, []);

//   if (loading) return <p>Loading your cart...</p>;

//   return (
//     <div className="cart-page">
//       <h2>Your Cart 🛒</h2>
//       {cartItems.length === 0 ? (
//         <p>No items in your cart.</p>
//       ) : (
//         <div>
//           <ul className="cart-list">
//             {cartItems.map((item) => (
//               <li key={item.id} className="cart-item">
//                 <div>
//                   <strong>{item.book.title}</strong> <br />
//                   Price: ${item.book.discountPrice > 0 ? item.book.discountPrice : item.book.price}
//                 </div>

//                 <div className="qty-controls">
//                   <button onClick={() => decreaseQty(item)}>-</button>
//                   <span>{item.quantity}</span>
//                   <button onClick={() => increaseQty(item)}>+</button>
//                 </div>

//                 <button className="remove-btn" onClick={() => removeFromCart(item.bookId)}>
//                   Remove
//                 </button>
//               </li>
//             ))}
//           </ul>

//           <h3>Total: ${calculateTotal().toFixed(2)}</h3>
//         </div>
//       )}

//       {/*  Available Books to Add to Cart */}
//       <div className="add-to-cart-section">
//         <h3>Available Books</h3>
//         <ul className="book-list">
//           {books.map((book) => (
//             <li key={book.id} className="book-item">
//                <img src={`http://localhost:5023${book.imageUrl}`} alt="Book Image" />
//               <div>
             
//                 <strong>{book.title}</strong> <br />
//                 Price: ${book.discountPrice > 0 ? book.discountPrice : book.price}
//               </div>
//               <button onClick={() => addToCart(book.id)} className="add-to-cart-btn">
//                 Add to Cart
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div> 
//     </div>
//   );
// };

// export default CartPage;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]); // To store available books to be added to the cart
  const [orderStatus, setOrderStatus] = useState(null); // To show order status
  const navigate = useNavigate(); // For redirect

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token'); // Get JWT from localStorage
      const response = await axios.get('http://localhost:5023/api/user/cart', {
        headers: {
          Authorization: `Bearer ${token}`, // Send as Bearer token
        },
      });
      setCartItems(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/login');
      } else {
        console.error('Error fetching cart:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch available books
  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5023/api/books');
      setBooks(response.data); // Set the available books
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  // Add book to cart
  const addToCart = async (bookId) => {
    try {
      const token = localStorage.getItem('token'); // Get JWT from localStorage
      const response = await axios.post(
        'http://localhost:5023/api/user/cart/add',
        { bookId, quantity: 1 }, // Add with quantity 1
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCart(); // Refresh cart items
    } catch (err) {
      console.error('Error adding item to cart:', err);
    }
  };

  // Remove book from cart
  const removeFromCart = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5023/api/user/cart/remove?bookId=${bookId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchCart(); // Refresh cart items after removal
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  // Update quantity in cart
  const updateQty = async (bookId, quantity) => {
    try {
      await axios.post(
        'http://localhost:5023/api/user/cart/add',
        { bookId, quantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const increaseQty = (item) => updateQty(item.bookId, 1);
  const decreaseQty = (item) =>
    item.quantity > 1 ? updateQty(item.bookId, -1) : removeFromCart(item.bookId);

  // Calculate total price
  const calculateTotal = () =>
    cartItems.reduce((total, item) => {
      const price = item.book.discountPrice > 0 ? item.book.discountPrice : item.book.price;
      return total + price * item.quantity;
    }, 0);

    const placeSingleOrder = async (item) => {
      const token = localStorage.getItem('token');
      try {
        const {data}  = await axios.post(
          'http://localhost:5023/api/orders',
           [item.bookId], // Wrap in an object if required                                      // raw array of ints 
          {
            headers: {
              'Content-Type': 'application/json',          // ensures JSON binding :contentReference[oaicite:5]{index=5}
              Authorization: `Bearer ${token}`
            }
          }
        );
        alert(`Order placed! Code: ${data.claimCode}`);
      } catch (err) {
        console.error(err);
        alert('Error placing order.');
      }
    };
    const placeOrder = async (selectedBooks) => {
      const token = localStorage.getItem('token'); // Ensure the token is stored in localStorage
    
      // If there are no selected books, show an alert and return early
      if (selectedBooks.length === 0) {
        alert('No books selected for the order');
        return;
      }
    
      try {
        const response = await axios.post(
          'http://localhost:5023/api/orders', // Backend API URL
          selectedBooks, // Send the array of book IDs to the backend
          {
            headers: {
              'Content-Type': 'application/json', // Ensure it's JSON
              Authorization: `Bearer ${token}`,   // Send the token for authorization
            }
          }
        );
    
        // Handle success response
        const { orderId, claimCode } = response.data;
        alert(`Order placed successfully! Order ID: ${orderId}, Claim Code: ${claimCode}`);
      } catch (err) {
        // Handle error
        console.error(err);
        if (err.response && err.response.status === 400) {
          alert('Error: One or more books not found.');
        } else if (err.response && err.response.status === 401) {
          alert('Error: User not authenticated.');
        } else {
          alert('An error occurred while placing the order.');
        }
      }
    };
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5023/api/orders/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Log the entire response object to inspect its shape
        console.log('Response:', response);
    
        // Log just the data field to check if it's an array
        console.log('Orders data:', response.data);
    
        // Assuming the response is an array, set orders
        setOrders(response.data); // If response.data is an array, this will work fine
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };
    
    
    useEffect(() => {
      fetchOrders();
    }, []);
    const cancelOrder = async (orderId) => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.put(
          `http://localhost:5023/api/orders/cancel/${orderId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        alert('Order canceled successfully.');
    
        // Directly update the `orders` state to reflect the canceled order
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, isCanceled: true } : order
          )
        );
      } catch (err) {
        console.error('Error canceling order:', err);
        if (err.response) {
          alert(err.response.data); // Shows backend error message
        } else {
          alert('An error occurred while canceling the order.');
        }
      }
    };
    
    

  useEffect(() => {
    fetchCart();
    fetchBooks(); // Fetch available books to display on page load
  }, []);

  if (loading) return <p>Loading your cart...</p>;

  return (
    <div className="cart-page">
      <h2>Your Cart 🛒</h2>
      {cartItems.length === 0 ? (
        <p>No items in your cart.</p>
      ) : (
        <div>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div>
                  <strong>{item.book.title}</strong> <br />
                  Price: ${item.book.discountPrice > 0 ? item.book.discountPrice : item.book.price}
                </div>

                <div className="qty-controls">
                  <button onClick={() => decreaseQty(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item)}>+</button>
                </div>

                <button className="remove-btn" onClick={() => removeFromCart(item.bookId)}>
                  Remove
                </button>

                {/* Single Item Order Button */}
                <button className="order-single-btn" onClick={() => placeSingleOrder(item)}>
                  Order This Item
                </button>
            
      
              </li>
            ))}
          </ul>
          {orders.map((order) => (
  <li key={order.id}>
    Order #{order.id} - Status: {order.isCanceled ? 'Canceled' : 'Active'}
    {!order.isCanceled && (
      <button onClick={() => cancelOrder(order.id)}>Cancel Order</button>
    )}
  </li>
))}

          <h3>Total: ${calculateTotal().toFixed(2)}</h3>

          {/* Order Button for All Items */}
          {/* <button className="order-btn" onClick={placeOrder(selectedBooks)}>
            Place Order for All Items
          </button> */
         < button
  className="order-btn"
  onClick={() => {
    const selectedBooks = cartItems.map(item => item.bookId);
    placeOrder(selectedBooks);
  }}
>
  Place Order for All Items
</button>}

          {/* Show Order Status */}
          {orderStatus && <p className="order-status">{orderStatus}</p>}
        </div>
      )}

      {/* Available Books to Add to Cart */}
      <div className="add-to-cart-section">
        <h3>Available Books</h3>
        <ul className="book-list">
          {books.map((book) => (
            <li key={book.id} className="book-item">
              <img src={`http://localhost:5023${book.imageUrl}`} alt="Book Image" />
              <div>
                <strong>{book.title}</strong> <br />
                Price: ${book.discountPrice > 0 ? book.discountPrice : book.price}
              </div>
              <button onClick={() => addToCart(book.id)} className="add-to-cart-btn">
                Add to Cart
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CartPage;
