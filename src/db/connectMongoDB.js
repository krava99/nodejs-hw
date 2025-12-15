import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  const mongoUrl = process.env.MONGO_URL;

  try {
    await mongoose.connect(mongoUrl);
    console.log('connect to mongo');
  } catch (error) {
    console.log(error);
  }
};
