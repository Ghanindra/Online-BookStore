import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TotalStats = () => {
  const [stats, setStats] = useState({ books: 0, users: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5023/api/admin/stats'); // Customize endpoint
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Dashboard Overview 📊</h2>
      <p><strong>Total Books:</strong> {stats.books}</p>
      <p><strong>Total Users:</strong> {stats.users}</p>
    </div>
  );
};

export default TotalStats;
