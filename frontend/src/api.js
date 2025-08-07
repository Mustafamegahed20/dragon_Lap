
const API_BASE = 'http://localhost:5000/api';

export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function getProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProduct(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

// Admin API functions
export async function getAdminOrders(token) {
  try {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId, status, token) {
  try {
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}


