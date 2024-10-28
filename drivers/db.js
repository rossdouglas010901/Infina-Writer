import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.time('✅ (2/2) MongoDB Successfully Connected In');

const db = {
    connect: async () => {
        try {
            const connectionString = `${process.env.DB_CONNECTION_URI}${process.env.DB_NAME}`;
            await mongoose.connect(connectionString);
            console.timeEnd('✅ (2/2) MongoDB Successfully Connected In');
            console.groupEnd("🚀 Starting Up 🚀");
            console.log('');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    },
    disconnect: async () => {
        try {
            await mongoose.disconnect();
        } catch (error) {
            console.error('Error disconnecting from MongoDB:', error);
        }
    },
    collection: (name) => mongoose.connection.collection(name)
};

db.connect();

export { db };
