import { Router } from 'express';
import calendarRoutes from './routes/calendar';
import profilesRoutes from './routes/profiles';

const router = Router();

// Basic health check route
router.get('/', (req, res) => {
    res.send('API is running!');
});

// Mount calendar routes
router.use('/calendar', calendarRoutes);
// Mount profiles routes
router.use('/profiles', profilesRoutes);

export default router;
