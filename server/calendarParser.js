const supabase = require('./supabase');

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
        // (need to check that event does have a categories value)
        const processedEvents = Object.values(events).filter(
            event => event.categories &&
            event.categories.includes("Study List") === true );
        //console.log(processedEvents);   

        // need user_id to update profiles table
        const {user_id} = req.body; // need to send in request
        if (!user_id) {
            return res.status(400).send("Need user_id");
        }

        const {error} = await supabase
            .from('profiles')
            .update({calendar_data: processedEvents})
            .eq('id', user_id);
        if (error) {
            console.error(error);
            return res.status(500).send("Supabase update error");
        }

        res.json(proccessedEvents); // Send parsed calendar data back to the client
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the file.');
    }
});

module.exports = router;