import React, { useState, useEffect } from 'react';
import { getAdminOrders, updateOrderStatus } from '../api';
import './Admin.css';

function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user.is_admin) {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getAdminOrders(token);
      setOrders(ordersData);
    } catch (err) {
      setError('Failed to fetch orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      await updateOrderStatus(orderId, newStatus, token);
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
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
        <button onClick={fetchOrders} className="refresh-btn">
          Refresh Orders
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="orders-section">
        <h2>Customer Orders ({orders.length})</h2>
        
        {orders.length === 0 ? (
          <div className="no-orders">No orders found.</div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
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
                  <p><strong>Address:</strong> {order.address}</p>
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
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      disabled={updatingOrder === order.id}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {updatingOrder === order.id && (
                      <span className="updating">Updating...</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;