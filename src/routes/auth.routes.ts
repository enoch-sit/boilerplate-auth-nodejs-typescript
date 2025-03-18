// src/routes/auth.routes.ts
import { Router, Request, Response } from 'express';
import { authService, SignupParams, LoginParams } from '../auth/auth.service';
import { logger } from '../utils/logger';

const router = Router();

// Register a new user
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    const signupParams: SignupParams = { username, email, password };
    const result = await authService.signup(signupParams);
    
    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      userId: result.userId,
      // In a real app, you wouldn't return this to the client, 
      // but it's helpful for testing
      verificationCode: result.verificationCode
    });
  } catch (error: any) {
    logger.error(`Signup error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

// Verify email with confirmation code
router.post('/verify-email', async (req: Request, res: Response) => {
  try {
    const { userId, code } = req.body;
    
    if (!userId || !code) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    await authService.verifyEmail(userId, code);
    
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error: any) {
    logger.error(`Verify email error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

// Resend verification code
router.post('/resend-verification', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    
    const verificationCode = await authService.resendVerificationCode(userId);
    
    res.status(200).json({
      message: 'Verification code resent',
      // Again, in a real app, you wouldn't return this to the client
      verificationCode
    });
  } catch (error: any) {
    logger.error(`Resend verification error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    const loginParams: LoginParams = { username, password };
    const result = await authService.login(loginParams);
    
    res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: result.user
    });
  } catch (error: any) {
    logger.error(`Login error: ${error.message}`);
    res.status(401).json({ error: error.message });
  }
});

export default router;
