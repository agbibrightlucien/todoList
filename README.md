
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


## 🔌 API Endpoints (Key)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/todos` | Get all todos |
| GET    | `/api/todos/:id` | Get specific todo |
| POST   | `/api/todos` | Create new todo |
| PUT    | `/api/todos/:id` | Update todo |
| DELETE | `/api/todos/:id` | Delete todo |
| PATCH  | `/api/todos/:id/toggle` | Toggle completion |
| POST   | `/api/todos/:id/subtasks` | Add subtask |
| PATCH  | `/api/todos/:id/subtasks/:subtaskId/toggle` | Toggle subtask |
| PUT    | `/api/todos/:id/subtasks/:subtaskId` | Update subtask |
| DELETE | `/api/todos/:id/subtasks/:subtaskId` | Delete subtask |
| PATCH  | `/api/todos/:id/subtasks/bulk` | Bulk subtask ops |


## 🎯 Usage

1. **Start both servers** - Backend on port 5000, Frontend on port 5173
2. **Open your browser** - Navigate to `http://localhost:5173`
3. **Login or register** - Secure authentication required
4. **Add todos** - Click "Add New Todo" to create tasks
5. **Manage todos** - Edit, delete, complete, or add subtasks
6. **Organize** - Use categories, priorities, and due dates
7. **Subtasks** - Expand a todo to add/check subtasks, see progress bar
8. **Bulk subtask actions** - Select multiple subtasks to complete/delete
9. **Filter & search** - Use the search bar and filters to organize
10. **Switch themes** - Click the palette icon in the header for dark mode & color themes

## 📱 Features in Detail


### Todo Management
- **Add todos** with title, description, priority, due date, and category
- **Edit todos** by clicking the edit icon
- **Delete todos** with confirmation
- **Toggle completion** by clicking the checkbox
- **Add subtasks** to any todo (checklist style)
- **Bulk complete/delete subtasks**


### Filtering & Search
- **Search** by title or description
- **Filter by status** - All, Active, or Completed
- **Filter by priority** - All, High, Medium, or Low
- **Filter by category** - Work, Personal, Shopping, etc


### Visual Indicators & Themes
- **Priority colors** - Red (high), Yellow (medium), Green (low)
- **Category badges** - Color-coded for each category
- **Overdue indicators** - Red warning for past due dates
- **Completion styling** - Strikethrough and muted colors
- **Subtask progress bar** - See % complete at a glance
- **Dark mode & color themes** - Toggle in header, auto-detects system


## 🎨 Themes & Dark Mode

- **Switch themes**: Click the palette icon in the header
- **Dark mode**: Toggle in theme settings or with the moon/sun icon
- **Theme persistence**: Remembers your choice across sessions
- **System detection**: Follows your OS preference by default

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
