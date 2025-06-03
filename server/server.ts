import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRoutes from './src/api';

// Load environment variables
const result = dotenv.config();
if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('Environment variables loaded successfully');
    console.log('Current working directory:', process.cwd());
    console.log('Environment variables:', {
        hasPassword: !!process.env.GETLOQD_GMAIL_APP_PASSWORD,
        passwordLength: process.env.GETLOQD_GMAIL_APP_PASSWORD?.length
    });
}

const app = express();
app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api', apiRoutes);

// Basic health check route
app.get('/', (req, res) => {
    res.send("Server is running");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
