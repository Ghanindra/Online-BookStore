
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TotalStats from './TotalStats';
import AddBook from './AddBook';
import ViewBook from './ViewBook';
import CreateBanner from './CreateBanner';
import { HubConnectionBuilder } from '@microsoft/signalr';

import './admin.css'; // You can create your own styles

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notifications, setNotifications] = useState([]); // State to store notifications

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl('http://localhost:5023/notificationHub')
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      console.log('Connected to SignalR hub');

      connection.on('ReceiveNotification', (message) => {
        console.log(`Notification received: ${message}`); // Log notification in console
        setNotifications((prev) => [...prev, message]); // Add notification to state
      });
    }).catch((error) => console.error('SignalR Connection Error:', error));

    return () => {
      connection.stop();
    };
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "add":
        return <AddBook />;
      case "view":
        return <ViewBook />;
      case "banner":
        return <CreateBanner />;
      default:
        return <TotalStats />;
    }
  };

  return (
    <div className="admin-container">
      <Sidebar setActiveTab={setActiveTab} />
      <div className="admin-content">
        {renderContent()}

        {/* Notifications Section */}
        <div className="notifications-section">
          <h2>Notifications</h2>
          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>{notification}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;