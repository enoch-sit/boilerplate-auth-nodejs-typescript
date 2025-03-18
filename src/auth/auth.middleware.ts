// src/auth/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        username: string;
      };
    }
  }
}

/**
 * Authentication middleware that verifies JWT tokens
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    res.status(401).json({ error: 'No authorization header provided' });
    return;
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ error: 'Invalid authorization format' });
    return;
  }
  
  const token = parts[1];
  
  try {
    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error}`);
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
};
