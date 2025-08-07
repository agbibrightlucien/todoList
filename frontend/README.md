# TodoFlow Frontend

A modern React frontend for the TodoFlow application, built with Vite and featuring comprehensive environment configuration, theming, and authentication.

## 🚀 Features

- ✅ **React 18** with modern hooks and context
- ⚡ **Vite** for fast development and building
- 🎨 **Custom CSS Design System** with multiple themes
- 🔐 **JWT Authentication** with automatic token handling
- 🌙 **Dark/Light Mode** with system preference detection
- 📱 **Responsive Design** for all device sizes
- 🛠️ **Development Tools** with environment validation
- 🔧 **Environment Configuration** for all deployment scenarios

## 🔧 Prerequisites

- Node.js (v14 or higher)
- Backend API running (see backend README)

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   # Edit the .env file with your configuration
   ```
   
   **Required variables:**
   - `VITE_API_BASE_URL` - Backend API URL (default: `http://localhost:5000/api`)
   
   See [ENV_CONFIG.md](./ENV_CONFIG.md) for complete configuration guide.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for production with environment
npm run build:prod

# Preview production build
npm run preview

# Lint code
npm run lint

# Check environment configuration
npm run check-env
```

### Development Features

- **Hot Module Replacement** for instant updates
- **Environment Display** overlay in development mode
- **API Testing** tools built-in
- **Configuration Validation** on startup
- **Smart Logging** with environment awareness

## 🎨 Theming

The application supports multiple color themes and dark/light modes:

- **Themes**: Blue, Green, Purple, Sunset
- **Dark Mode**: Automatic system detection or manual toggle
- **Persistence**: Theme preferences saved to localStorage
- **CSS Variables**: Easy customization and extension

## 🔐 Authentication

- **JWT-based** authentication with automatic token handling
- **Persistent Sessions** with secure token storage
- **Auto-refresh** and expiry handling
- **Password Reset** with email support (if backend configured)

## 📱 Responsive Design

- **Mobile-first** approach
- **Tablet** and desktop optimized
- **Touch-friendly** interface
- **Accessibility** features included

## 🛡️ Environment Configuration

### Development Setup
```env
VITE_APP_ENVIRONMENT=development
VITE_API_BASE_URL=http://localhost:5000/api
VITE_DEBUG_MODE=true
VITE_DEFAULT_THEME=blue
```

### Production Setup
```env
VITE_APP_ENVIRONMENT=production
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_DEBUG_MODE=false
VITE_DEFAULT_THEME=blue
```

## 🔧 Configuration Features

- **Centralized Configuration** - All settings in one place
- **Environment Validation** - Automatic validation on startup
- **Smart Storage** - Prefixed localStorage with expiry
- **Feature Flags** - Enable/disable features per environment
- **Performance Tuning** - Configurable timeouts and delays

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Auth.jsx        # Authentication forms
│   ├── TodoApp.jsx     # Main todo interface
│   ├── Header.jsx      # Navigation header
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.jsx # Authentication state
│   └── ThemeContext.jsx # Theme management
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── config/             # Configuration management
│   └── environment.js  # Environment configuration
├── constants/          # Application constants
└── App.css            # Global styles
```

## 🛠️ API Integration

The frontend connects to the backend API with:

- **Axios HTTP Client** with interceptors
- **Automatic Token Injection** for authenticated requests
- **Error Handling** with automatic logout on 401
- **Request/Response Logging** in development
- **Configurable Timeouts** and retry logic

## 🔄 State Management

- **React Context** for global state (auth, theme)
- **Local Component State** for UI state
- **localStorage Integration** for persistence
- **Optimistic Updates** for better UX

## 🚀 Building & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build:prod
```

### Environment-Specific Builds
```bash
# Custom environment
VITE_APP_ENVIRONMENT=staging npm run build
```

### Deployment Checklist

- [ ] Set production API URL
- [ ] Disable debug mode
- [ ] Configure CORS origins on backend
- [ ] Test all authentication flows
- [ ] Verify theme persistence
- [ ] Check mobile responsiveness

## 🔍 Debugging

### Development Tools

- **Environment Display** - Shows configuration in development
- **API Test Button** - Test backend connectivity
- **Configuration Copy** - Copy settings for debugging
- **Console Logging** - Structured logging with prefixes

### Common Issues

1. **API Connection Failed**
   - Check `VITE_API_BASE_URL` configuration
   - Ensure backend server is running
   - Verify CORS settings

2. **Authentication Issues**
   - Clear localStorage and try again
   - Check token expiry settings
   - Verify JWT secret matches backend

3. **Theme Not Saving**
   - Check localStorage permissions
   - Verify storage keys configuration
   - Clear browser cache if needed

## 📄 Environment Variables

See [ENV_CONFIG.md](./ENV_CONFIG.md) for complete documentation of all environment variables and configuration options.

## 🔧 Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 19.1.0 |
| Vite | Build Tool | 7.0.4 |
| Axios | HTTP Client | 1.10.0 |
| Lucide React | Icons | 0.525.0 |
| CSS Variables | Theming | Native |

## 📞 Support

For issues with the frontend:

1. Check the browser console for errors
2. Use the environment display in development
3. Test API connectivity with built-in tools
4. Verify environment configuration
5. Check the [ENV_CONFIG.md](./ENV_CONFIG.md) guide
