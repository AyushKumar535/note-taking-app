import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/auth";
import { User } from "../models";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// JWT Authentication middleware
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        status: "ERROR",
        message: "Access token required",
      });
    }

    // Verify token
    const decoded = verifyJWT(token);
    if (!decoded) {
      return res.status(403).json({
        status: "ERROR",
        message: "Invalid or expired token",
      });
    }

    // Get user from database
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        status: "ERROR",
        message: "User not found",
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        status: "ERROR",
        message: "Please verify your email address first",
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Authentication error",
    });
  }
};
