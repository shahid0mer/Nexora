import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = ['https://nexora-c1zz.onrender.com/api','http://localhost:5000/api'];

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const productAPI = {
  getProducts: () => api.get('/products'),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart', { productId, quantity }),
  removeFromCart: (productId) => api.delete(`/cart/${productId}`),
  updateCartItem: async (productId, quantity) => {
    return await api.put(`/cart/update/${productId}`, { quantity });
  },
  checkout: (cartItems, customerInfo) => api.post('/cart/checkout', { cartItems, customerInfo }),
};

export default api;