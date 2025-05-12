import express from 'express';
import serverless from 'serverless-http';

// route imports go here

const app = express();
app.use(express.json());

// route mounts go here

app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

export default serverless(app);