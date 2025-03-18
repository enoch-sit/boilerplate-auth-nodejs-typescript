    }
  }
}

/**
 * Authentication middleware that verifies JWT tokens
 * JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties.
 * It's used here to securely transmit information between the client and server as a means of authentication.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
/**
 * Authentication middleware that verifies JWT tokens
 * JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties.
 * It's used here to securely transmit information between the client and server as a means of authentication.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Check if the authorization header is present in the request
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // If no authorization header is provided, send an error response
    res.status(401).json({ error: 'No authorization header provided' });
    return;
  }

  // Split the authorization header into parts to check the format
  const parts = authHeader.split(' ');
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Check if the authorization header is present in the request
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // If no authorization header is provided, send an error response
    res.status(401).json({ error: 'No authorization header provided' });
    return;
  }

  // Split the authorization header into parts to check the format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    // If the format is incorrect, send an error response
    res.status(401).json({ error: 'Invalid authorization format' });
    return;
  }

  // Extract the token from the header
  const token = parts[1];

  try {
    // Verify the token using the authService
    const decoded = authService.verifyToken(token);
    // If the token is valid, attach the decoded user information to the request object
    req.user = decoded;
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If there's an error during token verification, log it and send an error response
    logger.error(`Authentication error: ${error}`);
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
};

// The `req.user` object is used to store user information after successful authentication
// It can be accessed in subsequent middleware or route handlers to identify the authenticated user
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
