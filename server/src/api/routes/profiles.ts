import { Router, Request, Response, NextFunction } from 'express';
import supabase from '../../../supabase';

const router = Router();

// Route to get all user profiles
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*');
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch profiles' });
            }
            console.log(data);
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    })();
});

export default router;
