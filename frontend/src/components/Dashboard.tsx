import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Note Taking App
          </h1>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Welcome back, {user?.name}! 🎉
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Account Type:</strong>{" "}
              {user?.authProvider === "email" ? "Email" : "Google"}
            </p>
            <p>
              <strong>Status:</strong>
              <span className="ml-1 text-green-600 font-medium">
                {user?.isVerified ? "✓ Verified" : "⚠ Unverified"}
              </span>
            </p>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-800">
                Authentication Successful!
              </h3>
              <p className="text-green-700 mt-1">
                Your email OTP authentication is working perfectly. The backend
                and frontend are successfully communicating.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-3">
            🚀 What's Next?
          </h3>
          <ul className="space-y-2 text-blue-700">
            <li>• Add note creation and management features</li>
            <li>• Implement Google OAuth authentication</li>
            <li>• Create a proper notes dashboard</li>
            <li>• Add search and filtering capabilities</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
