import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import './EditBook.css';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [bookData, setBookData] = useState({
    title: "",
    price: 0,
    stock: 0,
    isOnSale: false,
    discountPrice: 0,
    saleStart: "",
    saleEnd: "",
    language: "",
    isbn: "",
    genre: "",
    publisher: "",
    description: "",
    format: "",
    isExclusive: false,
    inStock: false,
    isPhysicalAccessAvailable: false,
    imageUrl: "",  // This will store the current image URL or filename
    newImage: null,  // This will store the new image file when the user selects one
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5023/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const b = res.data;
        setBookData({
          title: b.title,
          price: b.price,
          stock: b.stock,
          isOnSale: b.isOnSale,
          discountPrice: b.discountPrice || 0,
          saleStart: b.saleStart?.slice(0, 10) || "",
          saleEnd: b.saleEnd?.slice(0, 10) || "",
          language: b.language || "",
          isbn: b.isbn || "",
          genre: b.genre || "",
          publisher: b.publisher || "",
          description: b.description || "",
          format: b.format || "",
          isExclusive: b.isExclusive || false,
          inStock: b.inStock || false,
          isPhysicalAccessAvailable: b.isPhysicalAccessAvailable || false,
          imageUrl: b.imageUrl || "",  // Current image URL
          newImage: null,  // Initially no new image selected
        });
      })
      .catch(() => toast.error("Failed to load book"));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append form fields to FormData
    for (const key in bookData) {
      if (key === "newImage") {
        // If a new image is selected, append it as a file
        if (bookData.newImage) {
          formData.append("image", bookData.newImage);  // Key should match the backend's expected field name for image
        }
      } else if (key !== "imageUrl") {
        // Don't send imageUrl as it's handled separately
        formData.append(key, bookData[key]);
      }
    }

    try {
      await axios.put(`http://localhost:5023/api/admin/book/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',  // Ensure that Content-Type is set to multipart/form-data
        },
      });

      toast.success("Book updated successfully ✅");
      navigate("/admindashboard");
    } catch (err) {
      console.error(err); // Log the error to understand the exact issue
      toast.error("Failed to update book ❌");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file); // Debugging line
      setBookData((prev) => ({
        ...prev,
        newImage: file, // Now storing the selected file
      }));
    }
};


  return (
    <form className="edit-form" onSubmit={handleSubmit}>
      <h2>✏️ Edit Book</h2>
      <input
        name="title"
        value={bookData.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <input
        name="price"
        type="number"
        value={bookData.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />
      <input
        name="stock"
        type="number"
        value={bookData.stock}
        onChange={handleChange}
        placeholder="Stock"
        required
      />
      <label>
        <input
          name="isOnSale"
          type="checkbox"
          checked={bookData.isOnSale}
          onChange={handleChange}
        />{" "}
        On Sale
      </label>
      {bookData.isOnSale && (
        <>
          <input
            name="discountPrice"
            type="number"
            value={bookData.discountPrice}
            onChange={handleChange}
            placeholder="Discount Price"
          />
          <input
            name="saleStart"
            type="date"
            value={bookData.saleStart}
            onChange={handleChange}
          />
          <input
            name="saleEnd"
            type="date"
            value={bookData.saleEnd}
            onChange={handleChange}
          />
        </>
      )}
      <input
        name="language"
        value={bookData.language}
        onChange={handleChange}
        placeholder="Language"
      />
      <input
        name="isbn"
        value={bookData.isbn}
        onChange={handleChange}
        placeholder="ISBN"
      />
      <input
        name="genre"
        value={bookData.genre}
        onChange={handleChange}
        placeholder="Genre"
      />
      <input
        name="publisher"
        value={bookData.publisher}
        onChange={handleChange}
        placeholder="Publisher"
      />
      <textarea
        name="description"
        value={bookData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        name="format"
        value={bookData.format}
        onChange={handleChange}
        placeholder="Format"
      />
      <label>
        <input
          name="isExclusive"
          type="checkbox"
          checked={bookData.isExclusive}
          onChange={handleChange}
        />{" "}
        Exclusive
      </label>
      <label>
        <input
          name="inStock"
          type="checkbox"
          checked={bookData.inStock}
          onChange={handleChange}
        />{" "}
        In Stock
      </label>
      <label>
        <input
          name="isPhysicalAccessAvailable"
          type="checkbox"
          checked={bookData.isPhysicalAccessAvailable}
          onChange={handleChange}
        />{" "}
        Physical Access
      </label>

      <label>
        Upload Book Image:
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>

      {/* Show either a preview or existing image filename */}
      {bookData.imageUrl && !(bookData.imageUrl instanceof File) && (
        <div style={{ marginTop: "10px" }}>
          <p>📸 Current Image:</p>
          <img
            src={bookData.imageUrl}
            alt="Book Preview"
            style={{ maxWidth: "200px", height: "auto", border: "1px solid #ccc" }}
          />
          <p style={{ color: 'gray', fontStyle: 'italic' }}>
            {bookData.imageUrl.split('/').pop()}
          </p>
        </div>
      )}

      {bookData.newImage && (
        <p style={{ color: 'green', fontStyle: 'italic' }}>
          Selected file: {bookData.newImage.name}
        </p>
      )}

      <button type="submit">Update Book</button>
    </form>
  );
};

export default EditBook;
