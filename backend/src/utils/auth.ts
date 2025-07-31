import jwt from "jsonwebtoken";

// Generate JWT token
export const generateJWT = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" } // Token expires in 7 days
  );
};

// Verify JWT token
export const verifyJWT = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
};

// Generate OTP expiry time (10 minutes from now)
export const generateOTPExpiry = (): Date => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

// Check if OTP is expired
export const isOTPExpired = (expiryTime: Date): boolean => {
  return new Date() > expiryTime;
};
