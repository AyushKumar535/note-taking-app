"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const auth_1 = require("../utils/auth");
const models_1 = require("../models");
// JWT Authentication middleware
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const decoded = (0, auth_1.verifyJWT)(token);
        if (!decoded) {
            return res.status(403).json({
                status: "ERROR",
                message: "Invalid or expired token",
            });
        }
        // Get user from database
        const user = yield models_1.User.findById(decoded.userId);
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
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        res.status(500).json({
            status: "ERROR",
            message: "Authentication error",
        });
    }
});
exports.authenticateToken = authenticateToken;
