# TodoFlow Backend - Environment Configuration Guide

This document explains how to configure environment variables for the TodoFlow backend.

## 📋 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for JWT token signing (min 32 chars) | `your_super_secret_jwt_key_change_this_in_production_12345678900987654321` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/todolist` |

### Server Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Port for the server to listen on |
| `NODE_ENV` | `development` | Environment mode (`development`, `production`, `test`) |
| `API_PREFIX` | `/api` | API route prefix |
| `REQUEST_TIMEOUT` | `30000` | Request timeout in milliseconds |
| `MAX_REQUEST_SIZE` | `10mb` | Maximum request body size |

### Frontend & CORS

| Variable | Default | Description |
|----------|---------|-------------|
| `FRONTEND_URL` | `http://localhost:5173` | Frontend application URL |
| `ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173` | Comma-separated CORS origins |

### Authentication & Security

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_EXPIRES_IN` | `7d` | JWT token expiration time |
| `BCRYPT_SALT_ROUNDS` | `12` | Bcrypt salt rounds for password hashing |
| `RESET_TOKEN_EXPIRY_MINUTES` | `10` | Password reset token expiry in minutes |

### Email Configuration (Optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `EMAIL_HOST` | `smtp.gmail.com` | SMTP server hostname |
| `EMAIL_PORT` | `587` | SMTP server port |
| `EMAIL_SECURE` | `false` | Use secure connection (true/false) |
| `EMAIL_USER` | - | SMTP username/email |
| `EMAIL_PASS` | - | SMTP password/app password |
| `EMAIL_FROM` | `TodoFlow <noreply@todoflow.com>` | Email sender address |

## 🚀 Quick Start

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file:**
   - Set a strong `JWT_SECRET` (minimum 32 characters)
   - Configure your `MONGODB_URI`
   - Set up email credentials if you want password reset functionality

3. **Validate your configuration:**
   ```bash
   npm run validate-env
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

## 🔧 Configuration Examples

### Development Setup
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/todolist
JWT_SECRET=dev_secret_key_at_least_32_characters_long_123456789
```

### Production Setup
```env
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://your-app.com
ALLOWED_ORIGINS=https://your-app.com,https://www.your-app.com
MONGODB_URI=mongodb+srv://prod_user:prod_pass@cluster.mongodb.net/todolist_prod
JWT_SECRET=production_secret_key_minimum_32_characters_long_and_secure
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🔐 Security Best Practices

### JWT Secret
- **Development**: Use a random string with at least 32 characters
- **Production**: Use a cryptographically secure random string
- **Never** commit secrets to version control

### MongoDB URI
- Use MongoDB Atlas for production
- Restrict IP access in MongoDB Atlas
- Use strong passwords
- Enable authentication

### Email Configuration
- Use app-specific passwords for Gmail
- Store credentials securely
- Consider using environment-specific email services

## 🛠️ Validation & Debugging

### Environment Validation
Run the validation script to check your configuration:
```bash
npm run validate-env
```

### Common Issues

1. **JWT_SECRET too short**
   ```
   ⚠️ JWT_SECRET should be at least 32 characters long for security
   ```

2. **Missing MongoDB URI**
   ```
   ❌ Missing required environment variables: MONGODB_URI
   ```

3. **Email not configured**
   ```
   ⚠️ Email configuration not set - password reset will not work
   ```

### Debug Mode
In development, the server displays a configuration summary showing:
- Environment variables (with sensitive data masked)
- Database connection status
- CORS origins
- Email configuration status

## 🌍 Environment-Specific Configurations

### Development
- Detailed error messages
- Configuration summary displayed
- Relaxed security for easier debugging

### Production
- Minimal error messages
- No configuration summary
- Enhanced security checks
- Strict CORS policy

### Testing
- Isolated test database
- Shorter token expiry for faster tests
- Mock email service

## 📄 Environment File Template

```env
# ==============================================
# TODO FLOW - BACKEND ENVIRONMENT CONFIGURATION
# ==============================================

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173

# Database Configuration
MONGODB_URI=your_mongodb_connection_string_here

# Authentication & Security
JWT_SECRET=your_jwt_secret_minimum_32_characters_long
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
RESET_TOKEN_EXPIRY_MINUTES=10

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=TodoFlow <noreply@todoflow.com>

# API Configuration
API_PREFIX=/api
REQUEST_TIMEOUT=30000
MAX_REQUEST_SIZE=10mb
```

## 🔄 Environment Variable Updates

After updating environment variables:

1. **Development**: Restart the dev server (`Ctrl+C` then `npm run dev`)
2. **Production**: Restart the production server
3. **Validation**: Run `npm run validate-env` to verify changes

## 📞 Support

If you encounter issues with environment configuration:

1. Run `npm run validate-env` to identify problems
2. Check the server logs for detailed error messages
3. Verify your `.env` file syntax
4. Ensure all required variables are set
