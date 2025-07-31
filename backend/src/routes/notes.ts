import express from "express";
import { Note } from "../models";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// All note routes require authentication
router.use(authenticateToken);

// GET /notes - Get all notes for authenticated user
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({
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
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Failed to retrieve notes",
    });
  }
});

// POST /notes - Create a new note
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        status: "ERROR",
        message: "Title and content are required",
      });
    }

    const newNote = new Note({
      userId: req.user._id,
      title: title.trim(),
      content: content.trim(),
    });

    const savedNote = await newNote.save();

    res.status(201).json({
      status: "SUCCESS",
      message: "Note created successfully",
      data: {
        note: savedNote,
      },
    });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Failed to create note",
    });
  }
});

// GET /notes/:id - Get a specific note
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findOne({
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
  } catch (error) {
    console.error("Get note error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Failed to retrieve note",
    });
  }
});

// PUT /notes/:id - Update a note
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        status: "ERROR",
        message: "Title and content are required",
      });
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title: title.trim(), content: content.trim() },
      { new: true }
    );

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
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Failed to update note",
    });
  }
});

// DELETE /notes/:id - Delete a note
router.delete("/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
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
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Failed to delete note",
    });
  }
});

export default router;
