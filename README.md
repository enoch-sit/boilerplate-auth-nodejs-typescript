# Simplified Authentication System 2025

## Project Overview

This project implements a simple authentication system using Node.js, Express, and TypeScript. It provides endpoints for user registration, login, email verification, and access to protected resources.

## Installation Guide

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/simplified-auth.git
   cd simplified-auth
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory based on `.env.example`.
   - Set `PORT` and `LOG_LEVEL` as needed.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. For production, build and start the server:

   ```bash
   npm run build
   npm start
   ```

## API Documentation

### Endpoints

#### Authentication Endpoints

- **POST /api/auth/signup**
  - Description: Register a new user
  - Request Body:

    ```json
    {
      "username": "exampleUser",
      "email": "example@example.com",
      "password": "securePassword123"
    }
    ```

  - Response:

    ```json
    {
      "message": "User registered successfully. Please verify your email.",
      "userId": "user123",
      "verificationCode": "123456"
    }
    ```

- **POST /api/auth/verify-email**
  - Description: Verify user's email with a confirmation code
  - Request Body:

    ```json
    {
      "userId": "user123",
      "code": "123456"
    }
    ```

  - Response:

    ```json
    {
      "message": "Email verified successfully"
    }
    ```

- **POST /api/auth/resend-verification**
  - Description: Resend email verification code
  - Request Body:

    ```json
    {
      "userId": "user123"
    }
    ```

  - Response:

    ```json
    {
      "message": "Verification code resent",
      "verificationCode": "654321"
    }
    ```

- **POST /api/auth/login**
  - Description: Login with username and password
  - Request Body:

    ```json
    {
      "username": "exampleUser",
      "password": "securePassword123"
    }
    ```

  - Response:

    ```json
    {
      "message": "Login successful",
      "token": "jwtTokenHere",
      "user": {
        "userId": "user123",
        "username": "exampleUser"
      }
    }
    ```

#### Protected Endpoints

- **GET /api/profile**
  - Description: Get user profile (requires authentication)
  - Headers:

    ```json
    {
      "Authorization": "Bearer jwtTokenHere"
    }
    ```

  - Response:

    ```json
    {
      "user": {
        "userId": "user123",
        "username": "exampleUser",
        "email": "example@example.com"
      }
    }
    ```

- **GET /api/dashboard**
  - Description: Example protected route (requires authentication)
  - Headers:

    ```json
    {
      "Authorization": "Bearer jwtTokenHere"
    }
    ```

  - Response:

    ```json
    {
      "message": "This is protected content for your dashboard",
      "user": {
        "userId": "user123",
        "username": "exampleUser"
      }
    }
    ```

### Authentication

Authentication is handled using JSON Web Tokens (JWT). The `authenticate` middleware in `src/auth/auth.middleware.ts` verifies the JWT token sent in the `Authorization` header of the request. If the token is valid, the user's information is attached to the request object for use in protected routes.

### Error Handling

Errors are logged using Winston and returned to the client with appropriate HTTP status codes. The global error handler in `src/app.ts` catches any unhandled errors and sends a 500 Internal Server Error response. Specific error messages are logged to the console for debugging purposes.

### Dependencies

The project uses the following main dependencies:

- **express**: Web framework for Node.js
- **cors**: Middleware to enable CORS
- **dotenv**: Loads environment variables from a `.env` file
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT token generation and verification
- **winston**: Logging library

For development, the following dependencies are used:

- **typescript**: TypeScript compiler
- **ts-node-dev**: TypeScript node development server
- **@types/***: TypeScript type definitions for dependencies
