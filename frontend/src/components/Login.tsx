import React, { useState } from "react";
import { apiService } from "../services/api";
import GoogleSignIn from "./GoogleSignIn";

interface LoginProps {
  onLoginSuccess: (email: string) => void;
  onSwitchToSignup: () => void;
  onGoogleSuccess: (token: string, user: any) => void;
}

const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
  onSwitchToSignup,
  onGoogleSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) setError("");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!email.trim()) {
      setError("Please enter your email");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiService.login(email.trim());

      if (response.status === "SUCCESS") {
        onLoginSuccess(email.trim());
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google authentication success
  const handleGoogleSuccess = (token: string, user: any) => {
    onGoogleSuccess(token, user);
  };

  // Handle Google authentication error
  const handleGoogleError = (error: string) => {
    setError(error);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col justify-center px-4 pt-2 pb-8 min-h-screen">
        <div className="max-w-sm mx-auto w-full">
          {/* Logo Header */}
          <div className="flex justify-center mb-8">
            <img src="/top.png" alt="HD Logo" className="h-8 w-auto" />
          </div>

          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Sign in
            </h1>
            <p className="text-gray-500 text-sm">
              Welcome back! Please sign in to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-normal text-blue-500 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="jonas_khanwald@gmail.com"
                className="w-full px-4 py-3 border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900"
                disabled={isLoading}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full text-white font-semibold py-4 px-4 rounded-xl transition-colors duration-200"
                style={{
                  backgroundColor: isLoading ? "#93C5FD" : "#337DFF",
                  fontSize: "16px",
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  "Send Login OTP"
                )}
              </button>
            </div>
          </form>

          {/* OR Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Google Sign In */}
          <div className="mb-6">
            <GoogleSignIn
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              disabled={isLoading}
            />
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <button
                onClick={onSwitchToSignup}
                className="text-blue-500 font-medium hover:underline"
                disabled={isLoading}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen overflow-hidden">
        {/* Left Column - Form */}
        <div className="w-1/2 bg-white flex flex-col justify-center px-8 lg:px-12 xl:px-16 py-8">
          <div className="max-w-sm mx-auto w-full">
            {/* Logo Header */}
            <div className="mb-6 lg:mb-8 flex justify-start">
              <img
                src="/top.png"
                alt="HD Logo"
                className="h-8 lg:h-10 w-auto"
              />
            </div>

            {/* Title Section */}
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
                Sign in
              </h1>
              <p className="text-gray-500 text-sm lg:text-base">
                Welcome back! Please sign in to your account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="desktop-email"
                  className="block text-sm font-normal text-blue-500 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="desktop-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="jonas_khanwald@gmail.com"
                  className="w-full px-4 py-2.5 border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900 text-sm"
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 text-sm"
                  style={{
                    backgroundColor: isLoading ? "#93C5FD" : "#337DFF",
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending OTP...
                    </div>
                  ) : (
                    "Send Login OTP"
                  )}
                </button>
              </div>
            </form>

            {/* OR Separator */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Google Sign In */}
            <div className="mb-4">
              <GoogleSignIn
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                disabled={isLoading}
              />
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={onSwitchToSignup}
                  className="text-blue-500 font-medium hover:underline"
                  disabled={isLoading}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Background Image */}
        <div
          className="w-1/2 bg-cover bg-center bg-no-repeat rounded-l-2xl m-4 ml-0"
          style={{ backgroundImage: "url(/right-column.png)" }}
        ></div>
      </div>
    </div>
  );
};

export default Login;
