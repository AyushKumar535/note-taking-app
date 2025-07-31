import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

interface OTPVerificationProps {
  email: string;
  onVerificationSuccess: () => void;
  onBackToSignup: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerificationSuccess,
  onBackToSignup,
}) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const { login } = useAuth();

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Handle OTP input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
      if (error) setError("");
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await apiService.verifyOTP(email, otp);

      if (response.status === "SUCCESS" && response.data) {
        // Store auth data and redirect
        login(response.data.token, response.data.user);
        onVerificationSuccess();
      } else {
        setError(response.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setIsResending(true);
    setError("");

    try {
      const response = await apiService.resendOTP(email);

      if (response.status === "SUCCESS") {
        setTimeLeft(600); // Reset timer
        setOtp(""); // Clear current OTP
        // You could show a success message here
      } else {
        setError(response.message || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center px-6 py-12">
      <div className="max-w-sm mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Verify OTP
          </h1>
          <p className="text-gray-600 text-sm">We've sent a 6-digit code to</p>
          <p className="text-gray-900 font-medium text-sm mt-1">{email}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* OTP Form */}
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter OTP Code
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="123456"
              className="w-full px-4 py-3 text-center text-2xl font-mono tracking-wider border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              disabled={isLoading}
              maxLength={6}
              autoComplete="one-time-code"
            />
          </div>

          {/* Timer */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {timeLeft > 0 ? (
                <>
                  Code expires in{" "}
                  <span className="font-mono text-red-600">
                    {formatTime(timeLeft)}
                  </span>
                </>
              ) : (
                <span className="text-red-600">Code has expired</span>
              )}
            </p>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            style={{ backgroundColor: isLoading ? "#93C5FD" : "#337DFF" }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="text-center mt-6 space-y-3">
          <p className="text-gray-600 text-sm">Didn't receive the code?</p>
          <button
            onClick={handleResendOtp}
            disabled={isResending || timeLeft > 540} // Allow resend after 1 minute
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <div className="inline-flex items-center">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Resending...
              </div>
            ) : timeLeft > 540 ? (
              `Resend in ${formatTime(600 - timeLeft)}`
            ) : (
              "Resend OTP"
            )}
          </button>
        </div>

        {/* Back to Signup */}
        <div className="text-center mt-6">
          <button
            onClick={onBackToSignup}
            className="text-gray-600 hover:text-gray-700 text-sm hover:underline"
            disabled={isLoading}
          >
            ← Back to signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
