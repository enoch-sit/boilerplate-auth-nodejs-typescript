// src/routes/protected.routes.ts
import { Router, Request, Response } from 'express';
import { authenticate } from '../auth/auth.middleware';
import { userStore } from '../models/user.model';

const router = Router();

// Get user profile
router.get('/profile', authenticate, (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  if (!userId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  
  const user = userStore.findById(userId);
  
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  
  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  
  res.status(200).json({
    user: userWithoutPassword
  });
});

// Protected resource example
router.get('/dashboard', authenticate, (req: Request, res: Response) => {
  // This is just an example protected route
  res.status(200).json({
    message: 'This is protected content for your dashboard',
    user: req.user
  });
});

export default router;
