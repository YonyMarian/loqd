import express from 'express';
import cors from 'cors';
import apiRoutes from './src/api/index';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// Mount all API routes
app.use('/api', apiRoutes);

// Basic health check route
app.get('/', (req, res) => {
    res.send("Server is running");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
