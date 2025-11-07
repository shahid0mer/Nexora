import Product from '../models/Product.js';
import axios from 'axios';

// Seed products from FakeStore API
export const seedProducts = async () => {
  try {
    const productsCount = await Product.countDocuments();
    
    if (productsCount === 0) {
      console.log('🌱 No products found, fetching from FakeStore API...');
      
      // Fetch products from FakeStore API
      const response = await axios.get('https://fakestoreapi.com/products');
      const apiProducts = response.data;
      console.log(apiProducts);
      

      // Transform the API data to match our schema
      const products = apiProducts.map(product => ({
        name: product.title,
        price: product.price,
        description: product.description,
        image: product.image,
        category: product.category,
        rating: {
          rate: product.rating.rate,
          count: product.rating.count
        }
      }));

      // Take only first 8 products to keep it manageable
      const productsToInsert = products.slice(0, 8);

      await Product.insertMany(productsToInsert);
      console.log('✅ Products seeded successfully from FakeStore API!');
      console.log(`✅ Added ${productsToInsert.length} products to database`);
      
      // Log the product names for verification
      productsToInsert.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - $${product.price}`);
      });
    } else {
      console.log(`✅ Database already has ${productsCount} products`);
    }
  } catch (error) {
    console.error('❌ Error seeding products from FakeStore API:', error.message);
    console.log('🔄 Using fallback local products...');
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};