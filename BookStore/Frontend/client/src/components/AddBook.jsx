


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import './AddBook.css'

const AddBook = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    author: '',
    genre: '',
    publicationDate:'',
    language: 'English',
    publisher: '',
    description: '',
    price: '',
    stock: '',
    format: '',
    isExclusive: false,
    isOnSale: false,
    discountPrice: '',
    hasAwards: false,
    inStock: true,
    isPhysicalAccessAvailable: true,
    saleStart: '',
    saleEnd: ''
  });

  const [imageFile, setImageFile] = useState(null);

  // Handle input change for text/number/checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();

  // Convert datetime-local fields to UTC
  const utcFormData = { ...formData };
  if (formData.publicationDate) {
    utcFormData.publicationDate = new Date(formData.publicationDate).toISOString();
  }
  if (formData.saleStart) {
    utcFormData.saleStart = new Date(formData.saleStart).toISOString();
  }
  if (formData.saleEnd) {
    utcFormData.saleEnd = new Date(formData.saleEnd).toISOString();
  }

  for (let key in utcFormData) {
    if (utcFormData[key] !== null && utcFormData[key] !== '') {
      data.append(key, utcFormData[key]);
    }
  }

  if (imageFile) {
    data.append("image", imageFile);
  }

  try {
    const token = localStorage.getItem('token');
    console.log("FormData being sent:", [...data.entries()]);

    const res = await axios.post("http://localhost:5023/api/admin/book", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Book submitted:", res.data);
    alert("Book submitted successfully!");
    navigate('/admindashboard');
  } catch (err) {
    console.error("Submission error:", err.response?.data || err.message);
    alert("Error submitting book.");
  }
};
  return (
    <form className="add-book" onSubmit={handleSubmit} encType="multipart/form-data">
      <h2 className="add-book__title">Add Book</h2>

      <input className="add-book__input add-book__input--title" name="title" type="text" onChange={handleChange} placeholder="Title" required />
      <input className="add-book__input add-book__input--isbn" name="isbn" type="text" onChange={handleChange} placeholder="ISBN" required />
      <input className="add-book__input add-book__input--author" name="author" type="text" onChange={handleChange} placeholder="Author" />
      <input className="add-book__input add-book__input--genre" name="genre" type="text" onChange={handleChange} placeholder="Genre" />
      <label className="add-book__label">Publication Date</label>
      <input className="add-book__input add-book__input--date" name="publicationDate" type="datetime-local" onChange={handleChange} />
      <input className="add-book__input add-book__input--language" name="language" type="text" onChange={handleChange} placeholder="Language" />
      <input className="add-book__input add-book__input--publisher" name="publisher" type="text" onChange={handleChange} placeholder="Publisher" />
      <textarea className="add-book__textarea" name="description" onChange={handleChange} placeholder="Description"></textarea>
      <input className="add-book__input add-book__input--price" name="price" type="number" step="0.01" onChange={handleChange} placeholder="Price" />
      <input className="add-book__input add-book__input--stock" name="stock" type="number" onChange={handleChange} placeholder="Stock" />
      <input className="add-book__input add-book__input--format" name="format" type="text" onChange={handleChange} placeholder="Format" />

      <label className="add-book__checkbox-label">
        <input className="add-book__checkbox" name="isExclusive" type="checkbox" onChange={handleChange} />
        <span className="add-book__checkbox-text">Is Exclusive</span>
      </label>

      <label className="add-book__checkbox-label">
        <input className="add-book__checkbox" name="isOnSale" type="checkbox" onChange={handleChange} />
        <span className="add-book__checkbox-text">Is On Sale</span>
      </label>

      <input className="add-book__input add-book__input--discount" name="discountPrice" type="number" step="0.01" onChange={handleChange} placeholder="Discount Price" />

      <label className="add-book__checkbox-label">
        <input className="add-book__checkbox" name="hasAwards" type="checkbox" onChange={handleChange} />
        <span className="add-book__checkbox-text">Has Awards</span>
      </label>

      <label className="add-book__checkbox-label">
        <input className="add-book__checkbox" name="inStock" type="checkbox" defaultChecked onChange={handleChange} />
        <span className="add-book__checkbox-text">In Stock</span>
      </label>

      <label className="add-book__checkbox-label">
        <input className="add-book__checkbox" name="isPhysicalAccessAvailable" type="checkbox" defaultChecked onChange={handleChange} />
        <span className="add-book__checkbox-text">Physical Access</span>
      </label>

      <label className="add-book__label">Sale Start</label>
      <input className="add-book__input add-book__input--date" name="saleStart" type="datetime-local" onChange={handleChange} />
      <label className="add-book__label">Sale End</label>
      <input className="add-book__input add-book__input--date" name="saleEnd" type="datetime-local" onChange={handleChange} />

      <label className="add-book__label">Book Image</label>
      <input className="add-book__file" type="file" accept="image/*" onChange={handleFileChange} required />

      <button className="add-book__submit" type="submit">Submit Book</button>
    </form>
  );
};

export default AddBook;