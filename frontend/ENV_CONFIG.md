# TodoFlow Frontend - Environment Configuration Guide

This document explains how to configure environment variables for the TodoFlow frontend.

## 📋 Environment Variables Reference

### Required Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

### Application Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_APP_NAME` | `TodoFlow` | Application name displayed in UI |
| `VITE_APP_VERSION` | `1.0.0` | Application version |
| `VITE_APP_ENVIRONMENT` | `development` | Environment mode (`development`, `production`, `test`) |
| `VITE_API_TIMEOUT` | `30000` | API request timeout in milliseconds |

### Authentication & Storage

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_TOKEN_STORAGE_KEY` | `todoflow_token` | Local storage key for auth token |
| `VITE_USER_STORAGE_KEY` | `todoflow_user` | Local storage key for user data |
| `VITE_TOKEN_REFRESH_THRESHOLD` | `300000` | Token refresh threshold (5 minutes) |
| `VITE_STORAGE_PREFIX` | `todoflow_` | Prefix for all localStorage keys |
| `VITE_CACHE_EXPIRY` | `86400000` | Cache expiry time (24 hours) |

### Theme Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_DEFAULT_THEME` | `blue` | Default color theme |
| `VITE_THEME_STORAGE_KEY` | `todoflow_theme` | Storage key for theme preference |
| `VITE_DARK_MODE_STORAGE_KEY` | `todoflow_dark_mode` | Storage key for dark mode preference |

### Development Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_DEBUG_MODE` | `true` | Enable debug logging and tools |
| `VITE_ENABLE_CONSOLE_LOGS` | `true` | Enable console logging |

### Feature Flags

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_ENABLE_EMAIL_RESET` | `true` | Enable password reset via email |
| `VITE_ENABLE_SUBTASKS` | `true` | Enable subtasks functionality |
| `VITE_ENABLE_CATEGORIES` | `true` | Enable todo categories |
| `VITE_ENABLE_THEMES` | `true` | Enable theme customization |

### Performance Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_DEBOUNCE_DELAY` | `300` | Debounce delay for search (ms) |
| `VITE_SEARCH_MIN_LENGTH` | `2` | Minimum search query length |
| `VITE_AUTO_SAVE_DELAY` | `1000` | Auto-save delay (ms) |

## 🚀 Quick Start

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file:**
   - Set your backend API URL in `VITE_API_BASE_URL`
   - Customize other settings as needed

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🔧 Configuration Examples

### Development Setup
```env
VITE_APP_ENVIRONMENT=development
VITE_API_BASE_URL=http://localhost:5000/api
VITE_DEBUG_MODE=true
VITE_ENABLE_CONSOLE_LOGS=true
VITE_DEFAULT_THEME=blue
```

### Production Setup
```env
VITE_APP_ENVIRONMENT=production
VITE_API_BASE_URL=https://api.your-domain.com/api
VITE_DEBUG_MODE=false
VITE_ENABLE_CONSOLE_LOGS=false
VITE_DEFAULT_THEME=blue
```

### Testing Setup
```env
VITE_APP_ENVIRONMENT=test
VITE_API_BASE_URL=http://localhost:5001/api
VITE_DEBUG_MODE=true
VITE_ENABLE_CONSOLE_LOGS=false
```

## 🛠️ Environment Configuration Features

### 1. **Centralized Configuration** (`src/config/environment.js`)
- All environment variables in one place
- Type conversion and validation
- Environment-specific defaults
- Runtime validation

### 2. **Smart Storage System** (`storage` utility)
- Prefixed localStorage keys
- Automatic expiry handling
- Error handling
- Legacy compatibility

### 3. **Intelligent Logging** (`logger` utility)
- Environment-aware logging
- Configurable log levels
- Prefixed log messages
- Production safety

### 4. **Development Tools**
- Environment display overlay (development only)
- Configuration copying
- API connectivity testing
- Runtime validation

## 🔐 Security Best Practices

### Environment Variables
- **Never** commit sensitive data to `.env` files
- Use different configurations for different environments
- Keep production API URLs secure
- Validate environment variables at runtime

### API Configuration
- Use HTTPS in production
- Implement proper CORS on backend
- Set appropriate timeouts
- Handle API errors gracefully

### Storage
- Use prefixed localStorage keys
- Implement cache expiry
- Clear sensitive data on logout
- Handle storage errors

## 🛡️ Environment Validation

The frontend automatically validates environment configuration on startup:

### Validation Checks
- ✅ Required variables are present
- ✅ API URL format is valid
- ⚠️ Development settings in production
- ⚠️ Production URLs in development

### Error Handling
- **Errors**: Stop application startup
- **Warnings**: Log to console, continue startup
- **Debug Info**: Show configuration summary (development only)

## 📱 Development Features

### Environment Display Overlay
In development mode with debug enabled, a small overlay shows:
- Current environment
- API URL
- Theme settings
- Configuration copy button
- API test button

### Console Logging
Intelligent logging system that:
- Respects environment settings
- Prefixes all messages
- Supports different log levels
- Automatically disabled in production

### Configuration Testing
Built-in tools to:
- Test API connectivity
- Copy configuration for debugging
- Validate environment setup
- Monitor storage usage

## 🔄 Environment Switching

### Local Development
```bash
# Start with development settings
npm run dev

# Build for production
npm run build:prod

# Preview production build
npm run preview
```

### Environment-Specific Commands
```bash
# Development build
VITE_APP_ENVIRONMENT=development npm run build

# Production build
VITE_APP_ENVIRONMENT=production npm run build

# Testing build
VITE_APP_ENVIRONMENT=test npm run build
```

## 📄 Environment File Template

```env
# ==============================================
# TODO FLOW - FRONTEND ENVIRONMENT CONFIGURATION
# ==============================================

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000

# Application Configuration
VITE_APP_NAME=TodoFlow
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development

# Authentication Configuration
VITE_TOKEN_STORAGE_KEY=todoflow_token
VITE_USER_STORAGE_KEY=todoflow_user
VITE_TOKEN_REFRESH_THRESHOLD=300000

# Theme Configuration
VITE_DEFAULT_THEME=blue
VITE_THEME_STORAGE_KEY=todoflow_theme
VITE_DARK_MODE_STORAGE_KEY=todoflow_dark_mode

# Local Storage Configuration
VITE_STORAGE_PREFIX=todoflow_
VITE_CACHE_EXPIRY=86400000

# Development Configuration
VITE_DEBUG_MODE=true
VITE_ENABLE_CONSOLE_LOGS=true

# Feature Flags
VITE_ENABLE_EMAIL_RESET=true
VITE_ENABLE_SUBTASKS=true
VITE_ENABLE_CATEGORIES=true
VITE_ENABLE_THEMES=true

# Performance Configuration
VITE_DEBOUNCE_DELAY=300
VITE_SEARCH_MIN_LENGTH=2
VITE_AUTO_SAVE_DELAY=1000
```

## 🔧 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check `VITE_API_BASE_URL` is correct
   - Ensure backend server is running
   - Verify CORS configuration

2. **Environment Variables Not Loading**
   - Ensure variables start with `VITE_`
   - Restart development server after changes
   - Check `.env` file syntax

3. **Theme Not Persisting**
   - Check localStorage permissions
   - Verify storage keys in configuration
   - Clear browser cache if needed

4. **Debug Mode Not Working**
   - Ensure `VITE_DEBUG_MODE=true`
   - Check `VITE_ENABLE_CONSOLE_LOGS=true`
   - Verify environment is development

## 📞 Support

For environment configuration issues:

1. Check the browser console for validation messages
2. Use the environment display overlay in development
3. Test API connectivity with built-in tools
4. Verify all required variables are set
