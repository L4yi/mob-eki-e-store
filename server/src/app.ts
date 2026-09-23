import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes';
import { errorHandler } from './middleware/validateAndErrors';

export const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost and local dev origins
      if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true); // Can restrict to production domain in deployment
      }
    },
    credentials: true,
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health & Info Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    storeName: 'M.O.B EKI VENTURES',
    location: '2, Amu Street, Mushin Market, Lagos, Nigeria',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Master API Routes
app.use('/api', apiRoutes);

// Centralized Secure Error Handler
app.use(errorHandler);
