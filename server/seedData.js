// Script to seed database with test data
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({ email: { $in: ['admin@test.com', 'user@test.com'] } });
    await Product.deleteMany({});
    await Category.deleteMany({});

    console.log('Cleared existing test data');

    // Create test admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
      phone: '1234567890',
      role: 'admin'
    });

    // Create test regular user
    const user = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123',
      phone: '0987654321',
      role: 'user'
    });

    console.log('Created test users');
    console.log('Admin: admin@test.com / admin123');
    console.log('User: user@test.com / user123');

    // Create categories
    const electronics = await Category.create({
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets'
    });

    const clothing = await Category.create({
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel'
    });

    const books = await Category.create({
      name: 'Books',
      slug: 'books',
      description: 'Books and literature'
    });

    const home = await Category.create({
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Home and garden products'
    });

    console.log('Created categories');

    // Create sample products
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 99.99,
        stock: 50,
        category: electronics._id,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        featured: true
      },
      {
        name: 'Smart Watch',
        description: 'Fitness tracker with heart rate monitor',
        price: 199.99,
        stock: 30,
        category: electronics._id,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
        featured: true
      },
      {
        name: 'Laptop Backpack',
        description: 'Durable backpack with laptop compartment',
        price: 49.99,
        stock: 100,
        category: clothing._id,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
        featured: false
      },
      {
        name: 'Classic T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 19.99,
        stock: 200,
        category: clothing._id,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        featured: false
      },
      {
        name: 'Programming Book',
        description: 'Learn JavaScript from scratch',
        price: 39.99,
        stock: 75,
        category: books._id,
        imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800',
        featured: true
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic coffee maker with timer',
        price: 79.99,
        stock: 40,
        category: home._id,
        imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
        featured: false
      },
      {
        name: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness',
        price: 29.99,
        stock: 60,
        category: home._id,
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
        featured: false
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable wireless speaker with great sound',
        price: 59.99,
        stock: 80,
        category: electronics._id,
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
        featured: true
      }
    ];

    await Product.insertMany(products);
    console.log('Created sample products');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@test.com / admin123');
    console.log('User: user@test.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
