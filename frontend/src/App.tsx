import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Signup from "./components/Signup";
import OTPVerification from "./components/OTPVerification";
import Dashboard from "./components/Dashboard";

// Define view types
type ViewType = "signup" | "otp-verification" | "dashboard";

// Main app content (inside AuthProvider)
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>("signup");
  const [signupEmail, setSignupEmail] = useState("");

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, show dashboard
  if (isAuthenticated) {
    return <Dashboard />;
  }

  // Handle signup success - move to OTP verification
  const handleSignupSuccess = (email: string) => {
    setSignupEmail(email);
    setCurrentView("otp-verification");
  };

  // Handle OTP verification success - will automatically redirect to dashboard
  const handleVerificationSuccess = () => {
    // Auth context will handle the state change
    // Dashboard will be shown automatically due to isAuthenticated check above
  };

  // Handle switching to login (for now, just go back to signup)
  const handleSwitchToLogin = () => {
    setCurrentView("signup");
  };

  // Handle back to signup from OTP
  const handleBackToSignup = () => {
    setCurrentView("signup");
    setSignupEmail("");
  };

  // Render current view
  switch (currentView) {
    case "otp-verification":
      return (
        <OTPVerification
          email={signupEmail}
          onVerificationSuccess={handleVerificationSuccess}
          onBackToSignup={handleBackToSignup}
        />
      );

    case "signup":
    default:
      return (
        <Signup
          onSignupSuccess={handleSignupSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      );
  }
};

// Main App component with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
