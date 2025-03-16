import express from 'express';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

config();

// Dapatkan __dirname di ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
// Menyajikan folder public sebagai file statis
app.use(express.static(path.join(__dirname, 'src')));

import courseRouter from './src/routes/course.js';
app.use(courseRouter);

import authRouter from './src/routes/auth.js';
app.use(authRouter);

import multerRouter from './src/routes/multer.js';
app.use(multerRouter);

app.listen(process.env.PORT, () => {
    console.log(`Running in port ${process.env.PORT}`);
});