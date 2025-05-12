import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TotalStats = () => {
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    // Fetch total books
    const fetchTotalBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5023/api/books/count');
        setTotalBooks(response.data);
      } catch (error) {
        console.error('Error fetching total books:', error);
      }
    };

    // Fetch total users
const fetchTotalUsers = async () => {
  try {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    const response = await axios.get('http://localhost:5023/api/user/count', {
      headers: { Authorization: `Bearer ${token}` }, // Include the token in the Authorization header
    });
    setTotalUsers(response.data);
  } catch (error) {
    console.error('Error fetching total users:', error);
  }
};
    // Fetch total orders
    const fetchTotalOrders = async () => {
      try {
           const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:5023/api/orders/count',{
      headers: { Authorization: `Bearer ${token}` }, // Include the token in the Authorization header
    });
        setTotalOrders(response.data);
      } catch (error) {
        console.error('Error fetching total orders:', error);
      }
    };

    fetchTotalBooks();
    fetchTotalUsers();
    fetchTotalOrders();
  }, []);

  return (
    <div className="total-stats">
      <h2>Dashboard Overview</h2>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Books</h3>
          <p>{totalBooks}</p>
        </div>
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>
      </div>
    </div>
  );
};

export default TotalStats;