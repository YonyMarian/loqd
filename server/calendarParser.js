// FROM 

// import ical
// is esModuleInterop = false
// const ical = require('node-ical');
// bc esModuleInterop = true
import ical from 'node-ical';
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app=express();
const upload=multer({ dest: 'uploads/' });

app.post('/upload', upload.single('calendarFile'), async (req, res) => {
    try {
        if (!requestAnimationFrame.file) {
            return res.status(400).send("No file uploaded.");
        }
        //else.. parse file :D

        const filePath = path.resolve(req.file.path);
        const events = await ical.async.parseFile(filePath);
        fs.unlinkSync(filePath);

        res.json(events);
        }
    catch (error) {
        res.status(500).send("Error processing the file.");
        console.error(error);
        console.log("error parsing file");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

