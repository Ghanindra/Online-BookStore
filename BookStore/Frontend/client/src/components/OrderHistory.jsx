// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

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
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">🛒 Order History</h2>

//       {error && <p className="text-red-500">{error}</p>}

//       {orders.length === 0 ? (
//         <p>No orders found.</p>
//       ) : (
//         <div className="space-y-4">
//           {/* {orders.map(order => (
//             <div key={order.id} className="border p-4 rounded-lg shadow-md">
//               <p><strong>Order ID:</strong> {order.id}</p>
//               <p><strong>Claim Code:</strong> {order.claimCode}</p>
//               <p><strong>Final Price:</strong> ${order.finalPrice}</p>
//               <p><strong>Status:</strong> {order.isCanceled ? '❌ Canceled' : '✅ Active'}</p>
//               <p><strong>Books:</strong> {order.bookTitles.join(', ')}</p>
//             </div>
//           ))} */}
//           {orders.map(order => (
//   <div key={order.id} className="order-card">
//     <h3>Order #{order.id} - Claim Code: {order.claimCode}</h3>
//     <p>Status: {order.isCanceled ? "Canceled" : "Completed"}</p>
//     <p>Total: ${order.finalPrice.toFixed(2)}</p>

//     <h4>Books:</h4>
//     <ul>
//       {order.books.map(book => (
//         <li key={book.id}>
//           <strong>{book.title}</strong> by {book.author} - ${book.price.toFixed(2)}
//           {book.imageUrl && <img src={book.imageUrl} alt={book.title} style={{ width: '100px' }} />}
//         </li>
//       ))}
//     </ul>
//   </div>
// ))}

//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderHistory;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')

    if (!token) {
      setError('User not authenticated.');
      return;
    }

    axios.get(`http://localhost:5023/api/orders/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setOrders(res.data);
      })
      .catch(err => {
        setError(err.response?.data || 'Failed to fetch order history.');
      });
  }, []);

  return (
    <div className="order-history">
      <h2 className="order-history__title">🛒 Order History</h2>

      {error && <p className="order-history__error">{error}</p>}

      {orders.length === 0 ? (
        <p className="order-history__empty">No orders found.</p>
      ) : (
        <div className="order-history__list">
          {orders.map(order => (
            <div key={order.id} className="order-history__card">
              <h3 className="order-history__card-title">Order #{order.id} - Claim Code: {order.claimCode}</h3>
              <p className="order-history__status">
                Status: <span className={`order-history__status-badge ${order.isCanceled ? "order-history__status-badge--canceled" : "order-history__status-badge--completed"}`}>
                  {order.isCanceled ? "Canceled" : "Completed"}
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
                    </div>
                    {book.imageUrl && 
                      <img 
                        src={book.imageUrl || "/placeholder.svg"} 
                        alt={book.title} 
                        className="order-history__book-image" 
                      />
                    }
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