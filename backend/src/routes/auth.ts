import express from "express";
import { User } from "../models";
import {
  hashPassword,
  comparePassword,
  generateJWT,
  generateOTPExpiry,
  isOTPExpired,
} from "../utils/auth";
import { generateOTP, sendOTPEmail } from "../utils/email";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Input validation helper
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): string | null => {
  if (password.length < 6) return "Password must be at least 6 characters long";
  if (!/(?=.*[a-z])/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/(?=.*[A-Z])/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/(?=.*\d)/.test(password))
    return "Password must contain at least one number";
  return null;
};

// POST /auth/signup - Send OTP for signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "ERROR",
        message: "Name, email, and password are required",
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        status: "ERROR",
        message: "Please enter a valid email address",
      });
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({
        status: "ERROR",
        message: passwordError,
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

    // Hash password
    const hashedPassword = await hashPassword(password);

    if (existingUser && !existingUser.isVerified) {
      // Update existing unverified user
      existingUser.name = name.trim();
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      await existingUser.save();
    } else {
      // Create new user
      const newUser = new User({
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
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

// POST /auth/login - Login with email and password
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "ERROR",
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        status: "ERROR",
        message: "Invalid email or password",
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        status: "ERROR",
        message: "Please verify your email address first",
      });
    }

    // Check if user signed up with email (has password)
    if (!user.password || user.authProvider !== "email") {
      return res.status(400).json({
        status: "ERROR",
        message:
          "This account was created with Google. Please use Google sign-in.",
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "ERROR",
        message: "Invalid email or password",
      });
    }

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
    console.error("Login error:", error);
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

export default router;
