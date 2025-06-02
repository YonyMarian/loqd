// TODO: CONVERT TO TYPESCRIPT

// const schedule = require('./schedule.ts');
// const supabase = require('../../supabase.js');

// const multer = require('multer');
// const ical = require('node-ical');
// const path = require('path');
// const fs = require('fs');

import { getScheduleObject, toWellFormedEvent, WellFormedEvent } from './schedule';
import supabase from '../supabase';

import multer from 'multer';
import ical from 'node-ical';
import path from 'path';
import fs from 'fs';

import express, {Request, Response} from 'express';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary upload directory

// Route to handle file upload and parsing
// handles upload_cal.txs's (front-end component) post request
// multer middleware processes uploaded file and makes it available in req.file
    // ^^ upload.single('calendarFile'); remember, we named our formData entry "calendarFile"
router.post('/upload_cal', upload.single('calendarFile'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).send('No file uploaded.');
            return;
        }

        const filePath = path.resolve(req.file.path);
        const events = await ical.async.parseFile(filePath);
        // deletes temp file after parsing
        fs.unlinkSync(filePath);


        //TODO:
        /*
            DEFINE INTERFACE FOR EVENT
        */

        // extract only classes and discussions!!
        // res.json(events);
        const processedEvents = Object.values(events)
        .filter(
            //event => event.hasOwnProperty("categories") && event.categories.includes("Study List")
            event => (event as any).hasOwnProperty("categories") && (event as any).categories.includes("Study List")
        )
        .map(event => {
        // 2) if there’s an RRule on it, serialize &/or expand it
            if ((event as any).rrule) {
                // turn the rule into the canonical iCal string
                (event as any).rruleString = (event as any).rrule.toString();
                // pull out the BYDAY array (e.g. ['MO','WE','FR'])
                if ((event as any).rrule.origOptions.byweekday) {
                    (event as any).byday = (event as any).rrule.origOptions.byweekday
                                    .map((d: any) => d.toString());
                }
            }
            return event;
        })
        .map((event) => toWellFormedEvent(event))
        .filter((e): e is WellFormedEvent => e!== null);
        
        const realSchedule = getScheduleObject(processedEvents);
        console.log(realSchedule);   

        res.json(realSchedule); // Send parsed calendar data back to the client
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the file.');
    }
});

router.post('/update_calendar', async (req: Request, res: Response) => {
    const {user_id, calendar_data} = req.body;
    if (!user_id || !calendar_data) {
        res.status(400).send("Missing data!");
        return;
    }

    const {error} = await supabase
        .from('profiles')
        .update({calendar_data: calendar_data})
        .eq('id', user_id);
    if (error) {
        console.error(error);
        res.status(500).send("Error sending calendar data");
        return;
    }

    res.send("Calendar data added to profiles table!");

})





//module.exports = router;
export default router;
