import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
import { FiTrash2, FiPlus, FiX } from "react-icons/fi";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  // Fetch notes on component mount
  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

  const fetchNotes = async () => {
    if (!token) {
      console.log("No token available, skipping fetch notes");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      console.log("Fetching notes with token:", token.substring(0, 20) + "...");

      const response = await apiService.getNotes(token);
      console.log("Notes API response:", response);

      if (response.status === "SUCCESS" && response.data) {
        setNotes(response.data.notes);
        console.log("Notes loaded successfully:", response.data.notes.length);
      } else {
        setError(response.message || "Failed to fetch notes");
        console.error("Notes API error:", response);
      }
    } catch (error) {
      setError("Failed to fetch notes");
      console.error("Fetch notes error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!token || !newNote.title.trim() || !newNote.content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setIsCreating(true);
      setError("");
      console.log("Creating note:", {
        title: newNote.title,
        content: newNote.content.substring(0, 50) + "...",
      });

      const response = await apiService.createNote(
        token,
        newNote.title.trim(),
        newNote.content.trim()
      );

      console.log("Create note API response:", response);

      if (response.status === "SUCCESS" && response.data) {
        setNotes([response.data.note, ...notes]);
        setNewNote({ title: "", content: "" });
        setShowCreateModal(false);
        console.log("Note created successfully!");
      } else {
        setError(response.message || "Failed to create note");
        console.error("Create note API error:", response);
      }
    } catch (error) {
      setError("Failed to create note");
      console.error("Create note error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      const response = await apiService.deleteNote(token, noteId);

      if (response.status === "SUCCESS") {
        setNotes(notes.filter((note) => note._id !== noteId));
      } else {
        setError(response.message || "Failed to delete note");
      }
    } catch (error) {
      setError("Failed to delete note");
      console.error("Delete note error:", error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/main logo.png" alt="HD Logo" className="h-8 w-auto" />
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
            {user?.email}
          </p>
        </div>

        {/* Create Note Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full text-white font-semibold py-4 px-6 rounded-2xl mb-8 flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: "#337DFF" }}
        >
          <FiPlus className="w-5 h-5" />
          <span>Create New Note</span>
        </button>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 shadow-sm">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Notes Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Your Notes
          </h3>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 animate-pulse shadow-sm"
                >
                  <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-base font-medium mb-2">
                No notes yet
              </p>
              <p className="text-gray-400 text-sm">
                Create your first note to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex justify-between items-start hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]"
                >
                  <div className="flex-1 pr-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                      {note.title}
                    </h4>
                    <p className="text-gray-600 line-clamp-2 leading-relaxed">
                      {note.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-3">
                      {new Date(note.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200 scale-100 animate-in slide-in-from-bottom-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Create New Note
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Add a new note to your collection
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewNote({ title: "", content: "" });
                  setError("");
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter a descriptive title..."
                  autoFocus
                />
              </div>

              {/* Content Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({ ...newNote, content: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 resize-none"
                  placeholder="Write your note content here..."
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewNote({ title: "", content: "" });
                  setError("");
                }}
                className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNote}
                disabled={
                  isCreating || !newNote.title.trim() || !newNote.content.trim()
                }
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                style={{ backgroundColor: isCreating ? "#93C5FD" : "#337DFF" }}
              >
                {isCreating ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  "Create Note"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
