import express from 'express';
import { config } from 'dotenv';

config();

const app = express();
app.use(express.json());

import courseRouter from './src/routes/course.js';
app.use(courseRouter);

app.listen(process.env.PORT, () => {
    console.log(`Running in port ${process.env.PORT}`);
});