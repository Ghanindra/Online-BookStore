import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateBanner.css';

const CreateBanner = () => {
  const [banner, setBanner] = useState({
    message: '',
    startTime: '',
    endTime: '',
    isActive: true,
  });
  const [banners, setBanners] = useState([]); // State to store all banners
  const [editingBannerId, setEditingBannerId] = useState(null); // State to track editing

  const fetchBanners = async () => {
    const token= localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5023/api/admin/banners', {
          headers: { Authorization: `Bearer ${token}` }
        });
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBanner((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (editingBannerId) {
        // Update existing banner
        await axios.put(
          `http://localhost:5023/api/admin/banner/${editingBannerId}`,
          {
            ...banner,
            startTime: new Date(banner.startTime).toISOString(),
            endTime: new Date(banner.endTime).toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        alert('Banner updated successfully!');
      } else {
        // Create new banner
        await axios.post(
          'http://localhost:5023/api/admin/banner',
          {
            ...banner,
            startTime: new Date(banner.startTime).toISOString(),
            endTime: new Date(banner.endTime).toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        alert('Banner created successfully!');
      }

      setBanner({ message: '', startTime: '', endTime: '', isActive: true });
      setEditingBannerId(null);
      fetchBanners();
    } catch (error) {
      console.error(error);
      alert('Failed to save banner.');
    }
  };

  const handleEdit = (banner) => {
    setBanner({
      message: banner.message,
      startTime: new Date(banner.startTime).toISOString().slice(0, 16), // Format for datetime-local
      endTime: new Date(banner.endTime).toISOString().slice(0, 16), // Format for datetime-local
      isActive: banner.isActive,
    });
    setEditingBannerId(banner.id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5023/api/admin/banner/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Banner deleted successfully!');
      fetchBanners();
    } catch (error) {
      console.error(error);
      alert('Failed to delete banner.');
    }
  };

  return (
    <div className="create-banner">
      <h2>{editingBannerId ? 'Edit Banner' : 'Create New Banner'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="message"
          placeholder="Banner Message"
          value={banner.message}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="startTime"
          value={banner.startTime}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="endTime"
          value={banner.endTime}
          onChange={handleChange}
          required
        />
        <label>
          <input
            type="checkbox"
            name="isActive"
            checked={banner.isActive}
            onChange={handleChange}
          />
          Active
        </label>
        <button type="submit">{editingBannerId ? 'Update Banner' : 'Create Banner'}</button>
      </form>

      <h2>Existing Banners</h2>
      <div className="banner-list">
        {banners.map((b) => (
          <div key={b.id} className="banner-item">
            <p><strong>Message:</strong> {b.message}</p>
            <p><strong>Start Time:</strong> {new Date(b.startTime).toLocaleString()}</p>
            <p><strong>End Time:</strong> {new Date(b.endTime).toLocaleString()}</p>
            <p><strong>Active:</strong> {b.isActive ? 'Yes' : 'No'}</p>
            <button onClick={() => handleEdit(b)}>Edit</button>
            <button onClick={() => handleDelete(b.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateBanner;