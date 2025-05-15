const express = require('express');
const multer = require('multer');
const ical = require('node-ical');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary upload directory

// Route to handle file upload and parsing
// handles upload_cal.txs's (front-end component) post request
// multer middleware processes uploaded file and makes it available in req.file
    // ^^ upload.single('calendarFile'); remember, we named our formData entry "calendarFile"
router.post('/upload_cal', upload.single('calendarFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const filePath = path.resolve(req.file.path);
        const events = await ical.async.parseFile(filePath);
        // deletes temp file after parsing
        fs.unlinkSync(filePath);

        // extract only classes and discussions!!
        // res.json(events);
        const processedEvents = Object.values(events).filter(
            event => event.hasOwnProperty("categories") && event.categories.includes("Study List")
        ).map(event => {
        // 2) if there’s an RRule on it, serialize &/or expand it
            if (event.rrule) {
                // turn the rule into the canonical iCal string
                event.rruleString = event.rrule.toString();
                // pull out the BYDAY array (e.g. ['MO','WE','FR'])
                if (event.rrule.origOptions.byweekday) {
                    event.byday = event.rrule.origOptions.byweekday
                                    .map(d => d.toString());
                }
            }
        return event;
        })
        console.log(processedEvents);   

        res.json(processedEvents); // Send parsed calendar data back to the client
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the file.');
    }
});

module.exports = router;