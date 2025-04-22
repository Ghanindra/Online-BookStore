import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For redirect

  const fetchCart = async () => {
    try {
      const response = await axios.get('http://localhost:5023/api/user/cart', {
        withCredentials: true,
      });
      setCartItems(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/register'); // 🔁 redirect to register if not logged in
      } else {
        console.error('Error fetching cart:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5023/api/user/cart/remove?bookId=${bookId}`, {
        withCredentials: true,
      });
      fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const updateQty = async (bookId, quantity) => {
    try {
      await axios.post(
        'http://localhost:5023/api/user/cart/add',
        { bookId, quantity },
        { withCredentials: true }
      );
      fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const increaseQty = (item) => updateQty(item.bookId, 1);
  const decreaseQty = (item) =>
    item.quantity > 1 ? updateQty(item.bookId, -1) : removeFromCart(item.bookId);

  const calculateTotal = () =>
    cartItems.reduce((total, item) => {
      const price = item.book.discountPrice > 0 ? item.book.discountPrice : item.book.price;
      return total + price * item.quantity;
    }, 0);

  useEffect(() => {
    fetchCart();
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

                <button className="remove-btn" onClick={() => removeFromCart(item.bookId)}>Remove</button>
              </li>
            ))}
          </ul>

          <h3>Total: ${calculateTotal().toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
};

export default CartPage;
