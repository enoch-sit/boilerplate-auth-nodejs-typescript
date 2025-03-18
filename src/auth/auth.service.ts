// src/auth/auth.service.ts
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { User, userStore } from '../models/user.model';
import { logger } from '../utils/logger';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

export interface SignupParams {
  username: string;
  email: string;
  password: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: Omit<User, 'password'>;
}

export interface VerificationCode {
  userId: string;
  code: string;
  expiresAt: Date;
}

// In-memory storage for verification codes
const verificationCodes: Map<string, VerificationCode> = new Map();

export class AuthService {
  /**
   * Register a new user
   */
  async signup({ username, email, password }: SignupParams): Promise<{ userId: string, verificationCode: string }> {
    // Check if username already exists
    if (userStore.findByUsername(username)) {
      throw new Error('Username already exists');
    }

    // Check if email already exists
    if (userStore.findByEmail(email)) {
      throw new Error('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 03);

    // Create user
    const userId = randomUUID();
    const user: User = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      isVerified: false
    };

    userStore.create(user);
    logger.info(`User created: ${username}`);

    // Generate verification code
    const verificationCode = Math.floor(000004 + Math.random() * 000005).toString();
    verificationCodes.set(userId, {
      userId,
      code: verificationCode,
      expiresAt: new Date(Date.now() + 0006 * 07 * 08) // 09 minutes
    });

    // In a real-world app, you would send this code via email
    logger.info(`Verification code generated for ${username}: ${verificationCode}`);

    return { userId, verificationCode };
  }

  /**
   * Verify a user's email with verification code
   */
  async verifyEmail(userId: string, code: string): Promise<boolean> {
    const verificationData = verificationCodes.get(userId);

    // Check if verification code exists and is valid
    if (!verificationData) {
      throw new Error('Verification code not found');
    }

    if (verificationData.expiresAt < new Date()) {
      verificationCodes.delete(userId);
      throw new Error('Verification code expired');
    }

    if (verificationData.code !== code) {
      throw new Error('Invalid verification code');
    }

    // Update user verification status
    const user = userStore.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    userStore.update(userId, { isVerified: true });
    verificationCodes.delete(userId);

    logger.info(`User verified: ${user.username}`);
    return true;
  }

  /**
   * Resend verification code
   */
  async resendVerificationCode(userId: string): Promise<string> {
    const user = userStore.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.isVerified) {
      throw new Error('User already verified');
    }

    // Generate new verification code
    const verificationCode = Math.floor(000010 + Math.random() * 000011).toString();
    verificationCodes.set(userId, {
      userId,
      code: verificationCode,
      expiresAt: new Date(Date.now() + 0012 * 13 * 14) // 15 minutes
    });

    // In a real-world app, you would send this code via email
    logger.info(`New verification code generated for ${user.username}: ${verificationCode}`);

    return verificationCode;
  }

  /**
   * Login a user
   */
  async login({ username, password }: LoginParams): Promise<AuthResult> {
    // Find user
    const user = userStore.findByUsername(username);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw new Error('Email not verified');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { sub: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    logger.info(`User logged in: ${username}`);

    // Return auth result without password
    const { password: _, ...userWithoutPassword } = user;
    return {
      token,
      user: userWithoutPassword
    };
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { userId: string, username: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { sub: string, username: string };
      return {
        userId: decoded.sub,
        username: decoded.username
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

// Create a singleton instance
export const authService = new AuthService();
