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
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All note routes require authentication
router.use(auth_1.authenticateToken);
// GET /notes - Get all notes for authenticated user
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield models_1.Note.find({ userId: req.user._id }).sort({
            updatedAt: -1,
        }); // Latest first
        res.status(200).json({
            status: "SUCCESS",
            message: "Notes retrieved successfully",
            data: {
                notes,
                count: notes.length,
            },
        });
    }
    catch (error) {
        console.error("Get notes error:", error);
        res.status(500).json({
            status: "ERROR",
            message: "Failed to retrieve notes",
        });
    }
}));
// POST /notes - Create a new note
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                status: "ERROR",
                message: "Title and content are required",
            });
        }
        const newNote = new models_1.Note({
            userId: req.user._id,
            title: title.trim(),
            content: content.trim(),
        });
        const savedNote = yield newNote.save();
        res.status(201).json({
            status: "SUCCESS",
            message: "Note created successfully",
            data: {
                note: savedNote,
            },
        });
    }
    catch (error) {
        console.error("Create note error:", error);
        res.status(500).json({
            status: "ERROR",
            message: "Failed to create note",
        });
    }
}));
// GET /notes/:id - Get a specific note
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield models_1.Note.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!note) {
            return res.status(404).json({
                status: "ERROR",
                message: "Note not found",
            });
        }
        res.status(200).json({
            status: "SUCCESS",
            message: "Note retrieved successfully",
            data: {
                note,
            },
        });
    }
    catch (error) {
        console.error("Get note error:", error);
        res.status(500).json({
            status: "ERROR",
            message: "Failed to retrieve note",
        });
    }
}));
// PUT /notes/:id - Update a note
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                status: "ERROR",
                message: "Title and content are required",
            });
        }
        const updatedNote = yield models_1.Note.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { title: title.trim(), content: content.trim() }, { new: true });
        if (!updatedNote) {
            return res.status(404).json({
                status: "ERROR",
                message: "Note not found",
            });
        }
        res.status(200).json({
            status: "SUCCESS",
            message: "Note updated successfully",
            data: {
                note: updatedNote,
            },
        });
    }
    catch (error) {
        console.error("Update note error:", error);
        res.status(500).json({
            status: "ERROR",
            message: "Failed to update note",
        });
    }
}));
// DELETE /notes/:id - Delete a note
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedNote = yield models_1.Note.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!deletedNote) {
            return res.status(404).json({
                status: "ERROR",
                message: "Note not found",
            });
        }
        res.status(200).json({
            status: "SUCCESS",
            message: "Note deleted successfully",
            data: {
                deletedNote: {
                    id: deletedNote._id,
                    title: deletedNote.title,
                },
            },
        });
    }
    catch (error) {
        console.error("Delete note error:", error);
        res.status(500).json({
            status: "ERROR",
            message: "Failed to delete note",
        });
    }
}));
exports.default = router;
