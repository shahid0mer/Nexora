import React from 'react';
import ProductGrid from './components/ProductGrid.jsx';
import Cart from './components/Cart.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';

function App() {
  const [cartUpdated, setCartUpdated] = React.useState(0);
  const [showCheckout, setShowCheckout] = React.useState(false);
  const [checkoutItems, setCheckoutItems] = React.useState([]);
  const [activeSection, setActiveSection] = React.useState('products'); // 'products' or 'cart'

  const handleAddToCart = () => {
    setCartUpdated(prev => prev + 1);
    setActiveSection('cart'); // Automatically switch to cart when item is added
  };

  const handleCheckout = (items) => {
    setCheckoutItems(items);
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setCartUpdated(prev => prev + 1);
    setActiveSection('products'); // Switch back to products after successful checkout
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setCheckoutItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold text-gray-900">Vibe Commerce</h1>
            
            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveSection('products')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeSection === 'products'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveSection('cart')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeSection === 'cart'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cart
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'products' ? (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Products</h2>
            <p className="text-gray-600">Discover amazing products at great prices</p>
          </div>
        ) : (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Shopping Cart</h2>
            <p className="text-gray-600">Review your items and proceed to checkout</p>
          </div>
        )}

        {/* Content Sections */}
        <div className="flex justify-center">
          {activeSection === 'products' ? (
            <div className="w-full max-w-7xl">
              <ProductGrid onAddToCart={handleAddToCart} />
            </div>
          ) : (
            <div className="w-full max-w-7xl">
              <Cart 
                key={cartUpdated}
                onCheckout={handleCheckout}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Vibe Commerce. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          cartItems={checkoutItems}
          onClose={handleCloseCheckout}
          onCheckoutSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}

export default App;