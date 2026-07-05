const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB(); // Uncomment when MongoDB is running

const app = express();

// Enable CORS
app.use(cors());

// HTTP request logging (only in development or if explicitly needed)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Security Middlewares
// Set security headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow cross-origin images/resources
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prevent XSS attacks
// app.use(xss()); // Commented out due to compatibility issues with Node 22 (Cannot set property query of #<IncomingMessage>)

// Sanitize data (prevent NoSQL injection)
// app.use(mongoSanitize()); // Commented out due to compatibility issues with Node 22

// Rate limiting (Login)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
});
app.use('/api/v1/auth/login', loginLimiter);

// General rate limiting for other API routes
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000 // Limit each IP to 1000 requests per windowMs
});
app.use('/api/', apiLimiter);


// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes (to be mounted)
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/notices', require('./routes/noticeRoutes'));
app.use('/api/v1/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/v1/affiliations', require('./routes/affiliationRoutes'));
app.use('/api/v1/students', require('./routes/studentRoutes'));
app.use('/api/v1/media', require('./routes/uploadRoutes'));
app.use('/api/v1/activities', require('./routes/activityRoutes'));
app.use('/api/v1/notifications', require('./routes/notificationRoutes'));
app.use('/api/v1/assignments', require('./routes/assignmentRoutes'));
app.use('/api/v1/study-materials', require('./routes/studyMaterialRoutes'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Any route that is not API will be redirected to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to DBGI CMS API (Development Mode)' });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Server Error', 
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
