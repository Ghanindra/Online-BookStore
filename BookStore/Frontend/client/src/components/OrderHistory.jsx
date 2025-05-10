
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './OrderHistory.css';

// const OrderHistory = () => {
//   const [orders, setOrders] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')

//     if (!token) {
//       setError('User not authenticated.');
//       return;
//     }

//     axios.get(`http://localhost:5023/api/orders/user`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//       .then(res => {
//         setOrders(res.data);
//       })
//       .catch(err => {
//         setError(err.response?.data || 'Failed to fetch order history.');
//       });
//   }, []);

//   return (
//     <div className="order-history">
//       <h2 className="order-history__title">🛒 Order History</h2>

//       {error && <p className="order-history__error">{error}</p>}

//       {orders.length === 0 ? (
//         <p className="order-history__empty">No orders found.</p>
//       ) : (
//         <div className="order-history__list">
//           {orders.map(order => (
//             <div key={order.id} className="order-history__card">
//               <h3 className="order-history__card-title">Order #{order.id} - Claim Code: {order.claimCode}</h3>
//               <p className="order-history__status">
//                 Status: <span className={`order-history__status-badge ${order.isCanceled ? "order-history__status-badge--canceled" : "order-history__status-badge--completed"}`}>
//                   {order.isCanceled ? "Canceled" : "Completed"}
//                 </span>
//               </p>
//               <p className="order-history__price">Total: ${order.finalPrice.toFixed(2)}</p>

//               <h4 className="order-history__books-title">Books:</h4>
//               <ul className="order-history__books-list">
//                 {order.books.map(book => (
//                   <li key={book.id} className="order-history__book-item">
//                     <div className="order-history__book-info">
//                       <strong className="order-history__book-title">{book.title}</strong>
//                       <span className="order-history__book-author">by {book.author}</span>
//                       <span className="order-history__book-price">${book.price.toFixed(2)}</span>
//                     </div>
//                     {book.imageUrl && 
//                       <img 
//                         src={book.imageUrl || "/placeholder.svg"} 
//                         alt={book.title} 
//                         className="order-history__book-image" 
//                       />
//                     }
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderHistory;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [reviewData, setReviewData] = useState({});
  const [activeBookId, setActiveBookId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('User not authenticated.');
      return;
    }

    axios.get(`http://localhost:5023/api/orders/user`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setOrders(res.data))
    .catch(err => setError(err.response?.data || 'Failed to fetch order history.'));
  }, []);

  const openReviewForm = (bookId) => {
    setActiveBookId(bookId);
    setReviewData({ rating: 5, comment: '' });
    setSuccessMessage('');
  };

  const submitReview = async (bookId) => {
    // Client-side validation
    if (!reviewData.comment || reviewData.comment.trim() === '') {
      setError('Comment cannot be empty.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      setError('');
      // Ensure rating is a number
      const payload = {
        bookId,
        rating: parseInt(reviewData.rating, 10),
        comment: reviewData.comment.trim()
      };
      console.log('Submitting review payload:', payload);
      await axios.post(
        `http://localhost:5023/api/review`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage('Review submitted successfully!');
      toast.success("Review Successful")
      setActiveBookId(null);
    } catch (err) {
      console.error('Review submission error:', err.response?.data);
      // Parse and display server validation errors
      const serverError = err.response?.data;
      if (serverError?.errors) {
        const fieldErrors = Object.values(serverError.errors).flat();
        setError(fieldErrors.join(' '));
      } else if (typeof serverError === 'string') {
        setError(serverError);
      } else {
        setError('Failed to submit review.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="order-history">
      <h2 className="order-history__title">🛒 Order History</h2>

      {error && <p className="order-history__error">{error}</p>}
      {successMessage && <p className="order-history__success">{successMessage}</p>}

      {orders.length === 0 ? (
        <p className="order-history__empty">No orders found.</p>
      ) : (
        <div className="order-history__list">
          {orders.map(order => (
            <div key={order.id} className="order-history__card">
              <h3 className="order-history__card-title">
                Order #{order.id} - Claim Code: {order.claimCode}
              </h3>
              <p className="order-history__status">
                Status: <span className={`order-history__status-badge ${order.isCanceled ? 'order-history__status-badge--canceled' : 'order-history__status-badge--completed'}`}>
                  {order.isCanceled ? 'Canceled' : 'Completed'}
                </span>
              </p>
              <p className="order-history__price">Total: ${order.finalPrice.toFixed(2)}</p>

              <h4 className="order-history__books-title">Books:</h4>
              <ul className="order-history__books-list">
                {order.books.map(book => (
                  <li key={book.id} className="order-history__book-item">
                    <div className="order-history__book-info">
                      <strong className="order-history__book-title">{book.title}</strong>
                      <span className="order-history__book-author">by {book.author}</span>
                      <span className="order-history__book-price">${book.price.toFixed(2)}</span>
                      <button
                        className="order-history__review-button"
                        onClick={() => openReviewForm(book.id)}
                      >
                        📝 Review
                      </button>
                    </div>

                    {activeBookId === book.id && (
                      <div className="order-history__review-form">
                        <label>
                          Rating:
                          <select
                            name="rating"
                            value={reviewData.rating}
                            onChange={handleInputChange}
                          >
                            {[1,2,3,4,5].map(n => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Comment:
                          <textarea
                            name="comment"
                            value={reviewData.comment}
                            onChange={handleInputChange}
                            placeholder="Write your review..."
                          />
                        </label>
                        <div className="order-history__review-actions">
                          <button onClick={() => submitReview(book.id)}>
                            Submit
                          </button>
                          <button onClick={() => setActiveBookId(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {book.imageUrl && (
                      <img
                        src={book.imageUrl}
                        alt={book.title}
                        className="order-history__book-image"
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
