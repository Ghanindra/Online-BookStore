import React from 'react';

const Sidebar = ({ setActiveTab }) => {
  return (
    <div className="sidebar">
      <h2>Admin Menu</h2>
      <ul>
        <li onClick={() => setActiveTab("dashboard")}>Dashboard</li>
        <li onClick={() => setActiveTab("add")}>Add Book</li>
        <li onClick={() => setActiveTab("view")}>View Books</li>
  
        <li onClick={() => setActiveTab("banner")}>Create Banner</li>


      </ul>
    </div>
  );
};

export default Sidebar;
