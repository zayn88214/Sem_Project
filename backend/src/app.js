import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import diseaseRoutes from './routes/disease.routes.js';
import cropRoutes from './routes/crop.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

// Import database
import { connectDB } from './config/database.js';

import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Attach io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ==================== MIDDLEWARE ====================

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use(morgan('combined'));
app.use(requestLogger);

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    message: 'AGROCORE Backend API is running'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/admin', adminRoutes);

// ==================== 404 HANDLER ====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// ==================== ERROR HANDLER ====================

app.use(errorHandler);

// ==================== DATABASE CONNECTION ====================

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✓ MongoDB connected successfully');

    // Socket.io connection handling
    io.on('connection', (socket) => {
      console.log('⚡ User connected:', socket.id);
      socket.on('disconnect', () => {
        console.log('🔥 User disconnected:', socket.id);
      });
    });

    // Start Express server
    server.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║   AGROCORE - Backend API Server Running    ║
╠════════════════════════════════════════════╣
║ Port:     ${PORT.toString().padEnd(33)}║
║ Env:      ${(process.env.NODE_ENV || 'development').padEnd(31)}║
║ Status:   READY                            ║
╚════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('✗ Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

export default app;
