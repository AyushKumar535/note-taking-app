# Note-Taking App Backend

A minimal MVP backend for a note-taking application built with Node.js, Express, and TypeScript.

## Features

- **Authentication**: JWT-based auth with email/OTP and Google OAuth2
- **Database**: MongoDB with Mongoose
- **Email**: Nodemailer for OTP emails
- **API**: RESTful API for notes CRUD operations

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Google OAuth2 + Email OTP
- **Email**: Nodemailer

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Create environment file**:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your actual configuration values.

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

Create a `.env` file with these variables:

```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/notetaking-app

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

- `GET /health` - Health check endpoint

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (not implemented yet)

## Project Structure

```
backend/
├── src/
│   └── index.ts          # Main server file
├── dist/                 # Compiled JavaScript (after build)
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## Development

The server runs on `http://localhost:5000` by default.

Health check: `http://localhost:5000/health`
