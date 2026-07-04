require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

connectDB();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use('/api/', limiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Smart Recruitment Portal API is active.',
    version: '1.0.0'
  });
});

app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  next(error);
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
