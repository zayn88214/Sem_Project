import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrocore';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@agrocore.com';
    const farmerEmail = 'farmer@agrocore.com';
    const password = 'Password123';

    // Check for Admin
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: password,
        role: 'admin'
      });
      console.log('Admin user created: ', adminEmail);
    } else {
      console.log('Admin user already exists');
    }

    // Check for Farmer
    let farmer = await User.findOne({ email: farmerEmail });
    if (!farmer) {
      await User.create({
        name: 'John Farmer',
        email: farmerEmail,
        password: password,
        role: 'farmer'
      });
      console.log('Farmer user created: ', farmerEmail);
    } else {
      console.log('Farmer user already exists');
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
