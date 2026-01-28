const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
require('dotenv').config();

async function addProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get first category
    const category = await Category.findOne();
    if (!category) {
      console.error('No categories found. Please create a category first.');
      process.exit(1);
    }

    console.log('Using category:', category.name);

    // Product 1: Leather Jacket
    const product1 = new Product({
      name: 'Premium Leather Jacket',
      description: 'Genuine leather jacket with premium finish and comfortable fit. Perfect for any season.',
      price: 299.99,
      stock: 15,
      category: category._id,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
      featured: true
    });

    // Product 2: Designer Sunglasses
    const product2 = new Product({
      name: 'Designer Sunglasses',
      description: 'UV protection designer sunglasses with polarized lenses. Stylish and protective.',
      price: 149.99,
      stock: 25,
      category: category._id,
      imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=800&fit=crop',
      featured: true
    });

    // Save products
    await product1.save();
    console.log('✅ Added:', product1.name);

    await product2.save();
    console.log('✅ Added:', product2.name);

    console.log('\n🎉 Successfully added 2 new featured products!');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addProducts();
