import React from 'react';
import { cartAPI } from '../services/api.js';

const Cart = ({ onCheckout }) => {
  const [cart, setCart] = React.useState({ items: [], total: 0 });
  const [loading, setLoading] = React.useState(true);
  const [updatingItems, setUpdatingItems] = React.useState({});

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    setUpdatingItems(prev => ({ ...prev, [productId]: true }));
    try {
      await cartAPI.removeFromCart(productId);
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Error removing item from cart');
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => ({ ...prev, [productId]: true }));
    try {
      await cartAPI.updateCartItem(productId, newQuantity);
      fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Error updating item quantity');
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Shopping Cart
          </h2>
        </div>

        {/* Cart Content */}
        <div className="p-6">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
              <button 
                onClick={() => window.location.href = '/products'}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.items.map(item => (
                  <div key={item.productId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {/* Product Image */}
                    <img 
                      src={item.product?.image} 
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{item.product?.name}</h4>
                      <p className="text-gray-600 text-sm mt-1">${item.product?.price}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={updatingItems[item.productId] || item.quantity <= 1}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          
                          <span className="w-8 text-center font-medium text-gray-900">
                            {updatingItems[item.productId] ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                            ) : (
                              item.quantity
                            )}
                          </span>
                          
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            disabled={updatingItems[item.productId]}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Subtotal and Remove */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-lg">
                        ${(item.product?.price * item.quantity).toFixed(2)}
                      </p>
                      <button 
                        onClick={() => handleRemoveFromCart(item.productId)}
                        disabled={updatingItems[item.productId]}
                        className="mt-2 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm transition-colors duration-200"
                      >
                        {updatingItems[item.productId] ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                            Removing...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">${cart.total.toFixed(2)}</span>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => window.location.href = '/products'}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Continue Shopping
                  </button>
                  
                  <button 
                    onClick={() => onCheckout(cart.items)}
                    disabled={cart.items.length === 0}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;