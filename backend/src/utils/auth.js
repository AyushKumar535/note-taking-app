"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOTPExpired = exports.generateOTPExpiry = exports.verifyJWT = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Generate JWT token
const generateJWT = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" } // Token expires in 7 days
    );
};
exports.generateJWT = generateJWT;
// Verify JWT token
const verifyJWT = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.verifyJWT = verifyJWT;
// Generate OTP expiry time (10 minutes from now)
const generateOTPExpiry = () => {
    return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};
exports.generateOTPExpiry = generateOTPExpiry;
// Check if OTP is expired
const isOTPExpired = (expiryTime) => {
    return new Date() > expiryTime;
};
exports.isOTPExpired = isOTPExpired;
