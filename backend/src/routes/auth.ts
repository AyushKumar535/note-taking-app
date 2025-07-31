import express from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models";
import { generateJWT, generateOTPExpiry, isOTPExpired } from "../utils/auth";
import { generateOTP, sendOTPEmail } from "../utils/email";
import { authenticateToken } from "../middleware/auth";

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

// Input validation helper
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// POST /auth/signup - Send OTP for signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({
        status: "ERROR",
        message: "Name and email are required",
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        status: "ERROR",
        message: "Please enter a valid email address",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        status: "ERROR",
        message: "User with this email already exists",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    if (existingUser && !existingUser.isVerified) {
      // Update existing unverified user
      existingUser.name = name.trim();
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      await existingUser.save();
    } else {
      // Create new user
      const newUser = new User({
        name: name.trim(),
        email: email.toLowerCase(),
        authProvider: "email",
        isVerified: false,
        otp,
        otpExpiry,
      });
      await newUser.save();
    }

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, name);
    if (!emailSent) {
      return res.status(500).json({
        status: "ERROR",
        message: "Failed to send OTP email. Please try again.",
      });
    }

    res.status(200).json({
      status: "SUCCESS",
      message: `OTP sent successfully to ${email}. Please check your email and verify within 10 minutes.`,
      data: {
        email: email.toLowerCase(),
        otpSent: true,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Internal server error. Please try again.",
    });
  }
});

// POST /auth/verify - Verify OTP and activate account
router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        status: "ERROR",
        message: "Email and OTP are required",
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        status: "ERROR",
        message: "User not found. Please sign up first.",
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        status: "ERROR",
        message: "Account is already verified. Please login.",
      });
    }

    // Check if OTP exists
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        status: "ERROR",
        message: "No OTP found. Please request a new OTP.",
      });
    }

    // Check if OTP is expired
    if (isOTPExpired(user.otpExpiry)) {
      return res.status(400).json({
        status: "ERROR",
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Verify OTP
    if (user.otp !== otp.trim()) {
      return res.status(400).json({
        status: "ERROR",
        message: "Invalid OTP. Please check and try again.",
      });
    }

    // Activate account
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT token
    const token = generateJWT((user._id as any).toString());

    res.status(200).json({
      status: "SUCCESS",
      message: "Account verified successfully! Welcome to Note Taking App.",
      data: {
        token,
        user: {
          id: (user._id as any).toString(),
          name: user.name,
          email: user.email,
          authProvider: user.authProvider,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Internal server error. Please try again.",
    });
  }
});

// POST /auth/login - Send OTP for login
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        status: "ERROR",
        message: "Email is required",
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        status: "ERROR",
        message: "Please enter a valid email address",
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        status: "ERROR",
        message: "User not found. Please sign up first.",
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        status: "ERROR",
        message:
          "Please verify your email address first. Check your inbox for the OTP.",
      });
    }

    // Generate OTP for login
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    // Update user with login OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, user.name);
    if (!emailSent) {
      return res.status(500).json({
        status: "ERROR",
        message: "Failed to send OTP email. Please try again.",
      });
    }

    res.status(200).json({
      status: "SUCCESS",
      message: `Login OTP sent successfully to ${email}. Please check your email and verify within 10 minutes.`,
      data: {
        email: email.toLowerCase(),
        otpSent: true,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Internal server error. Please try again.",
    });
  }
});

// POST /auth/verify-login - Verify OTP for login
router.post("/verify-login", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        status: "ERROR",
        message: "Email and OTP are required",
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        status: "ERROR",
        message: "User not found. Please sign up first.",
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        status: "ERROR",
        message: "Please verify your email address first.",
      });
    }

    // Check if OTP exists
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        status: "ERROR",
        message: "No OTP found. Please request a new login OTP.",
      });
    }

    // Check if OTP is expired
    if (isOTPExpired(user.otpExpiry)) {
      return res.status(400).json({
        status: "ERROR",
        message: "OTP has expired. Please request a new login OTP.",
      });
    }

    // Verify OTP
    if (user.otp !== otp.trim()) {
      return res.status(400).json({
        status: "ERROR",
        message: "Invalid OTP. Please check and try again.",
      });
    }

    // Clear OTP after successful login
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT token
    const token = generateJWT((user._id as any).toString());

    res.status(200).json({
      status: "SUCCESS",
      message: "Login successful! Welcome back.",
      data: {
        token,
        user: {
          id: (user._id as any).toString(),
          name: user.name,
          email: user.email,
          authProvider: user.authProvider,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    console.error("Verify login OTP error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Internal server error. Please try again.",
    });
  }
});

// GET /auth/me - Get current user info (protected route)
router.get("/me", authenticateToken, async (req, res) => {
  try {
    res.status(200).json({
      status: "SUCCESS",
      message: "User information retrieved successfully",
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          authProvider: req.user.authProvider,
          isVerified: req.user.isVerified,
          createdAt: req.user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get user info error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Internal server error",
    });
  }
});

// POST /auth/resend-otp - Resend OTP for unverified users
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "ERROR",
        message: "Email is required",
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        status: "ERROR",
        message: "User not found",
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({
        status: "ERROR",
        message: "Account is already verified. Please login.",
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    // Update user with new OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, user.name);
    if (!emailSent) {
      return res.status(500).json({
        status: "ERROR",
        message: "Failed to send OTP email. Please try again.",
      });
    }

    res.status(200).json({
      status: "SUCCESS",
      message: `New OTP sent successfully to ${email}. Please check your email.`,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Internal server error. Please try again.",
    });
  }
});

// POST /auth/google - Google OAuth authentication
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        status: "ERROR",
        message: "Google token is required",
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({
        status: "ERROR",
        message: "Invalid Google token",
      });
    }

    const { sub: googleId, email, name, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({
        status: "ERROR",
        message: "Google email not verified",
      });
    }

    // Check if user already exists
    let user = await User.findOne({
      $or: [{ email: email!.toLowerCase() }, { googleId }],
    });

    if (user) {
      // User exists
      if (user.authProvider === "email" && !user.googleId) {
        // User signed up with email, now connecting Google account
        user.googleId = googleId;
        user.authProvider = "google"; // Switch to Google as primary
        await user.save();
      } else if (user.authProvider === "google" && user.googleId !== googleId) {
        // Different Google account with same email
        return res.status(400).json({
          status: "ERROR",
          message: "This email is associated with a different Google account",
        });
      }
    } else {
      // Create new user
      user = new User({
        name: name || "Google User",
        email: email!.toLowerCase(),
        googleId,
        authProvider: "google",
        isVerified: true, // Google users are pre-verified
      });
      await user.save();
    }

    // Generate JWT token
    const jwtToken = generateJWT((user._id as any).toString());

    res.status(200).json({
      status: "SUCCESS",
      message: user.isNew
        ? "Account created successfully with Google! Welcome to Note Taking App."
        : "Login successful! Welcome back.",
      data: {
        token: jwtToken,
        user: {
          id: (user._id as any).toString(),
          name: user.name,
          email: user.email,
          authProvider: user.authProvider,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);

    if (
      error instanceof Error &&
      error.message.includes("Token used too early")
    ) {
      return res.status(400).json({
        status: "ERROR",
        message: "Google token is not yet valid. Please try again.",
      });
    }

    if (error instanceof Error && error.message.includes("Token expired")) {
      return res.status(400).json({
        status: "ERROR",
        message: "Google token has expired. Please sign in again.",
      });
    }

    res.status(500).json({
      status: "ERROR",
      message: "Google authentication failed. Please try again.",
    });
  }
});

export default router;
