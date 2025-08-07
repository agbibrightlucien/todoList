/**
 * Environment Configuration Module
 * Centralizes all environment variable handling and validation
 */

const path = require('path');

// Load environment variables
require('dotenv').config();

// Environment configuration object
const config = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 5000,
  
  // Frontend Configuration
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  
  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/todolist',
  
  // Authentication & Security
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
  RESET_TOKEN_EXPIRY_MINUTES: parseInt(process.env.RESET_TOKEN_EXPIRY_MINUTES) || 10,
  
  // Email Configuration
  EMAIL: {
    HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    PORT: parseInt(process.env.EMAIL_PORT) || 587,
    SECURE: process.env.EMAIL_SECURE === 'true',
    USER: process.env.EMAIL_USER,
    PASS: process.env.EMAIL_PASS,
    FROM: process.env.EMAIL_FROM || 'TodoFlow <noreply@todoflow.com>'
  },
  
  // API Configuration
  API_PREFIX: process.env.API_PREFIX || '/api',
  REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT) || 30000,
  MAX_REQUEST_SIZE: process.env.MAX_REQUEST_SIZE || '10mb',
  
  // Development flags
  isDevelopment: () => config.NODE_ENV === 'development',
  isProduction: () => config.NODE_ENV === 'production',
  isTesting: () => config.NODE_ENV === 'test'
};

/**
 * Validate required environment variables
 */
function validateEnvironment() {
  const requiredVars = [];
  const warnings = [];
  
  // Critical environment variables
  if (!config.JWT_SECRET) {
    requiredVars.push('JWT_SECRET');
  } else if (config.JWT_SECRET.length < 32) {
    warnings.push('JWT_SECRET should be at least 32 characters long for security');
  }
  
  if (!config.MONGODB_URI) {
    requiredVars.push('MONGODB_URI');
  }
  
  // Production-specific validations
  if (config.isProduction()) {
    if (config.JWT_SECRET === 'your_super_secret_jwt_key_change_this_in_production_12345678900987654321') {
      requiredVars.push('JWT_SECRET (must be changed from default in production)');
    }
    
    if (!config.EMAIL.USER || !config.EMAIL.PASS) {
      warnings.push('Email configuration (EMAIL_USER, EMAIL_PASS) should be set for password reset functionality');
    }
  }
  
  // Development warnings
  if (config.isDevelopment()) {
    if (!config.EMAIL.USER || !config.EMAIL.PASS) {
      warnings.push('Email configuration not set - password reset will not work');
    }
  }
  
  // Display validation results
  if (requiredVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    requiredVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('Please check your .env file and ensure all required variables are set.');
    process.exit(1);
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️  Environment warnings:');
    warnings.forEach(warning => {
      console.warn(`   - ${warning}`);
    });
  }
  
  console.log('✅ Environment configuration validated successfully');
}

/**
 * Display environment configuration summary
 */
function displayConfig() {
  if (config.isDevelopment()) {
    console.log('\n📋 Environment Configuration:');
    console.log(`   NODE_ENV: ${config.NODE_ENV}`);
    console.log(`   PORT: ${config.PORT}`);
    console.log(`   FRONTEND_URL: ${config.FRONTEND_URL}`);
    console.log(`   MONGODB_URI: ${config.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    console.log(`   JWT_EXPIRES_IN: ${config.JWT_EXPIRES_IN}`);
    console.log(`   BCRYPT_SALT_ROUNDS: ${config.BCRYPT_SALT_ROUNDS}`);
    console.log(`   EMAIL_HOST: ${config.EMAIL.HOST}`);
    console.log(`   EMAIL_USER: ${config.EMAIL.USER ? '***' : 'Not set'}`);
    console.log(`   CORS_ORIGINS: ${config.ALLOWED_ORIGINS.join(', ')}`);
  }
}

module.exports = {
  config,
  validateEnvironment,
  displayConfig
};
