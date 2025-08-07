import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function getUserFromToken() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    address: '', 
    city: '', 
    state: '', 
    zipCode: '' 
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      setForm(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
    }
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format';
    if (!form.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^[\d\s+\-()]+$/.test(form.phone)) errors.phone = 'Invalid phone number';
    if (!form.address.trim()) errors.address = 'Address is required';
    if (!form.city.trim()) errors.city = 'City is required';
    if (!form.state.trim()) errors.state = 'State is required';
    if (!form.zipCode.trim()) errors.zipCode = 'ZIP code is required';
    return errors;
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);
    setOrderId(null);
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: cart,
          total,
          address: {
            street: form.address,
            city: form.city,
            state: form.state,
            zipCode: form.zipCode
          },
          customerInfo: {
            name: form.name,
            email: form.email,
            phone: form.phone
          }
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');
      setOrderId(data.orderId);
      setSubmitted(true);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container animate-fade-in" style={{ padding: '2rem 1rem', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card card-elevated" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h1 className="section-title" style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Order Placed Successfully!</h1>
          <p className="status-success" style={{ marginBottom: '1rem' }}>Order ID: {orderId}</p>
          <p style={{ marginBottom: '2rem' }}>Thank you for your purchase, {form.name}. You will receive a confirmation email shortly.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }
  
  if (cart.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ padding: '2rem 1rem', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
          <h1 className="section-title">Your Cart is Empty</h1>
          <p style={{ marginBottom: '2rem' }}>Add some items to your cart before proceeding to checkout.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Start Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="section-title">Secure Checkout</h1>
        <p className="section-subtitle">Complete your order with confidence</p>
      </div>
      
      {error && (
        <div className="status-error animate-slide-in" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 checkout-grid" style={{ gap: '2rem', alignItems: 'start' }}>
        {/* Order Summary */}
        <div className="section card-elevated">
          <div className="section-header">
            <h2 className="section-title">Order Summary</h2>
            <p className="section-subtitle">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            {cart.map(item => (
              <div key={item.id} className="grid grid-cols-3" style={{ 
                alignItems: 'center', 
                padding: '1rem 0', 
                borderBottom: '1px solid var(--border-color)' 
              }}>
                <div>
                  <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Qty: {item.qty}</div>
                </div>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  EGP {item.price.toFixed(2)}
                </div>
                <div style={{ textAlign: 'right', fontWeight: '500', color: 'var(--text-primary)' }}>
                  EGP {(item.price * item.qty).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ 
            borderTop: '2px solid var(--border-color)', 
            paddingTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>Total:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-color)' }}>EGP {total.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Checkout Form */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Shipping Information</h2>
            <p className="section-subtitle">Please fill in your details</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="grid grid-cols-2 checkout-form-grid" style={{ marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  className={`form-input ${validationErrors.name ? 'error' : ''}`}
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="Enter your full name"
                  style={validationErrors.name ? { borderColor: '#dc2626' } : {}}
                />
                {validationErrors.name && <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>{validationErrors.name}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input 
                  className={`form-input ${validationErrors.phone ? 'error' : ''}`}
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange} 
                  placeholder="Enter your phone number"
                  style={validationErrors.phone ? { borderColor: '#dc2626' } : {}}
                />
                {validationErrors.phone && <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>{validationErrors.phone}</div>}
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input 
                className={`form-input ${validationErrors.email ? 'error' : ''}`}
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="Enter your email address"
                style={validationErrors.email ? { borderColor: '#dc2626' } : {}}
              />
              {validationErrors.email && <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>{validationErrors.email}</div>}
            </div>
            
            {/* Address Information */}
            <div className="form-group">
              <label className="form-label">Street Address *</label>
              <input 
                className={`form-input ${validationErrors.address ? 'error' : ''}`}
                name="address" 
                value={form.address} 
                onChange={handleChange} 
                placeholder="Enter your street address"
                style={validationErrors.address ? { borderColor: '#dc2626' } : {}}
              />
              {validationErrors.address && <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>{validationErrors.address}</div>}
            </div>
            
            <div className="grid grid-cols-3 checkout-form-grid">
              <div className="form-group">
                <label className="form-label">City *</label>
                <input 
                  className={`form-input ${validationErrors.city ? 'error' : ''}`}
                  name="city" 
                  value={form.city} 
                  onChange={handleChange} 
                  placeholder="City"
                  style={validationErrors.city ? { borderColor: '#dc2626' } : {}}
                />
                {validationErrors.city && <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>{validationErrors.city}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label">State *</label>
                <input 
                  className={`form-input ${validationErrors.state ? 'error' : ''}`}
                  name="state" 
                  value={form.state} 
                  onChange={handleChange} 
                  placeholder="State"
                  style={validationErrors.state ? { borderColor: '#dc2626' } : {}}
                />
                {validationErrors.state && <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>{validationErrors.state}</div>}
              </div>
              
              <div className="form-group">
                <label className="form-label">ZIP Code *</label>
                <input 
                  className={`form-input ${validationErrors.zipCode ? 'error' : ''}`}
                  name="zipCode" 
                  value={form.zipCode} 
                  onChange={handleChange} 
                  placeholder="ZIP"
                  style={validationErrors.zipCode ? { borderColor: '#dc2626' } : {}}
                />
                {validationErrors.zipCode && <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>{validationErrors.zipCode}</div>}
              </div>
            </div>
            
            <button 
              className="btn-primary" 
              type="submit" 
              disabled={isLoading}
              style={{ 
                width: '100%', 
                marginTop: '1.5rem',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? (
                <>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Processing Order...
                </>
              ) : (
                `Place Order - EGP ${total.toFixed(2)}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 