const express = require('express');
const multer = require('multer');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' }); // Temporary upload directory

// Register routes
const calendarParser = require('./uploads/calendarParser.js'); // Import calendar routes
app.use('/calendar', calendarParser); // Delegate calendar-related routes to calendarParser.js
// /upload_cal accessible through /calendar
// more specifically, /upload_cal available at localhost:5000/calendar/upload_cal

app.get('/', (req, res) => {
    res.send("hi");
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});