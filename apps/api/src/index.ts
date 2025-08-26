import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

// Initialize Prisma
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Import routers
import authRouter from './routes/auth';
import organizationRouter from './routes/organizations';
import vehicleRouter from './routes/vehicles';
import mediaRouter from './routes/media';
import feedRouter from './routes/feeds';
import syndicationRouter from './routes/syndication';
import analyticsRouter from './routes/analytics';
import webhookRouter from './routes/webhooks';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { tenantMiddleware } from './middleware/tenant';
import { authMiddleware } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images/videos from CDN
}));

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    const allowedOrigins = [
      'http://localhost:3001', // React dev server
      'http://localhost:3002', // Public site
      /^https:\/\/.*\.autolens\.io$/, // Production subdomains
    ];
    
    const allowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) return allowed.test(origin);
      return allowed === origin;
    });
    
    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Public routes (no auth required)
app.use('/api/auth', authRouter);
app.use('/api/webhooks', webhookRouter); // Webhook endpoints need special handling

// Protected routes (auth required)
app.use('/api/*', authMiddleware);
app.use('/api/*', tenantMiddleware);

// API routes
app.use('/api/organizations', organizationRouter);
app.use('/api/vehicles', vehicleRouter);
app.use('/api/media', mediaRouter);
app.use('/api/feeds', feedRouter);
app.use('/api/syndication', syndicationRouter);
app.use('/api/analytics', analyticsRouter);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AutoLens API server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});