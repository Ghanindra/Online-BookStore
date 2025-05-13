// src/pages/Bookmarks.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Bookmarks.css'; // You can create and style this file
import { useNavigate ,useParams} from 'react-router-dom';
const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not authenticated.');
      return;
    }

    axios.get('http://localhost:5023/api/user/bookmarks', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setBookmarks(res.data))
    .catch(err => {
      setError(err.response?.data || 'Failed to fetch bookmarks.');
    });
  }, []);
 // Navigate to book details
  
    const viewBookDetails = (bookId) => {
      navigate(`/book/${bookId}`); // Navigate to the BookDetails page with the bookId
    };

  return (
    <div className="bookmarks" >
      <h2 className="bookmarks__title"> My Bookmarked Books</h2>

      {error && <p className="bookmarks__error">{error}</p>}

      {bookmarks.length === 0 ? (
        <p className="bookmarks__empty">No bookmarks found.</p>
      ) : (
        <ul className="bookmarks__list">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id} className="bookmarks__item">
              <div className="bookmarks__book-info" onClick={() => viewBookDetails(bookmark.bookId)}>
                <strong className="bookmarks__book-title">{bookmark.book.title}</strong>
                <span className="bookmarks__book-author">by {bookmark.book.author}</span>
                <span className="bookmarks__book-price">${bookmark.book.price.toFixed(2)}</span>
              </div>
              {bookmark.book.imageUrl && (
                <img
                  src={`http://localhost:5023${bookmark.book.imageUrl}`}
                  alt={bookmark.book.title}
                  className="bookmarks__book-image"
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bookmarks;
