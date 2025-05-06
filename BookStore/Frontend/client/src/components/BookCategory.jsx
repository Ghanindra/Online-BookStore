// // src/components/BookCategory.js
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const BookCategory = () => {
//   const { category } = useParams();
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCategoryBooks = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5023/api/books/filter?category=${category}`);
//         setBooks(res.data);
//       } catch (err) {
//         console.error("Failed to fetch books:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategoryBooks();
//   }, [category]);

//   if (loading) return <p>Loading books...</p>;

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Books: {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
//       {books.length === 0 ? (
//         <p>No books found in this category.</p>
//       ) : (
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
//           {books.map((book) => (
//             <div key={book.id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
//               <h3>{book.title}</h3>
//               <p><strong>Author:</strong> {book.author}</p>
//               <p><strong>Price:</strong> ${book.price}</p>
//               <p><strong>Genre:</strong> {book.genre}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookCategory;


// src/components/BookCategory.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const BookCategory = () => {
  const { category } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryBooks = async () => {
      try {
        const res = await axios.get(`http://localhost:5023/api/books/filter?category=${category}`);
        setBooks(res.data);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryBooks();
  }, [category]);

  if (loading) return <p>Loading books...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Books: {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
      {books.length === 0 ? (
        <p>No books found in this category.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {books.map((book) => (
            <Link to={`/book/${book.id}`} key={book.id} style={{ textDecoration: 'none' }}>
              <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
              <img src={`http://localhost:5023${book.imageUrl}`} alt={book.title} />
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Price:</strong> ${book.price}</p>
                <p><strong>Genre:</strong> {book.genre}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookCategory;
