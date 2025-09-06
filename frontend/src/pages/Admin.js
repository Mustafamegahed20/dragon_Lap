import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAdminOrders, updateOrderStatus, getProducts, getCategories, addProduct, deleteProduct, getAdminAnalytics } from '../api';
import './Admin.css';

function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    cost_price: '',
    quantity: '',
    category_id: '',
    image: '',
    cpu: '',
    ram: '',
    storage: '',
    graphics: '',
    screen_size: '',
    operating_system: '',
    weight: '',
    battery: ''
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  // editSelectedFile and editImagePreview were unused; removed to satisfy linter

  const fetchOrders = useCallback(async () => {
    try {
      const ordersData = await getAdminOrders(token);
      setOrders(ordersData);
    } catch (err) {
      setError('Failed to fetch orders: ' + err.message);
    }
  }, [token]);

  const fetchProducts = useCallback(async () => {
    try {
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (err) {
      setError('Failed to fetch products: ' + err.message);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to fetch categories: ' + err.message);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const analyticsData = await getAdminAnalytics(token);
      setAnalytics(analyticsData);
    } catch (err) {
      setError('Failed to fetch analytics: ' + err.message);
    }
  }, [token]);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchOrders(),
        fetchProducts(),
        fetchCategories(),
        fetchAnalytics()
      ]);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchOrders, fetchProducts, fetchCategories, fetchAnalytics]);

  useEffect(() => {
    if (!user.is_admin) {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }

    fetchInitialData();
  }, [fetchInitialData, user.is_admin]);

  useEffect(() => {
    // Handle success message from navigation
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear the message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
      // Clear the state to prevent showing on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      await updateOrderStatus(orderId, newStatus, token);
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      setError('Failed to update order status: ' + err.message);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#3498db';
      case 'shipped': return '#9b59b6';
      case 'delivered': return '#2ecc71';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      let productData = { ...newProduct };
      
      // If files are selected, convert to base64 for demo purposes
      // In production, you'd upload to cloud storage like AWS S3
      if (selectedFiles.length > 0) {
        // Use the first image as the main image for backward compatibility
        productData.image = imagePreviews[0];
        // Send all images as array
        productData.images = imagePreviews;
        
        await addProduct(productData, token);
        resetForm();
        setShowAddProductForm(false);
        await fetchProducts();
        setError('');
      } else {
        // No files selected, use placeholder
        const placeholder = '/images/laptops/placeholder-laptop.jpg';
        productData.image = placeholder;
        productData.images = [placeholder];
        await addProduct(productData, token);
        resetForm();
        setShowAddProductForm(false);
        await fetchProducts();
        setError('');
      }
    } catch (err) {
      setError('Failed to add product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      setDeletingProduct(productId);
      await deleteProduct(productId, token);
      await fetchProducts();
      setError('');
    } catch (err) {
      setError('Failed to delete product: ' + err.message);
    } finally {
      setDeletingProduct(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      
      // Create previews for all files
      const previews = [];
      let loadedCount = 0;
      
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews[index] = reader.result;
          loadedCount++;
          
          // When all files are loaded, update state
          if (loadedCount === files.length) {
            setImagePreviews([...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      cost_price: '',
      quantity: '',
      category_id: '',
      image: '',
      cpu: '',
      ram: '',
      storage: '',
      graphics: '',
      screen_size: '',
      operating_system: '',
      weight: '',
      battery: ''
    });
    setSelectedFiles([]);
    setImagePreviews([]);
  };

  const handleEditProduct = (product) => {
    navigate(`/admin/edit-product/${product._id}`);
  };

  // Table functionality
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedAndFilteredProducts = () => {
    let filteredProducts = products.filter(product => {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.category_id?.name?.toLowerCase().includes(searchLower) ||
        product.cpu?.toLowerCase().includes(searchLower) ||
        product.ram?.toLowerCase().includes(searchLower) ||
        product.price.toString().includes(searchLower)
      );
    });

    return filteredProducts.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle special cases
      if (sortField === 'category_id') {
        aValue = a.category_id?.name || '';
        bValue = b.category_id?.name || '';
      }
      if (sortField === 'price' || sortField === 'cost_price' || sortField === 'quantity') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  if (!user.is_admin) {
    return (
      <div className="admin-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders ({orders.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products ({products.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'products-table' ? 'active' : ''}`}
            onClick={() => setActiveTab('products-table')}
          >
            Products Table
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      {activeTab === 'dashboard' && analytics && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Analytics Dashboard</h2>
            <button onClick={fetchInitialData} className="refresh-btn">
              Refresh Data
            </button>
          </div>
          
          {/* Overview Cards */}
          <div className="overview-cards">
            <div className="stat-card revenue">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-value">${analytics.overview.totalRevenue?.toLocaleString()}</p>
                <span className="stat-period">Profit: ${analytics.overview.totalProfit?.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="stat-card orders">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <h3>Total Orders</h3>
                <p className="stat-value">{analytics.overview.totalOrders?.toLocaleString()}</p>
                <span className="stat-period">Completed: {analytics.overview.completedOrders}</span>
              </div>
            </div>
            
            <div className="stat-card products">
              <div className="stat-icon">💻</div>
              <div className="stat-content">
                <h3>Products in Stock</h3>
                <p className="stat-value">{analytics.overview.totalProducts}</p>
                <span className="stat-period">{analytics.overview.totalCategories} Categories</span>
              </div>
            </div>
            
            <div className="stat-card monthly">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <h3>Monthly Revenue</h3>
                <p className="stat-value">${analytics.overview.monthlyRevenue?.toLocaleString()}</p>
                <span className="stat-period">Daily: ${analytics.overview.dailyRevenue?.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="stat-card profit">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Profit Margin</h3>
                <p className="stat-value">{analytics.overview.profitMargin || 0}%</p>
                <span className="stat-period">Total Profit: ${analytics.overview.totalProfit?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Category Performance */}
          <div className="dashboard-row">
            <div className="dashboard-card">
              <h3>Category Performance</h3>
              <div className="category-stats">
                {analytics.categoryStats?.map((category, index) => (
                  <div key={index} className="category-stat">
                    <div className="category-info">
                      <span className="category-name">{category.name}</span>
                      <span className="category-count">{category.productCount} products</span>
                    </div>
                    <div className="category-metrics">
                      <span className="avg-price">Avg: ${category.averagePrice}</span>
                      <span className="revenue">${category.revenue?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <h3>Stock Alerts</h3>
              <div className="stock-alerts">
                <div className="alert-item low-stock">
                  <span className="alert-icon">⚠️</span>
                  <div className="alert-content">
                    <span className="alert-title">Low Stock Items</span>
                    <span className="alert-count">{analytics.overview.lowStockProducts} products</span>
                  </div>
                </div>
                <div className="alert-item out-of-stock">
                  <span className="alert-icon">🔴</span>
                  <div className="alert-content">
                    <span className="alert-title">Out of Stock</span>
                    <span className="alert-count">{analytics.overview.outOfStockProducts} products</span>
                  </div>
                </div>
                <div className="alert-item best-seller">
                  <span className="alert-icon">⭐</span>
                  <div className="alert-content">
                    <span className="alert-title">Top Category</span>
                    <span className="alert-count">{analytics.overview.topSellingCategory}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products & Low Stock */}
          <div className="dashboard-row">
            <div className="dashboard-card">
              <h3>Top Selling Products</h3>
              <div className="product-list">
                {analytics.topProducts?.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="product-item">
                    <div className="product-rank">#{index + 1}</div>
                    <div className="product-details">
                      <span className="product-name">{product.name}</span>
                      <span className="product-category">{product.category}</span>
                    </div>
                    <div className="product-metrics">
                      <span className="sales">{product.sales} sold</span>
                      <span className="price">${product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <h3>Monthly Sales Trend</h3>
              <div className="sales-trend">
                {analytics.monthlySales?.slice(-6).map((month, index) => (
                  <div key={index} className="month-stat">
                    <div className="month-name">{month.month}</div>
                    <div className="month-bar">
                      <div 
                        className="month-bar-fill" 
                        style={{height: `${(month.revenue / 320000) * 100}%`}}
                      ></div>
                    </div>
                    <div className="month-value">${(month.revenue / 1000).toFixed(0)}k</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="orders-section">
          <div className="section-header">
            <h2>Customer Orders ({orders.length})</h2>
            <button onClick={fetchInitialData} className="refresh-btn">
              Refresh Data
            </button>
          </div>
          
          {orders.length === 0 ? (
            <div className="no-orders">No orders found.</div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order #{order._id}</h3>
                      <p className="order-date">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="order-status">
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="customer-info">
                    <h4>Customer Information</h4>
                    <p><strong>Name:</strong> {order.customer_name}</p>
                    <p><strong>Email:</strong> {order.customer_email}</p>
                    <p><strong>Address:</strong> {
                      typeof order.address === 'object' 
                        ? `${order.address.street}, ${order.address.city}, ${order.address.state} ${order.address.zipCode}`
                        : order.address
                    }</p>
                  </div>

                  <div className="order-items">
                    <h4>Items</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-info">
                          <span className="item-name">{item.product_name || `Product ID: ${item.product_id}`}</span>
                          <span className="item-details">
                            Qty: {item.quantity} × ${item.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <strong>Total: ${order.total}</strong>
                    </div>
                    
                    <div className="status-controls">
                      <label>Update Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        disabled={updatingOrder === order._id}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updatingOrder === order._id && (
                        <span className="updating">Updating...</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="products-section">
          <div className="section-header">
            <h2>Product Management ({products.length})</h2>
            <button 
              onClick={() => setShowAddProductForm(!showAddProductForm)} 
              className="add-product-btn"
            >
              {showAddProductForm ? 'Cancel' : 'Add New Product'}
            </button>
          </div>

          {showAddProductForm && (
            <div className="add-product-form-container">
              <h3>Add New Product</h3>
              <form onSubmit={handleAddProduct} className="add-product-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Selling Price ($) *</label>
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Cost Price ($) *</label>
                    <input
                      type="number"
                      name="cost_price"
                      value={newProduct.cost_price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                      placeholder="Price you bought it for"
                    />
                  </div>
                  <div className="form-group">
                    <label>Profit Margin</label>
                    <input
                      type="text"
                      value={newProduct.price && newProduct.cost_price ? 
                        `$${(newProduct.price - newProduct.cost_price).toFixed(2)} (${(((newProduct.price - newProduct.cost_price) / newProduct.price) * 100).toFixed(1)}%)` 
                        : 'Enter prices above'}
                      disabled
                      className="profit-display"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quantity in Stock *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={newProduct.quantity}
                      onChange={handleInputChange}
                      min="0"
                      step="1"
                      required
                      placeholder="e.g., 50"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category_id"
                      value={newProduct.category_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Product Image</label>
                    <div className="file-upload-container">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="file-input"
                      />
                      <label htmlFor="image-upload" className="file-upload-btn">
                        <span className="upload-icon">📷</span>
                        {selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : 'Upload Images'}
                      </label>
                      {imagePreviews.length > 0 && (
                        <div className="images-gallery">
                          <div className="gallery-container">
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="gallery-item">
                                <img src={preview} alt={`Preview ${index + 1}`} />
                                <button 
                                  type="button" 
                                  className="remove-image-btn"
                                  onClick={() => {
                                    const newFiles = selectedFiles.filter((_, i) => i !== index);
                                    const newPreviews = imagePreviews.filter((_, i) => i !== index);
                                    setSelectedFiles(newFiles);
                                    setImagePreviews(newPreviews);
                                    if (newFiles.length === 0) {
                                      document.getElementById('image-upload').value = '';
                                    }
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                          <button 
                            type="button" 
                            className="clear-all-btn"
                            onClick={() => {
                              setSelectedFiles([]);
                              setImagePreviews([]);
                              document.getElementById('image-upload').value = '';
                            }}
                          >
                            Clear All
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>CPU</label>
                    <input
                      type="text"
                      name="cpu"
                      value={newProduct.cpu}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>RAM</label>
                    <input
                      type="text"
                      name="ram"
                      value={newProduct.ram}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Storage</label>
                    <input
                      type="text"
                      name="storage"
                      value={newProduct.storage}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Graphics</label>
                    <input
                      type="text"
                      name="graphics"
                      value={newProduct.graphics}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Screen Size</label>
                    <input
                      type="text"
                      name="screen_size"
                      value={newProduct.screen_size}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Operating System</label>
                    <input
                      type="text"
                      name="operating_system"
                      value={newProduct.operating_system}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={newProduct.weight}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Battery</label>
                    <input
                      type="text"
                      name="battery"
                      value={newProduct.battery}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-buttons">
                  <button type="submit" className="submit-btn">Add Product</button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddProductForm(false)}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}


          <div className="products-list">
            {products.length === 0 ? (
              <div className="no-products">No products found.</div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      {((product.images && product.images.length > 0) ? product.images : [product.image]).length > 1 ? (
                        <div className="admin-card-gallery">
                          <img src={((product.images && product.images.length > 0) ? product.images : [product.image])[0]} alt={product.name} />
                          <div className="image-count-badge">
                            {((product.images && product.images.length > 0) ? product.images : [product.image]).length} images
                          </div>
                        </div>
                      ) : (
                        <img src={product.image} alt={product.name} />
                      )}
                    </div>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p className="product-category">{product.category_id?.name}</p>
                      <p className="product-price">${product.price}</p>
                      <p className="product-quantity">
                        <strong>Stock:</strong> {product.quantity || 0} units
                      </p>
                      <p className="product-description">{product.description}</p>
                      {product.cpu && <p><strong>CPU:</strong> {product.cpu}</p>}
                      {product.ram && <p><strong>RAM:</strong> {product.ram}</p>}
                      {product.storage && <p><strong>Storage:</strong> {product.storage}</p>}
                    </div>
                    <div className="product-actions">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product._id)}
                        disabled={deletingProduct === product._id}
                        className="delete-btn"
                      >
                        {deletingProduct === product._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'products-table' && (
        <div className="products-table-section">
          <div className="section-header">
            <h2>Products Table ({products.length} items)</h2>
            <div className="table-controls">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button onClick={fetchProducts} className="refresh-btn">
                Refresh
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('_id')} className="sortable">
                    ID {sortField === '_id' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('name')} className="sortable">
                    Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Images</th>
                  <th onClick={() => handleSort('category_id')} className="sortable">
                    Category {sortField === 'category_id' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('price')} className="sortable">
                    Selling Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('cost_price')} className="sortable">
                    Cost Price {sortField === 'cost_price' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('quantity')} className="sortable">
                    Stock {sortField === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Profit</th>
                  <th onClick={() => handleSort('cpu')} className="sortable">
                    CPU {sortField === 'cpu' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('ram')} className="sortable">
                    RAM {sortField === 'ram' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('storage')} className="sortable">
                    Storage {sortField === 'storage' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Graphics</th>
                  <th>Screen</th>
                  <th>OS</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getSortedAndFilteredProducts().map(product => {
                  const profit = (product.price || 0) - (product.cost_price || 0);
                  const profitPercentage = product.price > 0 ? ((profit / product.price) * 100).toFixed(1) : 0;
                  const stockStatus = (product.quantity || 0) === 0 ? 'out-of-stock' : 
                                     (product.quantity || 0) < 10 ? 'low-stock' : 'in-stock';
                  
                  return (
                    <tr key={product._id} className={stockStatus}>
                      <td>{product._id}</td>
                      <td className="product-name">{product.name}</td>
                      <td>
                        <div className="table-image-gallery">
                          {((product.images && product.images.length > 0) ? product.images : [product.image]).map((img, idx) => (
                            <img 
                              key={idx} 
                              src={img} 
                              alt={`${product.name} ${idx + 1}`}
                              className="table-image"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Create modal to view larger image
                                window.open(img, '_blank');
                              }}
                            />
                          ))}
                        </div>
                      </td>
                      <td>{product.category_id?.name}</td>
                      <td className="price">${product.price?.toLocaleString()}</td>
                      <td className="cost-price">${(product.cost_price || 0).toLocaleString()}</td>
                      <td className={`quantity ${stockStatus}`}>{product.quantity || 0}</td>
                      <td className={`profit ${profit >= 0 ? 'positive' : 'negative'}`}>
                        ${profit.toLocaleString()} ({profitPercentage}%)
                      </td>
                      <td>{product.cpu || 'N/A'}</td>
                      <td>{product.ram || 'N/A'}</td>
                      <td>{product.storage || 'N/A'}</td>
                      <td>{product.graphics || 'N/A'}</td>
                      <td>{product.screen_size || 'N/A'}</td>
                      <td>{product.operating_system || 'N/A'}</td>
                      <td className="actions">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="action-btn edit-action"
                          title="Edit Product"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product._id)}
                          disabled={deletingProduct === product._id}
                          className="action-btn delete-action"
                          title="Delete Product"
                        >
                          {deletingProduct === product._id ? '⏳' : '🗑️'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {getSortedAndFilteredProducts().length === 0 && (
              <div className="no-data">
                {searchTerm ? 'No products match your search.' : 'No products found.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;