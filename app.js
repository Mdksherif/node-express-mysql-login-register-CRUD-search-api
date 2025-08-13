require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

// Static file serving for local storage fallback
app.use('/uploads', express.static('uploads'));

// Rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: { message: 'Too many authentication attempts, try again later' }
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: { message: 'Too many requests, try again later' }
});

app.use('/auth', authLimiter, require('./routes/authRoutes'));
app.use('/users', generalLimiter, require('./routes/userRoutes'));
app.use('/products', generalLimiter, require('./routes/productRoutes'));
app.use('/createProducts', generalLimiter, require('./routes/productRoutes'));
app.use('/search', generalLimiter, require('./routes/searchRoutes'));

// Global error handler
app.use(require('./middleware/errorHandler'));

module.exports = app;
