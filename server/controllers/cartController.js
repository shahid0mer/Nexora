import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

let cart = { items: [] }; // In-memory cart for simplicity

export const getCart = async (req, res) => {
  try {
    const itemsWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          ...item.toObject ? item.toObject() : item,
          product: product ? {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image
          } : null
        };
      })
    );

    const total = itemsWithDetails.reduce((sum, item) => {
      return sum + (item.product ? item.product.price * item.quantity : 0);
    }, 0);

    res.json({
      items: itemsWithDetails,
      total: parseFloat(total.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += parseInt(quantity);
    } else {
      cart.items.push({
        productId,
        quantity: parseInt(quantity)
      });
    }

    res.json({ message: 'Item added to cart', cart: cart.items });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    cart.items = cart.items.filter(item => item.productId.toString() !== id);

    res.json({ message: 'Item removed from cart', cart: cart.items });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};

export const checkout = async (req, res) => {
  try {
    const { cartItems, customerInfo } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          product: product ? {
            name: product.name,
            price: product.price
          } : null,
          quantity: item.quantity
        };
      })
    );

    const total = itemsWithDetails.reduce((sum, item) => {
      return sum + (item.product ? item.product.price * item.quantity : 0);
    }, 0);

    const receipt = {
      orderId: 'ORD-' + Date.now(),
      timestamp: new Date().toISOString(),
      customer: customerInfo,
      items: itemsWithDetails,
      total: parseFloat(total.toFixed(2)),
      status: 'completed'
    };

    // Clear cart after successful checkout
    cart.items = [];

    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: 'Error during checkout', error: error.message });
  }
};


export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    // Find the item in cart
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === id);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update the quantity
    cart.items[itemIndex].quantity = parseInt(quantity);

    res.json({ 
      message: 'Cart item updated successfully', 
      cart: cart.items 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item', error: error.message });
  }
};