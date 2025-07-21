# Todo List Application

A full-stack todo list application built with React + Vite frontend and Node.js + Express + MongoDB backend.

## 🚀 Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as completed/incomplete
- ✅ Set priority levels (low, medium, high)
- ✅ Set due dates with overdue indicators
- ✅ Search and filter todos
- ✅ Responsive design with Tailwind CSS
- ✅ Real-time statistics

## 📁 Project Structure

```
todoList/
├── backend/           # Node.js + Express API
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── server.js      # Main server file
│   └── package.json
└── frontend/          # React + Vite app
    ├── src/
    │   ├── components/    # React components
    │   ├── services/      # API service
    │   └── App.jsx        # Main app component
    └── package.json
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Update `.env` file with your MongoDB connection string
   - Default: `mongodb://localhost:27017/todolist`

4. Start MongoDB (if using local):
```bash
mongod
```

5. Start the backend server:
```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

Backend runs on: `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos/:id` | Get specific todo |
| POST | `/api/todos` | Create new todo |
| PUT | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |
| PATCH | `/api/todos/:id/toggle` | Toggle completion |

## 🎯 Usage

1. **Start both servers** - Backend on port 5000, Frontend on port 5173
2. **Open your browser** - Navigate to `http://localhost:5173`
3. **Add todos** - Click "Add New Todo" to create tasks
4. **Manage todos** - Check off completed items, edit, or delete
5. **Filter & search** - Use the search bar and filters to organize

## 📱 Features in Detail

### Todo Management
- **Add todos** with title, description, priority, and due date
- **Edit todos** by clicking the edit icon
- **Delete todos** with confirmation
- **Toggle completion** by clicking the checkbox

### Filtering & Search
- **Search** by title or description
- **Filter by status** - All, Active, or Completed
- **Filter by priority** - All, High, Medium, or Low

### Visual Indicators
- **Priority colors** - Red (high), Yellow (medium), Green (low)
- **Overdue indicators** - Red warning for past due dates
- **Completion styling** - Strikethrough and muted colors

## 🔧 Configuration

### Environment Variables (Backend)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todolist
```

### MongoDB Atlas (Production)
Replace the `MONGODB_URI` in `.env` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todolist?retryWrites=true&w=majority
```

## 🚀 Deployment

### Backend Deployment
- Deploy to platforms like Heroku, Railway, or Vercel
- Set environment variables in your hosting platform
- Ensure MongoDB Atlas connection for production

### Frontend Deployment
- Build the app: `npm run build`
- Deploy the `dist` folder to Netlify, Vercel, or similar
- Update API base URL in `src/services/api.js` for production

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or Atlas connection is correct
   - Check the connection string in `.env`

2. **CORS Errors**
   - Backend includes CORS middleware for cross-origin requests
   - Ensure frontend URL is allowed

3. **API Connection Issues**
   - Verify backend is running on port 5000
   - Check API base URL in frontend service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy Todo Managing! 🎉**
