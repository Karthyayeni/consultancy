import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const userId = localStorage.getItem("UserId");
  const [similarProducts, setSimilarProducts] = useState([]);

  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data);

      const reviewsRes = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(reviewsRes.data.reviews || []);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching product or reviews:', err);
      setError('Failed to load product details. Please try again later.');
      setLoading(false);
    }
  }, [id]);

  const fetchSimilarProducts = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/similar/${id}`);
      setSimilarProducts(res.data.similar);
    } catch (error) {
      console.error('Error fetching similar products:', error);
    }
  }, [id]);


  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    fetchProduct();
    fetchSimilarProducts();
  }, [fetchProduct, fetchSimilarProducts]);

  const getStockStatus = (stockLevel) => {
    if (stockLevel > 10) return { class: 'in-stock', text: 'In Stock' };
    if (stockLevel > 0) return { class: 'low-stock', text: 'Low Stock' };
    return { class: 'out-of-stock', text: 'Out of Stock' };
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/cart/add', {
        userId,
        item: {
          productId: id,
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.image,
          stock: product.stock,
          quantity: quantity
        }
      });
      alert('Added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart');
    }
  };

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleRatingHover = (hoveredValue) => {
    setHoveredRating(hoveredValue);
  };

  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      await axios.post('http://localhost:5000/api/reviews', {
        productId: id,
        userId: localStorage.getItem('UserId'),
        rating,
        comment
      });
      alert('Review submitted successfully');
      setRating(5);
      setComment('');
      fetchProduct(); // reloads the reviews
    } catch (err) {
      console.error('Review submission error:', err.response?.data || err.message);
      alert('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

    
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  // Star rating component
  const StarRating = ({ value, hoverValue, onClick, onHover, onLeave, readOnly = false }) => {
    return (
      <div className={`star-rating ${readOnly ? 'read-only' : ''}`} onMouseLeave={readOnly ? null : onLeave}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= (hoverValue || value) ? 'filled' : 'empty'}`}
            onClick={readOnly ? null : () => onClick(star)}
            onMouseEnter={readOnly ? null : () => onHover(star)}
          >
            {star <= (hoverValue || value) ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading product details...</p>
    </div>
  );

  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  const stockStatus = getStockStatus(product.stock);
  const averageRating = calculateAverageRating();

  return (
    <div className="product-detail-container">
      <div className="product-detail-card">
        <div className="product-image-container">
          <img src={`http://localhost:5000${product.image}`} alt={product.name} className="product-image" />
        </div>
        <div className="product-info-container">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-meta">
            <div className="product-rating">
              <StarRating value={averageRating} readOnly={true} />
              <span className="rating-count">({reviews.length} reviews)</span>
            </div>
            <div className="product-category">
              <span className="meta-label">Category:</span> {product.category}
            </div>
          </div>

          <div className="product-price">₹{product.price}</div>

          <div className="product-stock-1">
            <span className="meta-label">Availability:</span>
            <span className={`stock-indicator ${stockStatus.class}`}>
              {stockStatus.text}
            </span>
            <span className="stock-units">({product.stock} units)</span>
          </div>
          <br />
          <div className="product-description">
            <h3>Product Description</h3>
            <p>{product.description || "Milk product"}</p>
            {product.description && product.description.includes('(') ? null :
              <span className="price-per-unit">(₹{product.price}/L)</span>
            }
          </div>
          <div className="product-actions">
            <div className="quantity-selector">
              <button className="quantity-btn" onClick={decrementQuantity} disabled={quantity <= 1}>−</button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={product.stock}
                className="quantity-input"
              />
              <button className="quantity-btn" onClick={incrementQuantity} disabled={quantity >= product.stock}>+</button>
            </div>
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="product-tabs">
        <div className="tab-content">
          <div className="reviews-section">
            <div className="reviews-header">
              <h2>Customer Reviews</h2>
              <div className="reviews-summary">
                <div className="average-rating">
                  <span className="rating-number">{averageRating}</span>
                  <StarRating value={averageRating} readOnly={true} />
                  <span className="rating-count">Based on {reviews.length} reviews</span>
                </div>
              </div>
            </div>

            <div className="review-form-container">
              <h3>Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="review-form">
                <div className="rating-container">
                  <label>Your Rating:</label>
                  <StarRating
                    value={rating}
                    hoverValue={hoveredRating}
                    onClick={handleRatingClick}
                    onHover={handleRatingHover}
                    onLeave={handleRatingLeave}
                  />
                </div>
                <div className="review-input">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    required
                    className="review-textarea"
                  />
                </div>
                <button type="submit" className="submit-review-btn" disabled={submittingReview}>
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>

            <div className="reviews-list">
              {reviews && reviews.length > 0 ? (
                reviews.map((rev, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <span className="reviewer-name">{rev.userId?.name || "Anonymous"}</span>
                      <StarRating value={rev.rating} readOnly={true} />
                      <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="review-comment">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="no-reviews">No reviews yet. Be the first to review this product!</div>
              )}
            </div>


          </div>
          <br></br>
          <div>
  <h3 className="similar-title">You may also Like</h3>
  <div className="similar-products-grid">
    {similarProducts.map((item) => (
      <Link to={`/product/${item._id}`} key={item._id} className="similar-product-card-link">
        <div className="similar-product-card">
          <img src={`http://localhost:5000${item.image}`} alt={item.name} />
          <h4 className="product-name">{item.name}</h4>
          <p className="product-price">₹{item.price}</p>
        </div>
      </Link>
    ))}
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;