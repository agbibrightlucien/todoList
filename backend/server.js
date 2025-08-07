const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { config, validateEnvironment, displayConfig } = require('./config/environment');

// Validate environment before starting
validateEnvironment();

const app = express();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (config.ALLOWED_ORIGINS.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: config.MAX_REQUEST_SIZE }));
app.use(express.urlencoded({ extended: true, limit: config.MAX_REQUEST_SIZE }));

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI, {
  serverSelectionTimeoutMS: config.REQUEST_TIMEOUT,
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  displayConfig(); // Show configuration summary
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.log('🔍 Check your internet connection and MongoDB credentials');
  process.exit(1); // Exit if can't connect to database
});

// Request timeout middleware
app.use((req, res, next) => {
  res.setTimeout(config.REQUEST_TIMEOUT, () => {
    res.status(408).json({ message: 'Request timeout' });
  });
  next();
});

// Routes
const todoRoutes = require('./routes/todos');
const authRoutes = require('./routes/auth');
app.use(`${config.API_PREFIX}/todos`, todoRoutes);
app.use(`${config.API_PREFIX}/auth`, authRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'TodoFlow API is running!',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString(),
    frontend: config.FRONTEND_URL,
    version: '1.0.0'
  });
});

// API info route
app.get(`${config.API_PREFIX}`, (req, res) => {
  res.json({
    message: 'TodoFlow API v1.0',
    endpoints: {
      auth: `${config.API_PREFIX}/auth`,
      todos: `${config.API_PREFIX}/todos`
    },
    docs: 'See README.md for API documentation'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err.stack);
  
  // Don't leak error details in production
  const message = config.isProduction() 
    ? 'Something went wrong!' 
    : err.message;
    
  res.status(500).json({ message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Endpoint not found',
    availableEndpoints: ['/', `${config.API_PREFIX}/auth`, `${config.API_PREFIX}/todos`]
  });
});

app.listen(config.PORT, () => {
  console.log(`🚀 TodoFlow Backend Server running on port ${config.PORT}`);
  console.log(`📱 Frontend URL: ${config.FRONTEND_URL}`);
  console.log(`🔧 Environment: ${config.NODE_ENV}`);
  console.log(`📡 CORS Origins: ${config.ALLOWED_ORIGINS.join(', ')}`);
});
