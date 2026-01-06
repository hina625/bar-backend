import mongoose from 'mongoose';

const connectDB = async () => {
    let uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (uri) uri = uri.trim();

    if (!uri || uri === 'your_mongodb_connection_string_here') {
        console.warn('WARNING: MONGODB_URI is not set correctly in .env. Database features will be disabled.');
        return;
    }

    try {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // Keep it relatively short
            socketTimeoutMS: 45000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
    }
};

export default connectDB;
