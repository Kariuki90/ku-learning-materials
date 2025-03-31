# KU Learning Materials Platform

A modern web platform for sharing and accessing learning materials at Kenyatta University.

## Features

- 📚 Learning Materials Management
  - Upload and share course materials
  - Search and filter materials by course, faculty, or department
  - Download tracking and analytics
  - Rating and review system

- 💬 Discussion Forum
  - Course-specific discussions
  - Real-time notifications
  - Like and reply functionality
  - Rich text formatting

- 👥 User Management
  - Student and lecturer profiles
  - Role-based access control
  - Activity tracking
  - Profile customization

- 🎨 Modern UI/UX
  - Responsive design
  - Dark/Light mode
  - Quick actions menu
  - Search suggestions

## Tech Stack

- Frontend:
  - React with TypeScript
  - Tailwind CSS
  - React Router
  - Axios

- Backend:
  - Node.js with Express
  - MongoDB
  - JWT Authentication
  - Multer for file uploads

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Kariuki90/ku-learning-materials.git
cd ku-learning-materials
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000

# Backend (.env)
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm start
```

## Project Structure

```
ku-learning-materials/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── backend/
    ├── src/
    │   ├── controllers/   # Route controllers
    │   ├── models/        # Database models
    │   ├── routes/        # API routes
    │   └── middleware/    # Custom middleware
    └── config/           # Configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m "Add some AmazingFeature"`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Kenyatta University
- All contributors and maintainers
- Open source community
