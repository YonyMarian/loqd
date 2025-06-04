import { Router } from 'express';
import calendarRoutes from './routes/calendar';
import 'dotenv/config';

const router = Router();

// Basic health check route
router.get('/', (req, res) => {
    res.send('API is running!');
});

// Mount calendar routes
router.use('/calendar', calendarRoutes);

export default router;
