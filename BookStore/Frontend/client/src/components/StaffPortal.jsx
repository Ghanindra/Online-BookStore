import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from 'react-icons/fa';
import "./StaffPortal.css";

const StaffPortal = () => {
  const [orders, setOrders]     = useState([]);
  const [claimCode, setClaimCode] = useState("");
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchOrders = async (code = "") => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const url = code
        ? `http://localhost:5023/api/orders/all?claimCode=${encodeURIComponent(code)}`
        : "http://localhost:5023/api/orders/all";

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // assume API returns JSON like:
      // [ { id: 1, claimCode: "ABC123", finalPrice: 25.5, isCanceled: false, user: { id, fullName, email }, books: [...] }, ... ]
      setOrders(res.data);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };
  const markAsSupplied = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
    
      await axios.patch(
        `http://localhost:5023/api/orders/${orderId}/supply`, 
        {},  // You can pass an empty object or any necessary data
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    
      // Re-fetch orders to update the UI
      fetchOrders(claimCode);
    } catch (err) {
      alert("Failed to mark order as supplied.");
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const onSearch = e => {
    e.preventDefault();
    fetchOrders(claimCode);
  };

  if (loading) return <p className="staff-portal__loading">Loading…</p>;
  if (error)   return <p className="staff-portal__error">{error}</p>;

  return (
    <div className="staff-portal">
      <h1 className="staff-portal__title">All Orders</h1>

      <form className="staff-portal__search-form" onSubmit={onSearch}>
        <input
          className="staff-portal__search-input"
          type="text"
          placeholder="Search by Claim Code…"
          value={claimCode}
          onChange={e => setClaimCode(e.target.value)}
        />
        <button className="staff-portal__search-button" type="submit">  <FaSearch size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /></button>
        <button
          className="staff-portal__clear-button"
          type="button"
          onClick={() => { setClaimCode(""); fetchOrders(); }}
        >
          Clear
        </button>
      </form>

      {orders.length === 0
        ? <p className="staff-portal__no-orders">No orders found.</p>
        : (
          <table className="staff-portal__table">
            <thead className="staff-portal__table-head">
              <tr>
                <th className="staff-portal__table-header">Order ID</th>
                <th className="staff-portal__table-header">Claim Code</th>
                <th className="staff-portal__table-header">Final Price</th>
      
                <th className="staff-portal__table-header">Books</th>
                <th className="staff-portal__table-header">User</th>
                <th className="staff-portal__table-header">Canceled?</th>
                <th className="staff-portal__table-header">Is Supplied</th>
                <th className="staff-portal__table-header">Supplied At</th>

              </tr>
            </thead>
            <tbody className="staff-portal__table-body">
              {orders.map(ord => (
                <tr className="staff-portal__table-row" key={`order-${ord.id}`}>
                  <td className="staff-portal__table-cell">{ord.id}</td>
                  <td className="staff-portal__table-cell staff-portal__claim-code">{ord.claimCode}</td>
                  <td className="staff-portal__table-cell staff-portal__price">${Number(ord.finalPrice).toFixed(2)}</td>
                 
              
 

                  <td className="staff-portal__table-cell">
                    <ul className="staff-portal__book-list">
                      {(ord.books || []).map(book => (
                        <li className="staff-portal__book-item" key={`order-${ord.id}-book-${book.id}`}>
                          <img
                            className="staff-portal__book-image"
                            src={`http://localhost:5023${book.imageUrl}`}
                            alt={book.title}
                          />

                          <span className="staff-portal__book-info">
                            <span className="staff-portal__book-title">{book.title}</span> by 
                            <span className="staff-portal__book-author"> {book.author}</span>
                            <span className="staff-portal__book-price"> (${book.price})</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="staff-portal__table-cell">
                    {ord.user
                      ? (
                        <div className="staff-portal__user-info">
                          <span className="staff-portal__user-name">{ord.user.fullName}</span>
                          <span className="staff-portal__user-email">{ord.user.email}</span>
                        </div>
                      )
                      : <span className="staff-portal__no-user">—</span>
                    }
                  </td>
                  <td className="staff-portal__table-cell">
                    <span className={`staff-portal__status ${ord.isCanceled ? "staff-portal__status--canceled" : "staff-portal__status--active"}`}>
                      {ord.isCanceled ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="staff-portal__table-cell">
  <span className={`staff-portal__status ${ord.isSupplied ? "staff-portal__status--active" : "staff-portal__status--pending"}`}>
    {ord.isSupplied ? "Yes" : "No"}
  </span>
  {!ord.isSupplied && (
    <button
      className="staff-portal__supply-button"
      onClick={() => markAsSupplied(ord.id)}
    >
      Mark as Supplied
    </button>
  )}
</td>
<td className="staff-portal__table-cell">
  {ord.suppliedAt
    ? new Date(ord.suppliedAt).toLocaleString()
    : <span className="staff-portal__no-supply">—</span>}
</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </div>
  );
};

export default StaffPortal;