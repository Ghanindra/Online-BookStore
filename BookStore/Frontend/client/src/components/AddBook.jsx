import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddBook.css';

const AddBook = () => {
  const [book, setBook] = useState({
    title: '',
    isbn: '',
    author: '',
    genre: '',
    language: '',
    publisher: '',
    description: '',
    price: 0,
    stock: 0,
    format: '',
    publicationDate: '',
    isExclusive: false,
    isOnSale: false,
    discountPrice: '',
    saleStart: '',
    saleEnd: '',
    hasAwards: false,
    inStock: true,
    isPhysicalAccessAvailable: true,
    imageUrl: ''
  });

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === 'image') {
      setImageFile(files[0]);
      console.log("✅ Image file selected:", files[0]);
    } else {
      const updatedValue = type === 'checkbox' ? checked : value;
      setBook((prevBook) => {
        const updatedBook = { ...prevBook, [name]: updatedValue };
        console.log(`📌 Field changed: ${name} =`, updatedValue);
        return updatedBook;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    console.log("🔐 Token:", token);

    try {
      const formData = new FormData();

      // Append all non-empty fields
      Object.entries(book).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Add fixed/required fields
      formData.set('price', parseFloat(book.price));
      formData.set('stock', parseInt(book.stock));
      if (book.discountPrice) {
        formData.set('discountPrice', parseFloat(book.discountPrice));
      }
      formData.set('createdAt', new Date().toISOString());
      formData.set('salesCount', 0);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      // ✅ Log final FormData before sending
      console.log("📦 FormData being sent:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      // Send data
      const res = await axios.post("http://localhost:5023/api/admin/book", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success("✅ Book added successfully!");
      console.log("📚 Server Response:", res.data);

      // Reset form
      setBook({
        title: '', isbn: '', author: '', genre: '', language: '', publisher: '', description: '',
        price: 0, stock: 0, format: '', publicationDate: '', isExclusive: false, isOnSale: false,
        discountPrice: '', saleStart: '', saleEnd: '', hasAwards: false, inStock: true,
        isPhysicalAccessAvailable: true, imageUrl: ''
      });
      setImageFile(null);

    } catch (err) {
      toast.error("❌ Failed to add book");
      console.error("❌ Error while adding book:", err);

      if (err.response) {
        console.error("🛑 Backend Response:", err.response.data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-book-form">
      <h2>Add New Book 📚</h2>
      <input type="text" name="title" value={book.title} onChange={handleChange} placeholder="Title" required />
      <input type="text" name="isbn" value={book.isbn} onChange={handleChange} placeholder="ISBN" />
      <input type="text" name="author" value={book.author} onChange={handleChange} placeholder="Author" />
      <input type="text" name="genre" value={book.genre} onChange={handleChange} placeholder="Genre" />
      <input type="text" name="language" value={book.language} onChange={handleChange} placeholder="Language" />
      <input type="text" name="publisher" value={book.publisher} onChange={handleChange} placeholder="Publisher" />
      <textarea name="description" value={book.description} onChange={handleChange} placeholder="Description" />
      <input type="number" name="price" value={book.price} onChange={handleChange} placeholder="Price" />
      <input type="number" name="stock" value={book.stock} onChange={handleChange} placeholder="Stock" />
      <input type="text" name="format" value={book.format} onChange={handleChange} placeholder="Format" />
      <input type="date" name="publicationDate" value={book.publicationDate} onChange={handleChange} />
      <label><input type="checkbox" name="isExclusive" checked={book.isExclusive} onChange={handleChange} /> Is Exclusive</label>
      <label><input type="checkbox" name="isOnSale" checked={book.isOnSale} onChange={handleChange} /> Is On Sale</label>
      <input type="number" name="discountPrice" value={book.discountPrice} onChange={handleChange} placeholder="Discount Price" />
      <input type="date" name="saleStart" value={book.saleStart} onChange={handleChange} placeholder="Sale Start" />
      <input type="date" name="saleEnd" value={book.saleEnd} onChange={handleChange} placeholder="Sale End" />
      <label><input type="checkbox" name="hasAwards" checked={book.hasAwards} onChange={handleChange} /> Has Awards</label>
      <label><input type="checkbox" name="inStock" checked={book.inStock} onChange={handleChange} /> In Stock</label>
      <label><input type="checkbox" name="isPhysicalAccessAvailable" checked={book.isPhysicalAccessAvailable} onChange={handleChange} /> Physical Access Available</label>
      <input type="file" name="image" accept="image/*" onChange={handleChange} />
      {imageFile && <p>Selected: {imageFile.name}</p>}
      <button type="submit">Add Book</button>
    </form>
  );
};

export default AddBook;
