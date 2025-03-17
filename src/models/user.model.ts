// src/models/user.model.ts
export interface User {
    id: string;
    username: string;
    email: string;
    password: string; // This should be the hashed password
    isVerified: boolean;
  }
  
  // In-memory database for users
  export class UserStore {
    private users: Map<string, User> = new Map();
    
    // Find user by ID
    findById(id: string): User | undefined {
      return this.users.get(id);
    }
    
    // Find user by username
    findByUsername(username: string): User | undefined {
      for (const user of this.users.values()) {
        if (user.username === username) {
          return user;
        }
      }
      return undefined;
    }
    
    // Find user by email
    findByEmail(email: string): User | undefined {
      for (const user of this.users.values()) {
        if (user.email === email) {
          return user;
        }
      }
      return undefined;
    }
    
    // Create a new user
    create(user: User): User {
      this.users.set(user.id, user);
      return user;
    }
    
    // Update a user
    update(id: string, userData: Partial<User>): User | undefined {
      const existingUser = this.users.get(id);
      if (!existingUser) {
        return undefined;
      }
      
      const updatedUser = { ...existingUser, ...userData };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    
    // Delete a user
    delete(id: string): boolean {
      return this.users.delete(id);
    }
  }
  
  // Singleton instance of the user store
  export const userStore = new UserStore();