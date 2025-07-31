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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = exports.generateOTP = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Create email transporter using Gmail SMTP
const createTransporter = () => {
    return nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};
// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
// Send OTP email
const sendOTPEmail = (email, otp, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: {
                name: "Note Taking App",
                address: process.env.EMAIL_USER,
            },
            to: email,
            subject: "Your OTP Code - Note Taking App",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #337DFF; text-align: center;">Welcome to Note Taking App!</h2>
          
          <p>Hi${name ? ` ${name}` : ""},</p>
          
          <p>Thank you for signing up! Please use the following OTP code to verify your email address:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #337DFF; letter-spacing: 8px;">${otp}</span>
          </div>
          
          <p style="color: #666;">This OTP will expire in 10 minutes for security reasons.</p>
          
          <p>If you didn't request this, please ignore this email.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            This is an automated email. Please do not reply.
          </p>
        </div>
      `,
        };
        yield transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent successfully to ${email}`);
        return true;
    }
    catch (error) {
        console.error("❌ Failed to send OTP email:", error);
        return false;
    }
});
exports.sendOTPEmail = sendOTPEmail;
