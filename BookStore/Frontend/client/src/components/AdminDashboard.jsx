// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function AdminDashboard() {
//   const [books, setBooks] = useState([]);
//   const [newBook, setNewBook] = useState({
//     title: "",
//     price: "",
//     stock: "",
//     isOnSale: false,
//     discountPrice: "",
//     saleStart: "",
//     saleEnd: "",
//     language: "English", // Default language
//   });
//   const [image, setImage] = useState(null);
//   const [selectedBook, setSelectedBook] = useState(null);
//   const [updatedBook, setUpdatedBook] = useState({
//     title: "",
//     price: "",
//     stock: "",
//     isOnSale: false,
//     discountPrice: "",
//     saleStart: "",
//     saleEnd: "",
//     language: "English",
//   });

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   const fetchBooks = async () => {
//     try {
//       const response = await axios.get("http://localhost:5023/api/admin/book");
//       if (Array.isArray(response.data)) {
//         setBooks(response.data);
//       } else {
//         console.error("Expected an array of books, but got:", response.data);
//         setBooks([]);
//       }
//     } catch (error) {
//       console.error("Error fetching books:", error);
//       setBooks([]);
//     }
//   };
  

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewBook((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const handleSubmitAddBook = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     for (const key in newBook) {
//       formData.append(key, newBook[key]);
//     }
//     if (image) formData.append("image", image);

//     try {
//       await axios.post("http://localhost:5023/api/admin/book", formData);
//       fetchBooks();
//       setNewBook({
//         title: "",
//         price: "",
//         stock: "",
//         isOnSale: false,
//         discountPrice: "",
//         saleStart: "",
//         saleEnd: "",
//         language: "English",
//       });
//       setImage(null);
//     } catch (error) {
//       console.error("Error adding book:", error);
//     }
//   };

//   const handleUpdateBook = async (id) => {
//     const updatedData = { ...updatedBook };

//     try {
//       await axios.put(`http://localhost:5023/api/admin/book/${id}`, updatedData);
//       fetchBooks();
//       setSelectedBook(null);
//       setUpdatedBook({
//         title: "",
//         price: "",
//         stock: "",
//         isOnSale: false,
//         discountPrice: "",
//         saleStart: "",
//         saleEnd: "",
//         language: "English",
//       });
//     } catch (error) {
//       console.error("Error updating book:", error);
//     }
//   };

//   const handleDeleteBook = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5023/api/admin/book/${id}`);
//       fetchBooks();
//     } catch (error) {
//       console.error("Error deleting book:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Admin Dashboard</h1>

//       {/* Add Book Form */}
//       <form onSubmit={handleSubmitAddBook} encType="multipart/form-data">
//         <h2>Add New Book</h2>
//         <input
//           type="text"
//           name="title"
//           value={newBook.title}
//           onChange={handleInputChange}
//           placeholder="Title"
//           required
//         />
//         <input
//           type="number"
//           name="price"
//           value={newBook.price}
//           onChange={handleInputChange}
//           placeholder="Price"
//           required
//         />
//         <input
//           type="number"
//           name="stock"
//           value={newBook.stock}
//           onChange={handleInputChange}
//           placeholder="Stock"
//           required
//         />
//         <input
//           type="text"
//           name="language"
//           value={newBook.language}
//           onChange={handleInputChange}
//           placeholder="Language"
//         />
//         <input
//           type="file"
//           name="image"
//           onChange={handleFileChange}
//           required
//         />
//         <button type="submit">Add Book</button>
//       </form>

//       {/* Update Book Form */}
//       {selectedBook && (
//         <div>
//           <h2>Update Book</h2>
//           <input
//             type="text"
//             value={updatedBook.title}
//             onChange={(e) =>
//               setUpdatedBook({ ...updatedBook, title: e.target.value })
//             }
//             placeholder="Title"
//           />
//           <input
//             type="number"
//             value={updatedBook.price}
//             onChange={(e) =>
//               setUpdatedBook({ ...updatedBook, price: e.target.value })
//             }
//             placeholder="Price"
//           />
//           <input
//             type="number"
//             value={updatedBook.stock}
//             onChange={(e) =>
//               setUpdatedBook({ ...updatedBook, stock: e.target.value })
//             }
//             placeholder="Stock"
//           />
//           <input
//             type="text"
//             value={updatedBook.language}
//             onChange={(e) =>
//               setUpdatedBook({ ...updatedBook, language: e.target.value })
//             }
//             placeholder="Language"
//           />
//           <button onClick={() => handleUpdateBook(selectedBook.id)}>
//             Update Book
//           </button>
//         </div>
//       )}

//       {/* Book List */}
//       <h2>Book List</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Title</th>
//             <th>Price</th>
//             <th>Stock</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {books.map((book) => (
//             <tr key={book.id}>
//               <td>{book.title}</td>
//               <td>{book.price}</td>
//               <td>{book.stock}</td>
//               <td>
//                 <button onClick={() => setSelectedBook(book)}>Edit</button>
//                 <button onClick={() => handleDeleteBook(book.id)}>
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default AdminDashboard;


import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TotalStats from './TotalStats';
import AddBook from './AddBook';
import ViewBook from './ViewBook';
import './admin.css'; // You can create your own styles

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "add":
        return <AddBook />;
      case "view":
        return <ViewBook />;
      default:
        // return <TotalStats />;
    }
  };

  return (
    <div className="admin-container">
      <Sidebar setActiveTab={setActiveTab} />
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
