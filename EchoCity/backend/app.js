import { configDotenv } from 'dotenv';
import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/events.js';
import artistsRoutes from './routes/artists.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import { authenticateJWT } from './middleware/auth.js';
import cookieParser from 'cookie-parser';

configDotenv();

const app = express();

const origin = process.env.NODE_ENV === 'production'
            ? process.env.DATABASE_URL
            : process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: origin,
    credentials: true,
}));

app.use(authenticateJWT);

app.use('/api/events', eventRoutes);
app.use('/api/artists', artistsRoutes);
app.use('/auth', authRoutes);
app.use('/api/users', usersRoutes);

export default app;