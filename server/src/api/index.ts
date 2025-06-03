import { Router } from 'express';
import calendarRoutes from './routes/calendar';
import profilesRoutes from './routes/profiles';
import chatsRoutes from './routes/chats';

const router = Router();

// Basic health check route
router.get('/', (req, res) => {
    res.send('API is running!');
});

// Mount calendar routes
router.use('/calendar', calendarRoutes);
// Mount profiles routes
router.use('/profiles', profilesRoutes);
// Mount chats routes
router.use('/chats', chatsRoutes);

export default router;
