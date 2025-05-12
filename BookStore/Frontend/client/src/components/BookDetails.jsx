
import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { FaTruck } from 'react-icons/fa';
import "./BookDetails.css"

const BookDetails = () => {
  const { bookId } = useParams()
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      try {
        // Fetch book details
        const response = await axios.get(`http://localhost:5023/api/books/${bookId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        setBook(response.data)

        // Fetch reviews for this book
        const reviewsResponse = await axios.get(`http://localhost:5023/api/review/book/${bookId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        setReviews(reviewsResponse.data)
      } catch (error) {
        console.error("Failed to fetch book details or reviews:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [bookId])

  const handleAddToCart = async (bookId) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please log in to add items to the cart")
      navigate("/login")
      return
    }
    try {
      await axios.post(
        "http://localhost:5023/api/user/cart/add",
        { bookId, quantity },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      toast.success(`${book.title} has been added to your cart.`)
      navigate("/cart")
    } catch (error) {
      console.error("Failed to add to cart:", error)
      if (error.response && error.response.status === 401) {
        toast.error("Please log in to add books to the cart.")
        navigate("/login")
      } else {
        toast.error("Something went wrong! Please try again later.")
      }
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }
  const increaseQuantity = () => setQuantity(quantity + 1)

  if (loading) return <p className="loading-message">Loading book details...</p>
  if (!book) return <p className="error-message">Book not found.</p>

  return (
    <div className="book-details-container">
      <div className="book-image-section">
        <img src={`http://localhost:5023${book.imageUrl}`} alt={book.title} />
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
        </div>
      </div>

      <div className="book-info-section">
        <div className="book-format">Paper Back</div>
        <h2>{book.title}</h2>
        <p className="book-author">by {book.author}</p>
        <p className="book-format-detail">Format: {book.format}</p>

        <div className="book-rating">
          <span className="star">⭐</span>
          <span className="rating-value">
            {reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 'No'}
          </span>
          <span className="reviews-count">{reviews.length} Review{reviews.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="book-synopsis">
          <h3>Synopsis</h3>
          <p>{book.description || "A guide to self-discovery and inner peace."}</p>
            <p>Stock:{book.stock }</p>
        </div>
           <p>ISBN:{book.isbn }</p>
      </div>

      <div className="purchase-section">
        <div className="purchase-card">
          <h3>Get Estimated Arrival Time</h3>
          <div className="location-info">
            <MdLocationOn style={{ color: 'red', fontSize: '24px' }} />
            <div>
              <p className="location-name">Kathmandu</p>
              <p className="location-address">Kathmandu, Nepal</p>
            </div>
          </div>
          <div className="delivery-info">
            <FaTruck style={{ fontSize: '24px', marginRight: '8px' }} />
            <div>
              <p className="delivery-title">Delivery Within</p>
              <p className="delivery-time">1 to 2 days</p>
            </div>
          </div>
          <div className="price-section">
            <p className="book-price">Rs. {book.price}</p>
            <div className="quantity-selector">
              <button onClick={decreaseQuantity} className="qty-btn">−</button>
              <span className="qty-display">QTY: {quantity}</span>
              <button onClick={increaseQuantity} className="qty-btn">+</button>
            </div>
            <button className="add-to-cart-btn" onClick={() => handleAddToCart(book.id)}>
              ADD TO CART
            </button>
          </div>
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="reviews-section">
          <h3>Customer Reviews</h3>
          <ul className="reviews-list">
            {reviews.map(review => (
              <li key={review.id} className="review-item">
                <div className="review-header">
                  <strong>{review.user.fullName}</strong>
                  <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
                <small className="review-date">{new Date(review.createdAt).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default BookDetails;
