import mongoose from 'mongoose';

export default async function connectDB(){
 if(!process.env.MONGODB_URI)throw new Error('MONGODB_URI is not configured.');
 await mongoose.connect(process.env.MONGODB_URI,{serverSelectionTimeoutMS:15000,connectTimeoutMS:15000});
 console.log(`MongoDB connected: ${mongoose.connection.host}`);
}
