import { Router, Request, Response } from 'express';
import multer from 'multer';
import ical from 'node-ical';
import path from 'path';
import fs from 'fs';
import { getScheduleObject, toWellFormedEvent, WellFormedEvent } from '../../../uploads/schedule';
import supabase from '../../../supabase';

const router = Router();

// Ensure uploads directory exists with absolute path
const uploadsDir = path.join(__dirname, '../../../uploads/temp');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({ dest: uploadsDir }); // Temporary upload directory with absolute path

// Calendar upload and parsing route
router.post('/upload_cal', upload.single('calendarFile'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded.' });
            return;
        }
        
        const filePath = req.file.path;
        const events = await ical.async.parseFile(filePath);
        // deletes temp file after parsing
        try {
            fs.unlinkSync(filePath);
        } catch (err) {
            console.error('Error deleting temp file:', err);
            // Continue processing even if file deletion fails
        }

        const processedEvents = Object.values(events)
            .filter(
                event => (event as any).hasOwnProperty("categories") && (event as any).categories.includes("Study List")
            )
            .map(event => {
                if ((event as any).rrule) {
                    (event as any).rruleString = (event as any).rrule.toString();
                    if ((event as any).rrule.origOptions.byweekday) {
                        (event as any).byday = (event as any).rrule.origOptions.byweekday
                            .map((d: any) => d.toString());
                    }
                }
                return event;
            })
            .map((event) => toWellFormedEvent(event))
            .filter((e): e is WellFormedEvent => e !== null);
        
        const realSchedule = getScheduleObject(processedEvents);
        // console.log(realSchedule);   

        res.json(realSchedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing the file.' });
    }
});

// Calendar update route
router.post('/update_calendar', async (req: Request, res: Response) => {
    const { user_id, calendar_data } = req.body;
    if (!user_id || !calendar_data) {
        res.status(400).json({ error: "Missing data!" });
        return;
    }

    const { error } = await supabase
        .from('profiles')
        .update({ calendar_data: calendar_data })
        .eq('id', user_id);
    
    if (error) {
        console.error(error);
        res.status(500).json({ error: "Error sending calendar data" });
        return;
    }
    
    res.json({ message: "Calendar data added to profiles table!" });
});

export default router;
