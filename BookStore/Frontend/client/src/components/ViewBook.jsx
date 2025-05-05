import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './ViewBook.css';

const ViewBook = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get('http://localhost:5023/api/books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(res.data);
    } catch (err) {
      toast.error('Failed to fetch books ❌');
    }
  };
  

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
  
    const token = localStorage.getItem("token");
  
    try {
      await axios.delete(`http://localhost:5023/api/admin/book/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Book deleted successfully ✅');
      fetchBooks(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data || 'Failed to delete book ❌');
    }
  };
  

  const handleEdit = (bookId) => {
    navigate(`/admin/edit-book/${bookId}`);
  };

  return (
    <div className="book-list-container">
      <h2>📚 All Books</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Price ($)</th>
            <th>Stock</th>
            <th>On Sale</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.price}</td>
              <td>{book.stock}</td>
              <td>{book.isOnSale ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleEdit(book.id)}>✏️ Edit</button>
                <button onClick={() => handleDelete(book.id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewBook;
