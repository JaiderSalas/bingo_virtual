import { connect } from 'mongoose';
import dotenv from 'dotenv';

const uri = dotenv.config().parsed.MONGODB_URI;

const connectDB = async () => {

  try {
    await connect(uri);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
