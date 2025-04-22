import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Product.css';

const Products = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const storedUserId = localStorage.getItem("UserId");
    setUserId(storedUserId);
    console.log("Hello from Products.js:", storedUserId);

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        const grouped = data.reduce((acc, product) => {
          if (!acc[product.category]) acc[product.category] = [];
          acc[product.category].push(product);
          return acc;
        }, {});
        setGroupedProducts(grouped);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/cart/add', {
        userId,
        item: {
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.image,
          stock: product.stock,
          quantity: 1
        }
      });
      alert('Added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart');
    }
  };

  const allCategories = Object.keys(groupedProducts);

  return (
    <section className="products-section">
      <h2 className="section-title">Category-wise Products</h2>

      <div className="filter-bar">
        {/* 🔍 Search Bar */}
        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* 🧾 Category Dropdown */}
        <div className="category-dropdown">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="dropdown-select"
          >
            <option value="All">All Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 🛍️ Filtered Product Cards */}
      {Object.entries(groupedProducts).map(([category, items]) => {
        if (selectedCategory !== 'All' && category !== selectedCategory) return null;

        const filteredItems = items.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredItems.length === 0) return null;

        return (
          <div key={category} className="category-section">
            <h3 className="category-heading">{category}</h3>
            <div className="products-grid">
              {filteredItems.map((product) => (
                <div key={product._id} className="product-card">
                  <img src={`http://localhost:5000${product.image}`} alt={product.name} className="product-image" />
                  <div className="product-details">
                    <h3 className="product-name">{product.name}</h3>
                    <span className="product-price">₹{product.price}</span>
                    <p className="product-stock">Stock: {product.stock}</p>
                    <button className="add-button" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Products;
