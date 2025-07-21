# Todo List Backend

A simple Node.js Express API for managing todos with MongoDB.

## Features

- Create, read, update, and delete todos
- Mark todos as completed/incomplete
- Set priority levels (low, medium, high)
- Set due dates
- CORS enabled for frontend integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env` file and update the MongoDB connection string if needed
   - Default: `mongodb://localhost:27017/todolist`

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
