import { configDotenv } from 'dotenv';
import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/events.js';
import artistsRoutes from './routes/artists.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import favoritesRoutes from './routes/favorites.js';
import userEvents from './routes/userEvents.js';
import { authenticateJWT } from './middleware/auth.js';
import cookieParser from 'cookie-parser';

configDotenv();

const app = express();

const origin = process.env.NODE_ENV === 'production'
            ? process.env.PRODUCTION_URL
            : process.env.FRONTEND_URL || 'http://localhost:5173'
console.log('CORS origin set to:', origin);

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
app.use('/api/favorites', favoritesRoutes);
app.use('/api/userEvents', userEvents);



export default app;