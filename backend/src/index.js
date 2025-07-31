"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const models_1 = require("./models");
const auth_1 = __importDefault(require("./routes/auth"));
const notes_1 = __importDefault(require("./routes/notes"));
// Load environment variables
dotenv_1.default.config();
// Connect to MongoDB
(0, database_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/auth", auth_1.default);
app.use("/notes", notes_1.default);
// Basic health check route
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Note-taking app backend is running!",
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: {
                signup: "POST /auth/signup",
                verify: "POST /auth/verify",
                login: "POST /auth/login",
                me: "GET /auth/me (requires JWT)",
                resendOtp: "POST /auth/resend-otp",
            },
            notes: {
                getAll: "GET /notes (requires JWT)",
                create: "POST /notes (requires JWT)",
                getOne: "GET /notes/:id (requires JWT)",
                update: "PUT /notes/:id (requires JWT)",
                delete: "DELETE /notes/:id (requires JWT)",
            },
        },
    });
});
// Add permanent dummy data to MongoDB Atlas
app.get("/add-dummy-data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create sample users
        const users = [
            {
                name: "John Doe",
                email: "john@example.com",
                authProvider: "email",
                isVerified: true,
            },
            {
                name: "Jane Smith",
                email: "jane@example.com",
                authProvider: "email",
                isVerified: true,
            },
            {
                name: "Google User",
                email: "googleuser@gmail.com",
                googleId: "google123456789",
                authProvider: "google",
                isVerified: true,
            },
        ];
        const savedUsers = yield models_1.User.insertMany(users);
        console.log("✅ Sample users created:", savedUsers.length);
        // Create sample notes for these users
        const notes = [
            {
                userId: savedUsers[0]._id,
                title: "My First Note",
                content: "This is John's first note about project planning. It contains important thoughts about the upcoming features we need to implement.",
            },
            {
                userId: savedUsers[0]._id,
                title: "Meeting Notes",
                content: "Today's team meeting discussed the MongoDB integration and authentication flow. Everything looks good so far!",
            },
            {
                userId: savedUsers[1]._id,
                title: "Shopping List",
                content: "Need to buy groceries: milk, bread, eggs, and coffee. Don't forget to check if we need more fruits.",
            },
            {
                userId: savedUsers[1]._id,
                title: "Book Recommendations",
                content: "Books to read this month: Clean Code, The Pragmatic Programmer, and You Don't Know JS series.",
            },
            {
                userId: savedUsers[2]._id,
                title: "Travel Plans",
                content: "Planning a trip to Europe next summer. Need to research flights, hotels, and must-see attractions in Paris and Rome.",
            },
        ];
        const savedNotes = yield models_1.Note.insertMany(notes);
        console.log("✅ Sample notes created:", savedNotes.length);
        res.json({
            status: "SUCCESS",
            message: "Dummy data successfully added to MongoDB Atlas!",
            data: {
                usersCreated: savedUsers.length,
                notesCreated: savedNotes.length,
                users: savedUsers.map((user) => ({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    authProvider: user.authProvider,
                })),
                notes: savedNotes.map((note) => ({
                    id: note._id,
                    title: note.title,
                    content: note.content.substring(0, 50) + "...",
                })),
            },
        });
    }
    catch (error) {
        console.error("❌ Failed to add dummy data:", error);
        res.status(500).json({
            status: "ERROR",
            message: "Failed to add dummy data",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
// Test database connection and collection creation
app.get("/test-db", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Test User collection creation
        const testUser = new models_1.User({
            name: "Test User",
            email: "test@example.com",
            authProvider: "email",
            isVerified: true,
        });
        const savedUser = yield testUser.save();
        console.log("✅ Test user created:", savedUser._id);
        // Test Note collection creation
        const testNote = new models_1.Note({
            userId: savedUser._id,
            title: "Test Note",
            content: "This is a test note to verify database connection!",
        });
        const savedNote = yield testNote.save();
        console.log("✅ Test note created:", savedNote._id);
        // Clean up test data
        yield models_1.User.findByIdAndDelete(savedUser._id);
        yield models_1.Note.findByIdAndDelete(savedNote._id);
        console.log("🧹 Test data cleaned up");
        res.json({
            status: "SUCCESS",
            message: "Database connection working! Collections created in MongoDB Atlas.",
            testResults: {
                userCreated: true,
                noteCreated: true,
                connectionsWorking: true,
            },
        });
    }
    catch (error) {
        console.error("❌ Database test failed:", error);
        res.status(500).json({
            status: "ERROR",
            message: "Database connection failed",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}));
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
