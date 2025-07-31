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
      console.log("Creating note:", { title: newNote.title, content: newNote.content.substring(0, 50) + "..." });
      
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
        setNotes(notes.filter(note => note._id !== noteId));
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Welcome, {user?.name} !
          </h2>
          <p className="text-sm text-gray-600">
            Email: {user?.email}
          </p>
        </div>

        {/* Create Note Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg mb-6 flex items-center justify-center space-x-2 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          <span>Create Note</span>
        </button>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Notes Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No notes yet. Create your first note!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{note.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{note.content}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="ml-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Create New Note</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewNote({ title: "", content: "" });
                  setError("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter note title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter note content"
                />
              </div>
            </div>
            
            <div className="p-4 border-t flex space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewNote({ title: "", content: "" });
                  setError("");
                }}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNote}
                disabled={isCreating || !newNote.title.trim() || !newNote.content.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
