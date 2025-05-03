import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Book.css';

const Book = () => {
  const [books, setBooks] = useState([]);
  const location = useLocation();

  // Extract query parameters for title, description, and ISBN
  const params = new URLSearchParams(location.search);
  const title = params.get("title");
  const description = params.get("description");
  const isbn = params.get("isbn");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`http://localhost:5023/api/books`, {
          params: {
            title: title,
            description: description,
            isbn: isbn
          }
        });

        console.log('Response:', response);

        // Check if the response is an array and update the state
        if (Array.isArray(response.data)) {
          setBooks(response.data);
        } else {
          console.error('Expected an array, but received:', response.data);
          setBooks([]); // Handle unexpected response format
        }
      } catch (err) {
        console.error('Error fetching books:', err);
        setBooks([]); // Handle errors gracefully
      }
    };

    // Call the fetchBooks function when any of the query params change
    fetchBooks();
  }, [title, description, isbn]); // Dependency array includes title, description, and ISBN

  return (
    <div className="search-results-container">
      <h2 className="search-results-title">Search Results</h2>
      {books.length > 0 ? (
        books.map((book) => (
          <div key={book.id} className="book-result-card">
            <h4 className="book-title">{book.title}</h4>
            <p className="book-author">Author: {book.author}</p>
            <p className="book-isbn">ISBN: {book.isbn}</p> {/* Display ISBN */}
            <p className="book-description">{book.description}</p> {/* Display Description */}
            <p className="book-price">Price: ${book.price}</p>
            <p className="book-genre">Genre: {book.genre}</p>
          </div>
        ))
      ) : (
        <p>No books found.</p>
      )}
    </div>
  );
};

export default Book;
