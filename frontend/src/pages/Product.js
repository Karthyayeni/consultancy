import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Product.css';

const Products = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // New filter states
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortOption, setSortOption] = useState('default');
  const [inStock, setInStock] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("UserId");
    setUserId(storedUserId);
    console.log("Hello from Products.js:", storedUserId);

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('https://consultancy-1-tdn6.onrender.com/api/products');
        setAllProducts(data);
        
        // Find max price for range filter
        const maxProductPrice = Math.max(...data.map(product => product.price));
        setPriceRange(prev => ({ ...prev, max: maxProductPrice }));
        
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

  const handleAddToCart = async (e, product) => {
    e.preventDefault(); // Stop link navigation
    e.stopPropagation(); // Prevent event bubbling
    
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    try {
      await axios.post('https://consultancy-1-tdn6.onrender.com/api/cart/add', {
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

  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: Number(value)
    }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceRange({ min: 0, max: Math.max(...allProducts.map(product => product.price)) });
    setSortOption('default');
    setInStock(false);
  };

  // Get all categories for the dropdown
  const allCategories = Object.keys(groupedProducts);

  // Apply all filters and sorting to products
  const getFilteredProducts = () => {
    // Start with all products
    let filteredProducts = [...allProducts];
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }
    
    // Apply search term filter
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply price range filter
    filteredProducts = filteredProducts.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    // Apply in-stock filter
    if (inStock) {
      filteredProducts = filteredProducts.filter(product => product.stock > 0);
    }
    
    // Apply sorting
    switch(sortOption) {
      case 'price-low-high':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-a-z':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-z-a':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting (by category as before)
        break;
    }
    
    // Group by category for display
    return filteredProducts.reduce((acc, product) => {
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
      return acc;
    }, {});
  };

  const filteredGroupedProducts = getFilteredProducts();

  return (
    <section className="products-section">
      <h2 className="section-title">Category-wise Products</h2>

      <div className="filter-container">
        <div className="filter-row">
          {/* 🔍 Search Bar */}
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
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
          
          {/* 💰 Price Range */}
          <div className="price-range-filter">
            <div className="filter-label">Price Range:</div>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="0"
                value={priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="price-input"
                min="0"
              />
              <span className="price-separator">to</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="price-input"
                min={priceRange.min}
              />
            </div>
          </div>
        </div>

        <div className="filter-row">
        
          <div className="sort-filter">
            <div className="filter-label">Sort By:</div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="dropdown-select"
            >
              <option value="default">Default</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="name-a-z">Name: A to Z</option>
              <option value="name-z-a">Name: Z to A</option>
            </select>
          </div>

          
          <div className="stock-filter">
            <label className="stock-label">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="stock-checkbox"
              />
              In Stock Only
            </label>
          </div>

          {/* 🔄 Reset Filters Button */}
          <div className="reset-filter">
            <button 
              className="reset-filters-btn"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* 📊 Filter Results Status */}
      <div className="filter-status">
        <p>
          {Object.values(filteredGroupedProducts).flat().length} products found
        </p>
      </div>

      
      {Object.keys(filteredGroupedProducts).length > 0 ? (
        Object.entries(filteredGroupedProducts).map(([category, items]) => (
          <div key={category} className="category-section">
            <h3 className="category-heading">{category}</h3>
            <div className="products-grid">
              {items.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`}>
                  <div className="product-card">
                    <div className="product-stock-badge">
                      {product.stock > 0 ? 
                        <span className="in-stock">In Stock ({product.stock})</span> : 
                        <span className="out-of-stock">Out of Stock</span>
                      }
                    </div>
                    <img src={`http://localhost:5000${product.image}`} alt={product.name} className="product-image" />
                    <div className="product-details">
                      <h3 className="product-name">{product.name}</h3>
                      <span className="product-price">₹{product.price}</span>
                      <p className="desc">Inclusive of all taxes</p>
                      <p className="product-stock">{product.description}</p>
                      <button 
                        className="add-button" 
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={product.stock <= 0}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="no-products-found">
          <p>No products match your filters. Try changing your filter criteria.</p>
          <button onClick={resetFilters} className="reset-filters-btn">Reset All Filters</button>
        </div>
      )}
    </section>
  );
};

export default Products;