import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';





dotenv.config();

const app = express();
app.use(express.json());
// Enable CORS for all routes
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

// Connect to DB
mongoose
  .connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

export default app;
