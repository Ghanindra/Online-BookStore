// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const StaffPortal = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const token = localStorage.getItem("token");
//       try {
//         const { data } = await axios.get(
//           "http://localhost:5023/api/orders/all",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setOrders(data);
//       } catch {
//         setError("Failed to load orders");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, []);

//   if (loading) return <div>Loading…</div>;
//   if (error)   return <div style={{ color: "red" }}>{error}</div>;

//   return (
//     <div>
//       <h1>All Users’ Orders</h1>
//       {orders.length === 0 ? (
//         <p>No orders found.</p>
//       ) : (
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Claim Code</th>
//               <th>Final Price</th>
//               <th>Canceled?</th>
//               <th>User</th>
//               <th>Books</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order, orderIdx) => {
//               // use camelCase properties
//               const id      = order.id   ?? orderIdx;
//               const claim   = order.claimCode;
//               const price   = typeof order.finalPrice === "number"
//                                 ? order.finalPrice.toFixed(2)
//                                 : "0.00";
//               const canceled = order.isCanceled;

//               return (
//                 <tr key={`order-${id}`}>
//                   <td>{id}</td>
//                   <td>{claim}</td>
//                   <td>${price}</td>
//                   <td>{canceled ? "Yes" : "No"}</td>
//                   <td>
//                     {order.user
//                       ? `${order.user.fullName} (${order.user.email})`
//                       : "—"}
//                   </td>
//                   <td>
//                     <ul style={{ paddingLeft: 20, margin: 0 }}>
//                       {Array.isArray(order.books) && order.books.length > 0
//                         ? order.books.map((book, bookIdx) => {
//                             const bid    = book.id ?? `${id}-${bookIdx}`;
//                             const bprice = typeof book.price === "number"
//                                              ? book.price.toFixed(2)
//                                              : "0.00";
//                             return (
//                               <li
//                                 key={`order-${id}-book-${bid}`}
//                                 style={{ marginBottom: 4 }}
//                               >
//                                 <img
//                                   src={book.imageUrl}
//                                   alt={book.title}
//                                   width={40}
//                                   style={{
//                                     verticalAlign: "middle",
//                                     marginRight: 8,
//                                   }}
//                                 />
//                                 <strong>{book.title}</strong> by {book.author} — $
//                                 {bprice}
//                               </li>
//                             );
//                           })
//                         : (
//                           <li key={`order-${id}-no-books`}>
//                             No books
//                           </li>
//                         )}
//                     </ul>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default StaffPortal;
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
                <th className="staff-portal__table-header">Canceled?</th>
                <th className="staff-portal__table-header">Books</th>
                <th className="staff-portal__table-header">User</th>
              </tr>
            </thead>
            <tbody className="staff-portal__table-body">
              {orders.map(ord => (
                <tr className="staff-portal__table-row" key={`order-${ord.id}`}>
                  <td className="staff-portal__table-cell">{ord.id}</td>
                  <td className="staff-portal__table-cell staff-portal__claim-code">{ord.claimCode}</td>
                  <td className="staff-portal__table-cell staff-portal__price">${Number(ord.finalPrice).toFixed(2)}</td>
                  <td className="staff-portal__table-cell">
                    <span className={`staff-portal__status ${ord.isCanceled ? "staff-portal__status--canceled" : "staff-portal__status--active"}`}>
                      {ord.isCanceled ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="staff-portal__table-cell">
                    <ul className="staff-portal__book-list">
                      {(ord.books || []).map(book => (
                        <li className="staff-portal__book-item" key={`order-${ord.id}-book-${book.id}`}>
                          <img
                            className="staff-portal__book-image"
                            src={book.imageUrl || "/placeholder.svg"}
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