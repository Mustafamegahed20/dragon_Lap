import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts, getCategories, updateProduct } from '../api';
import './EditProduct.css';

function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  // currentImageIndex was unused; removed to satisfy linter

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user.is_admin) {
      navigate('/admin');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        
        const foundProduct = productsData.find(p => p._id === productId);
        if (!foundProduct) {
          setError('Product not found');
          return;
        }
        
        setProduct({
          ...foundProduct,
          cost_price: foundProduct.cost_price || 0
        });
        setCategories(categoriesData);
        // Load existing images
        const existingImages = foundProduct.images || [foundProduct.image];
        setImagePreviews(existingImages.filter(img => img));
      } catch (err) {
        setError('Failed to load product data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, user.is_admin, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let productData = { ...product };
      
      // Ensure category_id is just the string ID, not an object
      if (productData.category_id && typeof productData.category_id === 'object') {
        productData.category_id = productData.category_id._id;
      }
      
      // If new files are selected, use them; otherwise keep existing images
      if (selectedFiles.length > 0) {
        // Use the first image as the main image for backward compatibility
        productData.image = imagePreviews[0];
        // Send all images as array
        productData.images = imagePreviews;
      } else {
        // Keep existing images if no new files selected
        productData.images = imagePreviews;
        productData.image = imagePreviews[0] || product.image;
      }
      
      await updateProduct(productId, productData, token);
      navigate('/admin', { 
        state: { message: 'Product updated successfully!', type: 'success' }
      });
    } catch (err) {
      setError('Failed to update product: ' + err.message);
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  if (!user.is_admin) {
    return null;
  }

  if (loading) {
    return (
      <div className="edit-product-container">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-product-container">
        <div className="error-message">{error}</div>
        <button onClick={handleCancel} className="back-btn">
          Back to Admin
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="edit-product-container">
        <div className="error-message">Product not found</div>
        <button onClick={handleCancel} className="back-btn">
          Back to Admin
        </button>
      </div>
    );
  }

  return (
    <div className="edit-product-container">
      <div className="edit-product-header">
        <h1>Edit Product</h1>
        <button onClick={handleCancel} className="back-btn">
          ← Back to Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} className="edit-product-form">
        <div className="form-row">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Selling Price ($) *</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Cost Price ($)</label>
            <input
              type="number"
              name="cost_price"
              value={product.cost_price || ''}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              placeholder="Price you bought it for (optional)"
            />
          </div>
          <div className="form-group">
            <label>Profit Margin</label>
            <input
              type="text"
              value={product.price && product.cost_price ? 
                `$${(product.price - product.cost_price).toFixed(2)} (${(((product.price - product.cost_price) / product.price) * 100).toFixed(1)}%)` 
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
              value={product.quantity || ''}
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
              value={product.category_id?._id || product.category_id}
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
                {selectedFiles.length > 0 ? `${selectedFiles.length} new files selected` : 'Add More Images'}
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
                            const newPreviews = imagePreviews.filter((_, i) => i !== index);
                            setImagePreviews(newPreviews);
                            // If removing from new files
                            if (index < selectedFiles.length) {
                              const newFiles = selectedFiles.filter((_, i) => i !== index);
                              setSelectedFiles(newFiles);
                            }
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  {selectedFiles.length > 0 && (
                    <button 
                      type="button" 
                      className="clear-new-btn"
                      onClick={() => {
                        setSelectedFiles([]);
                        // Reset to existing images only
                        const existingImages = (product.images || [product.image]).filter(img => img);
                        setImagePreviews(existingImages);
                        document.getElementById('image-upload').value = '';
                      }}
                    >
                      Clear New Images
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={product.description || ''}
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
              value={product.cpu || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>RAM</label>
            <input
              type="text"
              name="ram"
              value={product.ram || ''}
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
              value={product.storage || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Graphics</label>
            <input
              type="text"
              name="graphics"
              value={product.graphics || ''}
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
              value={product.screen_size || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Operating System</label>
            <input
              type="text"
              name="operating_system"
              value={product.operating_system || ''}
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
              value={product.weight || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Battery</label>
            <input
              type="text"
              name="battery"
              value={product.battery || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-buttons">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={saving}
          >
            {saving ? 'Updating...' : 'Update Product'}
          </button>
          <button 
            type="button" 
            onClick={handleCancel}
            className="cancel-btn"
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;