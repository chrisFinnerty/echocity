import { configDotenv } from 'dotenv';
import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/events.js';

configDotenv();

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use('/api/events', eventRoutes);

export default app;