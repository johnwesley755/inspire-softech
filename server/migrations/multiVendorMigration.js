const mongoose = require('mongoose');
const config = require('../config/config');
const User = require('../models/User');
const Seller = require('../models/Seller');
const Product = require('../models/Product');
const Order = require('../models/Order');

const migrateToMultiVendor = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    // Step 1: Create default platform seller
    console.log('\n📦 Step 1: Creating default platform seller...');
    
    // Find or create a super admin user
    let superAdmin = await User.findOne({ email: 'admin@test.com' });
    
    if (!superAdmin) {
      console.log('Creating super admin user...');
      superAdmin = await User.create({
        name: 'Platform Admin',
        email: 'admin@test.com',
        password: 'admin123',
        role: 'super_admin'
      });
      console.log('✅ Super admin user created');
    } else {
      // Update existing admin to super_admin
      superAdmin.role = 'super_admin';
      await superAdmin.save();
      console.log('✅ Updated existing admin to super_admin');
    }

    // Create default platform seller
    let platformSeller = await Seller.findOne({ businessName: 'Platform Store' });
    
    if (!platformSeller) {
      platformSeller = await Seller.create({
        user: superAdmin._id,
        businessName: 'Platform Store',
        businessEmail: 'admin@test.com',
        businessPhone: '1234567890',
        businessAddress: {
          street: '123 Platform St',
          city: 'Tech City',
          state: 'CA',
          zipCode: '12345',
          country: 'United States'
        },
        commission: 0, // Platform doesn't pay commission to itself
        status: 'approved'
      });
      console.log('✅ Platform seller created');
    } else {
      console.log('✅ Platform seller already exists');
    }

    // Step 2: Assign all existing products to platform seller
    console.log('\n📦 Step 2: Assigning products to platform seller...');
    
    const productsWithoutSeller = await Product.find({ seller: null });
    console.log(`Found ${productsWithoutSeller.length} products without seller`);
    
    if (productsWithoutSeller.length > 0) {
      await Product.updateMany(
        { seller: null },
        { $set: { seller: platformSeller._id } }
      );
      console.log(`✅ Assigned ${productsWithoutSeller.length} products to platform seller`);
    } else {
      console.log('✅ All products already have sellers');
    }

    // Step 3: Update existing orders with seller reference
    console.log('\n📦 Step 3: Updating orders with seller reference...');
    
    const ordersWithoutSeller = await Order.find({ seller: null });
    console.log(`Found ${ordersWithoutSeller.length} orders without seller`);
    
    for (const order of ordersWithoutSeller) {
      // Get the first product from the order to determine seller
      if (order.items && order.items.length > 0) {
        const product = await Product.findById(order.items[0].product);
        
        if (product && product.seller) {
          order.seller = product.seller;
          
          // Calculate commission (retroactively)
          const seller = await Seller.findById(product.seller);
          if (seller) {
            const commissionRate = seller.commission || 0;
            order.platformCommission = (order.totalPrice * commissionRate) / 100;
            order.sellerRevenue = order.totalPrice - order.platformCommission;
          }
          
          await order.save();
        }
      }
    }
    console.log(`✅ Updated ${ordersWithoutSeller.length} orders with seller reference`);

    // Step 4: Update all admin users to appropriate roles
    console.log('\n📦 Step 4: Updating user roles...');
    
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`Found ${adminUsers.length} admin users`);
    
    for (const user of adminUsers) {
      // Check if they have a seller profile
      const sellerProfile = await Seller.findOne({ user: user._id });
      
      if (sellerProfile) {
        user.role = 'seller';
        console.log(`✅ Updated ${user.email} to seller role`);
      } else {
        user.role = 'super_admin';
        console.log(`✅ Updated ${user.email} to super_admin role`);
      }
      
      await user.save();
    }

    // Step 5: Display migration summary
    console.log('\n📊 Migration Summary:');
    console.log('='.repeat(50));
    
    const totalSellers = await Seller.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    
    console.log(`Total Sellers: ${totalSellers}`);
    console.log(`Total Products: ${totalProducts}`);
    console.log(`Total Orders: ${totalOrders}`);
    console.log(`Total Users: ${totalUsers}`);
    
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    console.log('\nUsers by Role:');
    usersByRole.forEach(role => {
      console.log(`  ${role._id}: ${role.count}`);
    });
    
    console.log('\n✅ Migration completed successfully!');
    console.log('\n🔐 Default Credentials:');
    console.log('  Super Admin: admin@test.com / admin123');
    console.log('  (Update password after first login)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
console.log('🚀 Starting Multi-Vendor Migration...');
console.log('='.repeat(50));
migrateToMultiVendor();
