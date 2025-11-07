const mongoose = require('mongoose');
const User = require('../models/User');

require('dotenv').config();

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@upl.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'HR Manager',
    email: 'hr@upl.com',
    password: 'hr123',
    role: 'hr'
  },
  {
    name: 'Operational Head',
    email: 'ophead@upl.com',
    password: 'ophead123',
    role: 'operational_head'
  }
];

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/upl-partner');
    console.log('Connected to MongoDB');

    // Clear existing users (optional - remove if you want to keep existing)
    // await User.deleteMany({ role: { $in: ['admin', 'hr', 'operational_head'] } });

    // Create users
    for (const userData of seedUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
      } else {
        const user = new User(userData);
        await user.save();
        console.log(`Created user: ${userData.email} (${userData.role})`);
      }
    }

    console.log('\nSeed completed successfully!');
    console.log('\nDefault Login Credentials:');
    console.log('Admin: admin@upl.com / admin123');
    console.log('HR: hr@upl.com / hr123');
    console.log('Operational Head: ophead@upl.com / ophead123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();

