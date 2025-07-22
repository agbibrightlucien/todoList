const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Atlas connection...');
console.log('📋 Connection string:', process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@'));

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas!');
  console.log('📊 Connection state:', mongoose.connection.readyState);
  console.log('🏷️  Database name:', mongoose.connection.name);
  process.exit(0);
})
.catch((error) => {
  console.error('❌ MongoDB connection failed:', error.message);
  console.log('\n🔧 Troubleshooting steps:');
  console.log('1. Check your internet connection');
  console.log('2. Verify MongoDB Atlas cluster is running');
  console.log('3. Check IP address is whitelisted in Network Access');
  console.log('4. Verify database user credentials in Database Access');
  console.log('5. Ensure cluster allows connections from anywhere (0.0.0.0/0)');
  process.exit(1);
});
