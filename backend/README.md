# TodoFlow Backend API

A robust Node.js Express API for managing todos with MongoDB, featuring authentication, email notifications, and comprehensive environment configuration.

## 🚀 Features

- ✅ Complete CRUD operations for todos
- 🔐 JWT-based authentication system
- 📧 Password reset via email
- 🏷️ Priority levels and due dates
- 📝 Subtasks and categories support
- 🔒 Secure password hashing with bcrypt
- 🌐 CORS enabled for frontend integration
- ⚙️ Comprehensive environment configuration
- 🛡️ Request validation and error handling

## 🔧 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- SMTP email service (for password reset functionality)

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
   - `JWT_SECRET` - JWT signing secret (minimum 32 characters)
   - `MONGODB_URI` - MongoDB connection string
   
   See [ENV_CONFIG.md](./ENV_CONFIG.md) for complete configuration guide.

3. **Validate your configuration:**
   ```bash
   npm run validate-env
   ```

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Run the application:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Todos

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion status

### Todo Schema

```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "completed": "boolean (default: false)",
  "priority": "string (low/medium/high, default: medium)",
  "dueDate": "date (optional)",
  "createdAt": "date (auto-generated)",
  "updatedAt": "date (auto-updated)"
}
```

## Example Usage

### Create a todo:
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Node.js", "description": "Complete the tutorial", "priority": "high"}'
```

### Get all todos:
```bash
curl http://localhost:5000/api/todos
```

### Update a todo:
```bash
curl -X PUT http://localhost:5000/api/todos/[todo-id] \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```
