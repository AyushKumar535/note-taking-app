# 📝 Smart Notes - Full-Stack Note-Taking Application

A modern, secure, and responsive note-taking application built with React, Node.js, and MongoDB. Features email OTP authentication, Google OAuth integration, and real-time note management with a beautiful, mobile-first design.

![Smart Notes Demo](./frontend/public/top.png)

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel](https://your-app.vercel.app)
- **Backend API**: [Deployed on Vercel](https://your-api-backend.vercel.app)

## ✨ Features

### 🔐 **Multi-Modal Authentication**

- **Email + OTP Verification**: Secure signup/login with email-based OTP
- **Google OAuth 2.0**: One-click authentication with Google accounts
- **JWT Authorization**: Stateless, secure session management
- **Input Validation**: Comprehensive client and server-side validation

### 📄 **Note Management**

- **Create Notes**: Rich text note creation with title and content
- **View Notes**: Clean, organized note display with timestamps
- **Delete Notes**: Secure note deletion with confirmation
- **User Isolation**: Each user can only access their own notes

### 🎨 **Modern UI/UX**

- **Mobile-First Design**: Responsive layout for all devices
- **Tailwind CSS**: Clean, modern styling with consistent design system
- **Loading States**: Smooth user experience with loading indicators
- **Error Handling**: User-friendly error messages and validation

### ⚡ **Performance & Security**

- **TypeScript**: Full type safety across frontend and backend
- **MongoDB**: Efficient NoSQL database with Mongoose ODM
- **CORS Configuration**: Secure cross-origin resource sharing
- **Environment Variables**: Secure configuration management

## 🛠️ Tech Stack

### **Frontend**

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **React Context** - State management for authentication
- **React Icons** - Beautiful, consistent icons
- **Vite** - Fast build tool and development server

### **Backend**

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### **Authentication & Security**

- **JWT** - JSON Web Token for authorization
- **Google OAuth 2.0** - Third-party authentication
- **Nodemailer** - Email service for OTP delivery
- **bcrypt** - Password hashing (future implementation)

### **DevOps & Deployment**

- **Vercel** - Full-stack hosting (Frontend + Backend)
- **MongoDB Atlas** - Cloud database
- **Git/GitHub** - Version control

## 🏁 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- Google OAuth credentials

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/note-taking-app-2.git
cd note-taking-app-2
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Fill in your environment variables:
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# GOOGLE_CLIENT_ID=your_google_client_id
# EMAIL_USER=your_smtp_email
# EMAIL_PASS=your_smtp_password

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

### 4. Environment Variables

#### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/noteapp
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-oauth-client-id
EMAIL_USER=your-smtp-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

## 📱 API Documentation

### Authentication Endpoints

```
POST /auth/signup          # Send OTP for user registration
POST /auth/verify          # Verify OTP and create account
POST /auth/login           # Send OTP for login
POST /auth/google          # Google OAuth authentication
POST /auth/resend-otp      # Resend OTP code
GET  /auth/me              # Get current user info (JWT required)
```

### Notes Endpoints

```
GET    /notes              # Get all user notes (JWT required)
POST   /notes              # Create new note (JWT required)
GET    /notes/:id          # Get specific note (JWT required)
PUT    /notes/:id          # Update note (JWT required)
DELETE /notes/:id          # Delete note (JWT required)
```

### Health Check

```
GET /health                # API health status and endpoints info
```

## 🏗️ Project Structure

```
note-taking-app-2/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── OTPVerification.tsx
│   │   │   └── GoogleSignIn.tsx
│   │   ├── contexts/        # React Context providers
│   │   │   └── AuthContext.tsx
│   │   ├── services/        # API service layer
│   │   │   └── api.ts
│   │   └── App.tsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json
│
├── backend/                 # Node.js TypeScript backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   │   └── database.ts
│   │   ├── models/         # Mongoose models
│   │   │   ├── User.ts
│   │   │   └── Note.ts
│   │   ├── routes/         # Express routes
│   │   │   ├── auth.ts
│   │   │   └── notes.ts
│   │   ├── middleware/     # Custom middleware
│   │   │   └── auth.ts
│   │   ├── utils/          # Utility functions
│   │   │   ├── auth.ts
│   │   │   └── email.ts
│   │   └── index.ts        # Server entry point
│   └── package.json
│
└── project details.md      # Project documentation
```

## 🔒 Security Features

- **JWT Authentication**: Secure, stateless user sessions
- **OTP Verification**: Email-based one-time password validation
- **Input Sanitization**: Protection against XSS and injection attacks
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Environment Variables**: Sensitive data protection
- **User Data Isolation**: Users can only access their own notes

## 📋 Development Workflow

### Git Commit Convention

```bash
feat(auth): implement Google OAuth integration
fix(api): resolve note deletion authorization issue
docs(readme): update API documentation
style(ui): improve mobile responsiveness
```

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Building for Production

```bash
# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build
```

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push to main

### Backend (Vercel)

1. Create a separate Vercel project for backend
2. Connect your GitHub repository to Vercel
3. Set root directory: `backend`
4. Set build command: `npm run build`
5. Set start command: `npm start`
6. Add environment variables in Vercel dashboard
7. Configure as Node.js serverless functions

### Vercel Deployment Benefits

- **Unified Platform**: Both frontend and backend on the same platform
- **Automatic HTTPS**: SSL certificates automatically managed
- **Global CDN**: Fast content delivery worldwide
- **Serverless Functions**: Backend scales automatically with traffic
- **Git Integration**: Automatic deployments on push
- **Preview Deployments**: Test changes before going live

### Environment Configuration

Make sure to set these environment variables in both Vercel projects:

**Frontend Environment Variables:**

```
VITE_API_URL=https://your-api-backend.vercel.app
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

**Backend Environment Variables:**

```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
EMAIL_USER=your-smtp-email
EMAIL_PASS=your-smtp-password
```

## 🧪 Testing

The application includes comprehensive testing for:

- Authentication flows (email OTP, Google OAuth)
- Note CRUD operations
- API endpoint validation
- Frontend component rendering
- Error handling scenarios

## 💡 Key Implementation Details

### Authentication Flow

1. **Email Signup**: User enters name and email → OTP sent → OTP verification → Account created
2. **Email Login**: User enters email → OTP sent → OTP verification → User logged in
3. **Google OAuth**: One-click Google authentication → Account created/logged in automatically

### State Management

- **React Context**: Centralized authentication state management
- **Local Storage**: Persistent user session across browser sessions
- **JWT Tokens**: Secure API authorization for protected routes

### Database Design

- **User Model**: Stores user information, authentication provider, verification status
- **Note Model**: Stores notes with user reference, timestamps, and content
- **Indexes**: Optimized queries for user-specific data retrieval

## 🔧 Development Tools & Configuration

### Frontend Tools

- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first styling

### Backend Tools

- **Nodemon**: Auto-restart during development
- **ts-node**: Direct TypeScript execution
- **Express Middleware**: CORS, JSON parsing, authentication

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ayush Kumar**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React and TypeScript communities for excellent documentation
- Tailwind CSS for the beautiful design system
- MongoDB for the flexible database solution
- Google for OAuth 2.0 integration
- All open-source contributors who made this project possible

---

⭐ **Star this repository if you found it helpful!**

## 📊 Project Stats

- **Frontend**: ~340 lines of TypeScript/React code
- **Backend**: ~542 lines of TypeScript/Node.js code
- **Total Components**: 6 React components
- **API Endpoints**: 10+ RESTful endpoints
- **Authentication Methods**: 2 (Email OTP + Google OAuth)
- **Database Models**: 2 (User, Note)
- **Development Time**: [Your timeline]

## 🎯 Future Enhancements

- [ ] Rich text editor with formatting options
- [ ] Note categories and tagging system
- [ ] Search and filter functionality
- [ ] Note sharing capabilities
- [ ] Dark mode theme
- [ ] Offline functionality with PWA
- [ ] Real-time collaboration
- [ ] File attachments support
- [ ] Export notes to PDF/Markdown
- [ ] Mobile app development
