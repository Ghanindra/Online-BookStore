



// import { useEffect, useState } from "react"
// import axios from "axios"
// import { useParams, useNavigate } from "react-router-dom"
// import { toast } from "react-toastify"
// import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

// import "./BookDetails.css"

// const BookDetails = () => {
//   const { bookId } = useParams()
//   const [book, setBook] = useState(null)
//   const [cartItems, setCartItems] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [quantity, setQuantity] = useState(1)
//   const navigate = useNavigate()

//   // Fetch the book details when the component mounts or bookId changes
//   useEffect(() => {
//     const fetchBookDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5023/api/books/${bookId}`)
//         setBook(response.data)
//         setLoading(false) // Stop loading once the book is fetched
//       } catch (error) {
//         console.error("Failed to fetch book details:", error)
//         setLoading(false)
//       }
//     }
//     fetchBookDetails()
//   }, [bookId])

//   // Handle the "Add to Cart" action
//   const handleAddToCart = async (bookId) => {
//     try {
//       const token = localStorage.getItem("token")
//       if (!token) {
//         toast.error("Please log in to add items to the cart")
//         navigate("/login")
//         return
//       }

//       // Make the API call to add the book to the cart
//       const response = await axios.post(
//         "http://localhost:5023/api/user/cart/add",
//         { bookId, quantity },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       )

//       // If the book is added to the cart, update the local state
//       const updatedCartItems = [...cartItems]
//       const addedBook = { ...book, quantity } // Use book details with quantity
//       updatedCartItems.push(addedBook)
//       setCartItems(updatedCartItems) // Update the state with the new cart items

//       toast.success(`${book.title} has been added to your cart.`) // Show a success toast
//       navigate("/cart") // Navigate to the cart page after adding
//     } catch (error) {
//       console.error("Failed to add to cart:", error)
//       if (error.response && error.response.status === 401) {
//         toast.error("Please log in to add books to the cart.")
//         navigate("/login")
//       } else {
//         toast.error("Something went wrong! Please try again later.")
//       }
//     }
//   }

//   const decreaseQuantity = () => {
//     if (quantity > 1) {
//       setQuantity(quantity - 1)
//     }
//   }

//   const increaseQuantity = () => {
//     setQuantity(quantity + 1)
//   }

//   // If loading, show a loading message
//   if (loading) return <p className="loading-message">Loading book details...</p>

//   // If no book is found, show an error message
//   if (!book) return <p className="error-message">Book not found.</p>

//   return (
//     <div className="book-details-container">
//       <div className="book-image-section">
//         <img src={`http://localhost:5023${book.imageUrl}`} alt={book.title} />
//         <div className="social-icons">
//   <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
//     <FaFacebook />
//   </a>
//   <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
//     <FaInstagram />
//   </a>
//   <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
//     <FaTwitter />
//   </a>
// </div>
//       </div>

//       <div className="book-info-section">
//         <div className="book-format">Paper Back</div>
//         <h2>{book.title}</h2>
//         <p className="book-author">by {book.author}</p>

//         <div className="book-rating">
//           <span className="star">⭐</span>
//           <span className="rating-value">4.0</span>
//           <span className="reviews-count">1 Book Reviews</span>
//         </div>

//         <p className="book-seller">
//           Sold by <a href="#">Booksmandala Nepal</a>
//         </p>

//         <div className="book-synopsis">
//           <h3>Synopsis</h3>
//           <p>{book.description || "A guide to self-discovery and inner peace."}</p>
//         </div>
//       </div>

//       <div className="purchase-section">
//         <div className="purchase-card">
//           <h3>Get Estimated Arrival Time</h3>

//           <div className="location-info">
//             <span className="location-icon">📍</span>
//             <div>
//               <p className="location-name">Kathmandu</p>
//               <p className="location-address">Kathmandu, Nepal</p>
//             </div>
//             <span className="edit-icon">✏️</span>
//           </div>

//           <div className="delivery-info">
//             <span className="delivery-icon">🚚</span>
//             <div>
//               <p className="delivery-title">Delivery Within</p>
//               <p className="delivery-time">1 to 2 days</p>
//             </div>
//             <span className="info-icon">ℹ️</span>
//           </div>

//           <div className="price-section">
//             <p className="book-price">Rs. {book.price}</p>

//             <div className="quantity-selector">
//               <button onClick={decreaseQuantity} className="qty-btn">
//                 −
//               </button>
//               <span className="qty-display">QTY: {quantity}</span>
//               <button onClick={increaseQuantity} className="qty-btn">
//                 +
//               </button>
//             </div>

//             <button className="add-to-cart-btn" onClick={() => handleAddToCart(book.id)}>
//               ADD TO CART
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default BookDetails


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
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [review, setReview] = useState({ rating: 0, comment: "" })  // New state for review form
  const [reviews, setReviews] = useState([])  // State for reviews
  const navigate = useNavigate()

  // Fetch the book details when the component mounts or bookId changes
  useEffect(() => {
    const fetchBookDetails = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await axios.get(`http://localhost:5023/api/books/${bookId}`)
        setBook(response.data)
        setLoading(false) // Stop loading once the book is fetched
        // Fetch the reviews for this book
        const reviewsResponse = await axios.get(`http://localhost:5023/api/reviews/${bookId}`,
         {  

        headers: {
            Authorization: `Bearer ${token}`,
          }},
        )
        setReviews(reviewsResponse.data)  // Set the reviews for the book
      } catch (error) {
        console.error("Failed to fetch book details:", error)
        setLoading(false)
      }
    }
    fetchBookDetails()
  }, [bookId])

  // Handle the "Add to Cart" action
  const handleAddToCart = async (bookId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Please log in to add items to the cart")
        navigate("/login")
        return
      }

      // Make the API call to add the book to the cart
      const response = await axios.post(
        "http://localhost:5023/api/user/cart/add",
        { bookId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // If the book is added to the cart, update the local state
      const updatedCartItems = [...cartItems]
      const addedBook = { ...book, quantity } // Use book details with quantity
      updatedCartItems.push(addedBook)
      setCartItems(updatedCartItems) // Update the state with the new cart items

      toast.success(`${book.title} has been added to your cart.`) // Show a success toast
      navigate("/cart") // Navigate to the cart page after adding
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
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  // Handle review submission
  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Please log in to submit a review")
        navigate("/login")
        return
      }

      // Send the review to the backend
      const response = await axios.post(
        `http://localhost:5023/api/reviews/${bookId}`,
        {rating:review.rating,
          comment:review.comment,
          bookId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Add the new review to the list of reviews
      setReviews([...reviews, response.data])

      // Reset the review form
      setReview({ rating: 0, comment: "" })

      toast.success("Review submitted successfully!")
    } catch (error) {
      console.error("Failed to submit review:", error)
      toast.error("Failed to submit your review. Please try again.")
    }
  }

  // If loading, show a loading message
  if (loading) return <p className="loading-message">Loading book details...</p>

  // If no book is found, show an error message
  if (!book) return <p className="error-message">Book not found.</p>

  return (
    <div className="book-details-container">
      <div className="book-image-section">
        <img src={`http://localhost:5023${book.imageUrl}`} alt={book.title} />
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
        </div>
      </div>

      <div className="book-info-section">
        <div className="book-format">Paper Back</div>
        <h2>{book.title}</h2>
        <p className="book-author">by {book.author}</p>
        <p className="book-author">by {book.format}</p>

        <div className="book-rating">
          <span className="star">⭐</span>
          <span className="rating-value">4.0</span>
          <span className="reviews-count">{reviews.length} Book Reviews</span>
        </div>

        <p className="book-seller">
          Sold by <a href="#">BookStore</a>
        </p>

        <div className="book-synopsis">
          <h3>Synopsis</h3>
          <p>{book.description || "A guide to self-discovery and inner peace."}</p>
        </div>
      </div>

      <div className="purchase-section">
        <div className="purchase-card">
          <h3>Get Estimated Arrival Time</h3>

          <div className="location-info">
            <span className="location-icon"><MdLocationOn style={{ color: 'red', fontSize: '24px' }} /></span>
            <div>
              <p className="location-name">Kathmandu</p>
              <p className="location-address">Kathmandu, Nepal</p>
            </div>
            {/* <span className="edit-icon">✏️</span> */}
          </div>

          <div className="delivery-info">
            <span className="delivery-icon"> <FaTruck style={{ fontSize: '24px', marginRight: '8px' }} /></span>
            <div>
              <p className="delivery-title">Delivery Within</p>
              <p className="delivery-time">1 to 2 days</p>
            </div>
            {/* <span className="info-icon">ℹ️</span> */}
          </div>

          <div className="price-section">
            <p className="book-price">Rs. {book.price}</p>

            <div className="quantity-selector">
              <button onClick={decreaseQuantity} className="qty-btn">
                −
              </button>
              <span className="qty-display">QTY: {quantity}</span>
              <button onClick={increaseQuantity} className="qty-btn">
                +
              </button>
            </div>

            <button className="add-to-cart-btn" onClick={() => handleAddToCart(book.id)}>
              ADD TO CART
            </button>
          </div>
        </div>
      </div>

      <div className="review-section">
        <h3>Leave a Review</h3>
        <div className="review-form">
          <div>
            <label>Rating: </label>
            <select
              value={review.rating}
              onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}
            >
              <option value="0">Select rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <div>
            <label>Comment: </label>
            <textarea
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
            />
          </div>
          <button onClick={handleSubmitReview}>Submit Review</button>
        </div>

        <div className="reviews-list">
          <h4>Reviews:</h4>
          {reviews.map((rev) => (
            <div key={rev.id} className="review-item">
              <p><strong>{rev.user.name}</strong> - {rev.rating} Stars</p>
              <p>{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BookDetails
