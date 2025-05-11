import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaBell } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Home.css";

import UserAvatar from './UserAvatar';

const Home = () => {
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryDropdownRef = useRef(null);
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = localStorage.getItem('UserId');

  useEffect(() => {
  console.log('Unread notification count:', unreadCount);
}, [unreadCount]);

  const navigate = useNavigate();

  const handleViewProducts = () => {
    navigate('/products');
  };

  const handleLogin = () => {
    navigate('/login');
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

  
  useEffect(() => {
    if (location.state && location.state.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('https://consultancy-1-tdn6.onrender.com/api/products');
        setProducts(data);
    
        const allCategories = [...new Set(data.map(p => p.category))];
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };  
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }; 

  const handleNavCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);

    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('UserId');
    
    setIsLoggedIn(false);
    setUserName("");
    navigate('/');
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get('https://consultancy-1-tdn6.onrender.com/api/order/myorders', {
          params: { userId },
        });

        const newNotifs = data
          .filter(order => order.status === 'Shipped' || order.status === 'Delivered')
          .map(order => `Your current order is ${order.status}`);

        setNotifications(newNotifs);
        setUnreadCount(newNotifs.length);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (userId) fetchNotifications();
  }, [userId]);

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
    setUnreadCount(0);
  };


  return (
    <div className="home-container">
      <header className="header">
        <div className="header-content">
            <div className="logo">
    <svg xmlns="http://www.w3.org/2000/svg" className="logo-icon-small" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
    <h1 className="logo-text-small">RAJAA STORES</h1>
  </div>
  
  <nav className="main-nav">
    <Link to="/about" className="nav-link">About Us</Link>
    <Link to="/contact" className="nav-link">Contacts</Link>
    
    <div className="category-dropdown-container" ref={categoryDropdownRef}>
      <button 
        className="category-dropdown-btn"
        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
      >
        Categories <span className="dropdown-arrow">▼</span>
      </button>
      
      {showCategoryDropdown && (
        <div className="category-dropdown-menu">
          <div
            className="category-item"
            onClick={() => handleNavCategoryClick(null)}
          >
            All Products
          </div>
          {categories.map((category) => (
            <div
              key={category}
              className="category-item"
              onClick={() => handleNavCategoryClick(category)}
            >
              {category}
            </div>
          ))}
        </div>
      )}
    </div>
    
    <Link to="/products" className="nav-link">All Products</Link>
    {isLoggedIn && <Link to="/myorders" className="nav-link">My Orders</Link>}
    
    <Link to="/cart" className="cart-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      View Cart
    </Link>
    
    <div className="navbar-right">
      <div className="notification-icon" onClick={toggleNotifications}>
        <FaBell size={20} color="white" />
        {newNotifications && <span className="notification-badge">{notifications.length}</span>}
      </div>
      
      <div className="header-actions">
        {isLoggedIn ? (
          <div className="user-account">
            {userName && <UserAvatar user={userName} />}
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="login-button" onClick={handleLogin}>Login</button>
        )}
      </div>
    </div>
  </nav>
  
  {showNotifications && (
    <div className="notifications-dropdown">
      {notifications.length === 0 ? (
        <p style={{padding: '1rem', textAlign: 'center', color: '#6b7280'}}>No new notifications</p>
      ) : (
        notifications.map((notification, idx) => (
          <div key={idx} className="notification-item">
            <p>{notification}</p>
          </div>
        ))
      )}
    </div>
  )}
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Welcome to RAJAA STORES</h1>
            <p className="hero-subtitle">
              {isLoggedIn ? `Hello, ${userName}! ` : ''}
              Discover authentic flavors of groceries.
            </p>
            <div className="hero-buttons">
              {!isLoggedIn && (
                <button className="primary-button" onClick={handleLogin}>
                  Login to Shop
                </button>
              )}
              <button 
                className={isLoggedIn ? "primary-button" : "secondary-button"} 
                onClick={handleViewProducts}
              >
                {isLoggedIn ? "Shop Now" : "Browse Products"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="products-section">
        <h2 className="section-title">Products</h2>

        

        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <img 
                  src={`https://consultancy-1-tdn6.onrender.com${product.image}`} 
                  alt={product.name} 
                  className="product-image" 
                />
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <span className="product-price">₹{product.price}</span>
                  <p className="product-stock">Stock: {product.stock}</p>
                  <p className="product-stock">{product.description}</p>
                  {!isLoggedIn && (
                    <p className="login-message">Please login to purchase</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-products-message">
              <p>No products found for this category.</p>
            </div>
          )}
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
                <a href="https://www.facebook.com" className="social-link">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a href="https://www.twitter.com" className="social-link">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm-3.11 14.03l-3.92-3.92 1.41-1.41 2.51 2.53 5.42-5.42 1.41 1.41-6.83 6.81z"></path>
                  </svg>
                </a>
                <a href="https://www.instagram.com" className="social-link">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-column">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/products" className="footer-link">Products</Link></li>
                <li><Link to="/about" className="footer-link">About Us</Link></li>
                {!isLoggedIn && (
                  <li><Link to="/login" className="footer-link highlight">Login</Link></li>
                )}
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-heading">Shop by Category</h3>
              <ul className="footer-links">
                {categories.slice(0, 4).map((category) => (
                  <li key={category}>
                    <Link 
                      to="#" 
                      className="footer-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryClick(category);
                      }}
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="footer-heading">Customer Service</h3>
              <ul className="footer-links">
                <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 RAJAA STORES. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;