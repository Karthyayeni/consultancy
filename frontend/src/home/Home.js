import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import UserAvatar from './UserAvatar';

const Home = () => {

  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const [user, setUser] = useState(' ');


  const handleViewProducts = () => {
    navigate('/products');
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
      const name = localStorage.getItem("userName");
      setUserName(name);
    }
  }, []);
  const [loginName, setLoginName] = useState("");

  

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);

      const allCategories = [...new Set(data.map(p => p.category))];
      setCategories(allCategories);
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = products.filter(p => p.category === selectedCategory);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
};

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginName.trim()) {
      localStorage.setItem("token", "demo-token");
      localStorage.setItem("userName", loginName);
      setUserName(loginName);
      setIsLoggedIn(true);
    }
  };

  

  return (
    <div className="home-container">
      {/* Header with navigation */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" className="logo-icon-small" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h1 className="logo-text-small">RAJAA STORES</h1>
          </div>
          <nav className="main-nav">
            <a href="#" className="nav-link">Home</a>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/contact" className="nav-link">Contacts</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/myorders" className="nav-link">My orders</Link>
            <Link to="/cart" className="cart-icon">
  🛒 View Cart
</Link>



          </nav>
          <div className="header-actions">
            
            {user && <UserAvatar user={user} />}

            {isLoggedIn ? (
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    ) : (
                        <Link to="/login">Login</Link>
            )}
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Welcome to RAJAA STORES</h1>
            <p className="hero-subtitle">Hello, {userName}! Discover authentic flavors of groceries.</p>
            <div className="hero-buttons">
              <button className="primary-button">
                Shop Now
              </button>
              <button className="secondary-button" onClick={handleViewProducts}>
                View Products
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="products-section">
      <h2 className="section-title">Category-wise Products</h2>

      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Show products only after selecting category */}
      {selectedCategory && (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img 
                src={`http://localhost:5000${product.image}`} 
                alt={product.name} 
                className="product-image" 
              />
              <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <span className="product-price">₹{product.price}</span>
                <p className="product-stock">Stock: {product.stock}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>



      {/* Special offer banner */}
      <section className="offer-section">
        <div className="offer-banner">
          <div className="offer-content">
            <div className="offer-text">
              <h2 className="offer-title">Special Offer!</h2>
              <p className="offer-description">Get 20% off on all festive special items.Limited time offer.</p>
              <button className="offer-button">
                Shop Festival Items
              </button>
            </div>
            <div className="offer-icon-container">
              <div className="offer-icon">
                <span className="festival-icon">🪔</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-column">
              <h3 className="footer-heading">RAJAA STORES</h3>
              <p className="footer-text">Your trusted source for authentic Indian groceries since 2005.</p>
              <div className="social-links">
                <a href="#" className="social-link">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a href="#" className="social-link">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm-3.11 14.03l-3.92-3.92 1.41-1.41 2.51 2.53 5.42-5.42 1.41 1.41-6.83 6.81z"></path>
                  </svg>
                </a>
                <a href="#" className="social-link">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-column">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Home</a></li>
                <li><a href="#" className="footer-link">Products</a></li>
                <li><a href="#" className="footer-link">Recipes</a></li>
                <li><a href="#" className="footer-link">About Us</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-heading">Customer Service</h3>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Contact Us</a></li>
                <li><a href="#" className="footer-link">FAQs</a></li>
                <li><a href="#" className="footer-link">Shipping Policy</a></li>
                <li><a href="#" className="footer-link">Returns & Refunds</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-heading">Newsletter</h3>
              <p className="footer-text">Subscribe to get special offers and recipes!</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email" className="newsletter-input" />
                <button className="newsletter-button">
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Spice & Nice. All rights reserved. Your authentic Indian grocery store.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;