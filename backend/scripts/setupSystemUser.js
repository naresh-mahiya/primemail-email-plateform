import mongoose from 'mongoose';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const setupSystemUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Check if system user already exists
    const systemUser = await User.findOne({ email: 'welcome@primemail.com' });
    
    if (!systemUser) {
      // Create system user
      await User.create({
        fullname: 'PrimeMail Team',
        email: 'welcome@primemail.com',
        password: process.env.SYSTEM_USER_PASSWORD, // Make sure to set this in your .env
        inbox: [],
        sent: [],
        starred: []
      });
      console.log('System user created successfully');
    } else {
      console.log('System user already exists');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error setting up system user:', error);
    process.exit(1);
  }
};

setupSystemUser(); 