import axios from 'axios';
import { useEffect, useState } from 'react';
import './ProductManagement.css';

const categories = ['Dairy', 'Rice', 'Beverages', 'Oils and Ghees', 'Dals', 'Spices', 'Personal Care', 'Household Essentials'];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category: '', stock: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [activeTab] = useState('');

  const fetchProducts = async () => {
    const { data } = await axios.get('http://localhost:5000/api/products');
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImageFile(e.target.files[0]);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (imageFile) formData.append('image', imageFile);

    if (editingId) {
      await axios.put(`http://localhost:5000/api/products/${editingId}`, formData);
      setEditingId(null);
    } else {
      await axios.post('http://localhost:5000/api/products', formData);
    }

    setForm({ name: '', price: '', category: '', stock: '', description: '' });
    setImageFile(null);
    fetchProducts();
  };

  const handleCancel = () => {
    setForm({ name: '', price: '', category: '', stock: '', description: '' });
    setImageFile(null);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description,
      existingImage: product.image
    });
    setEditingId(product._id);
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    }
  };

  const getStockClass = (stock) => {
    const stockNum = parseInt(stock);
    if (stockNum <= 0) return "out-of-stock";
    if (stockNum < 10) return "low-stock";
    return "";
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = filter === '' || product.category === filter;
    const stockNum = parseInt(product.stock);
    const matchesStockFilter = 
      stockFilter === 'all' || 
      (stockFilter === 'low' && stockNum > 0 && stockNum < 10) ||
      (stockFilter === 'out' && stockNum <= 0);

    const matchesSearch =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesStockFilter && matchesSearch;
  });

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-header">RAJAA STORES Product <span>🛒</span></h1>

      <>
        <div className="filter-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <div className="stock-filter">
            <label className="filter-label">Stock Level: </label>
            <select 
              value={stockFilter} 
              onChange={(e) => setStockFilter(e.target.value)}
              className="stock-select"
            >
              <option value="all">All Products</option>
              <option value="low">Low Stock (&lt; 10)</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="category-pills">
          <button 
            className={`category-pill ${filter === '' ? 'active' : ''}`} 
            onClick={() => setFilter('')}
            style={{ display: 'inline-block', width: 'auto', margin: '0 8px 8px 0' }}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`category-pill ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
              style={{ display: 'inline-block', width: 'auto', margin: '0 8px 8px 0' }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="product-form">
          <h2 className="form-title">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Product Name </label>
                <input 
                  id="name"
                  type="text" 
                  name="name" 
                  placeholder="Enter product name" 
                  value={form.name} 
                  onChange={handleChange} 
                  className="form-input" 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="price">Price (₹)</label>
                <input 
                  id="price"
                  type="number" 
                  name="price" 
                  placeholder="Enter price" 
                  value={form.price} 
                  onChange={handleChange} 
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="category">Category </label>
                <select 
                  id="category"
                  name="category" 
                  value={form.category} 
                  onChange={handleChange} 
                  className="form-select" 
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="stock">Stock Quantity </label>
                <input 
                  id="stock"
                  type="number" 
                  name="stock" 
                  placeholder="Enter available stock" 
                  value={form.stock} 
                  onChange={handleChange} 
                  className="form-input" 
                  required 
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label" htmlFor="description">Description </label>
                <input
                  id="description"
                  type="text" 
                  name="description" 
                  placeholder="Brief description of the product" 
                  value={form.description} 
                  onChange={handleChange} 
                  className="form-input" 
                />
              </div>
              
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-file-label" htmlFor="image">Product Image </label>
                <input 
                  id="image"
                  type="file" 
                  onChange={handleImageChange} 
                  className="form-file-input" 
                  accept="image/*" 
                />
              </div>
              
              <div className="form-buttons" style={{ display: 'flex', gap: '10px' }}>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={handleCancel} 
                    className="btn-cancel"
                    style={{ width: 'auto', padding: '8px 16px' }}
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit" 
                  className="btn-submit"
                  style={{ width: 'auto', padding: '8px 16px' }}
                >
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="results-info">
          <p>Showing {filteredProducts.length} of {products.length} products</p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="products-grid-1">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card-1">
                <div className="product-image-container-1">
                  {product.image ? (
                    <img 
                      src={`http://localhost:5000${product.image}`} 
                      alt={product.name} 
                      className="product-image" 
                    />
                  ) : (
                    <div className="product-image" style={{ backgroundColor: '#f3f4f6' }}></div>
                  )}
                  <div className="product-badge">{product.category}</div>
                  {parseInt(product.stock) <= 0 && (
                    <div className="product-badge out-of-stock-badge">Out of Stock</div>
                  )}
                  {parseInt(product.stock) > 0 && parseInt(product.stock) < 10 && (
                    <div className="product-badge low-stock-badge">Low Stock</div>
                  )}
                </div>
                <div className="product-content-1">
                  <div className="product-header-1">
                    <h2 className="product-name-1">{product.name}</h2>
                    <p className="product-price-1">₹{product.price}</p>
                  </div>
                  <p className="product-description-1">{product.description || 'No description available'}</p>
                  <div className="product-meta-1">
                    <div className={`product-stock ${getStockClass(product.stock)}`}>
                      <span className="stock-indicator"></span>
                      Stock: {product.stock}
                    </div>
                  </div>
                  <div className="product-actions-1" style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleEdit(product)} 
                      className="btn-edit-1"
                      style={{ width: 'auto', padding: '6px 12px' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)} 
                      className="btn-delete-1"
                      style={{ width: 'auto', padding: '6px 12px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3 className="empty-title">No products found</h3>
            <p className="empty-description">
              {searchQuery ? 'No products match your search criteria.' : 
               filter ? `No products found in the "${filter}" category.` : 
               'Start by adding your first product.'}
            </p>
          </div>
        )}
      </>

      {activeTab === 'orders' && (
        <div className="empty-state">
          <div className="empty-icon">🚧</div>
          <h3 className="empty-title">Coming Soon</h3>
          <p className="empty-description">Order Management will be available soon.</p>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3 className="empty-title">Coming Soon</h3>
          <p className="empty-description">Report generation will be available soon.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;