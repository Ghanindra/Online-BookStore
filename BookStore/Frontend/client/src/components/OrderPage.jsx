// OrderPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5023/api';

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');

  // 1. Place an order (backend will handle email)
  const placeOrder = async (bookIds) => {
    try {
      const { data } = await axios.post(`${API}/orders`, bookIds);  // :contentReference[oaicite:0]{index=0}
      setStatus(`Order #${data.orderId} placed! Claim: ${data.claimCode}`);
      fetchOrders();
    } catch {
      setStatus('Error placing order.'); 
    }
  };

  // 2. Fetch existing orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/orders`);
      setOrders(data);
    } catch {
      console.error('Fetch orders failed');
    }
  };

  // 3. Cancel an order
  const cancelOrder = async (id) => {
    try {
      await axios.put(`${API}/orders/cancel/${id}`);  // :contentReference[oaicite:1]{index=1}
      setStatus(`Order #${id} canceled.`);
      fetchOrders();
    } catch {
      setStatus('Error canceling order.');
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div>
      <h2>Orders</h2>
      {status && <p>{status}</p>}

      <button onClick={() => placeOrder([1,2,3])}>
        Place Order for Books [1,2,3]
      </button>

      <ul>
        {orders.map(o => (
          <li key={o.id}>
            #{o.id} – {o.claimCode}
            {!o.isCanceled && (
              <button onClick={() => cancelOrder(o.id)}>
                Cancel
              </button>
            )}
            {o.isCanceled && ' (Canceled)'}
          </li>
        ))}
      </ul>
    </div>
  );
}
