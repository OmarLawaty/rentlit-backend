import mongoose from 'mongoose';

import { NODE_ENV, DB_URI } from '../config';

if (!DB_URI) throw new Error('Define the mongodb DB_URI in the .env.<development/production>');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(DB_URI as string);
    console.log(`connected to db successfully in ${NODE_ENV} mode`);
  } catch (error) {
    console.log('ERROR: error occurred while connecting to db');
  }
};

export default connectDB;
