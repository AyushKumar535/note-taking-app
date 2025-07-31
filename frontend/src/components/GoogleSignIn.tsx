import React, { useEffect, useRef } from "react";
import { apiService } from "../services/api";

// Extend the global Window interface to include google
declare global {
  interface Window {
    google: any;
  }
}

interface GoogleSignInProps {
  onSuccess: (token: string, user: any) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({
  onSuccess,
  onError,
  disabled = false,
}) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for Google script to load
    const initializeGoogleSignIn = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: "510418701705-7jar80rv8tirh5cvmsh1v4vhgohf6l8c.apps.googleusercontent.com",
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "continue_with",
          shape: "rounded",
        });
      }
    };

    // Check if Google script is already loaded
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Listen for the script to load
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (script) {
        script.addEventListener('load', initializeGoogleSignIn);
        return () => script.removeEventListener('load', initializeGoogleSignIn);
      }
    }
  }, []);

  const handleGoogleResponse = async (response: any) => {
    try {
      if (!response.credential) {
        onError("Google authentication failed");
        return;
      }

      // Send the credential (JWT token) to our backend
      const result = await apiService.googleAuth(response.credential);

      if (result.status === "SUCCESS" && result.data) {
        onSuccess(result.data.token, result.data.user);
      } else {
        onError(result.message || "Google authentication failed");
      }
    } catch (error) {
      console.error("Google auth error:", error);
      onError("Google authentication failed. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <div
        ref={googleButtonRef}
        className={`w-full ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      />
    </div>
  );
};

export default GoogleSignIn;