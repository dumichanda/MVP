// lib/auth.ts - Fixed authentication using Neon DB
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, getUser, createUser } from './db';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  bio?: string;
  interests?: string[];
  location?: string;
  verified: boolean;
  createdAt: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
}

// Sign up user
export async function signUp(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<AuthResult> {
  try {
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await getUser(email);
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Generate token
    const token = generateToken(newUser.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      success: true,
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        firstName: userWithoutPassword.first_name,
        lastName: userWithoutPassword.last_name,
        verified: userWithoutPassword.verified || false,
        createdAt: userWithoutPassword.created_at,
      },
      token,
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: 'Failed to create account' };
  }
}

// Sign in user
export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    // Get user from database
    const user = await getUser(email);
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Generate token
    const token = generateToken(user.id);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        profilePicture: user.profile_picture,
        bio: user.bio,
        interests: user.interests,
        location: user.location,
        verified: user.verified || false,
        createdAt: user.created_at,
      },
      token,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: 'Failed to sign in' };
  }
}

// Get user from token
export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    const user = await query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    if (!user.rows[0]) {
      return null;
    }

    const userData = user.rows[0];
    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      profilePicture: userData.profile_picture,
      bio: userData.bio,
      interests: userData.interests,
      location: userData.location,
      verified: userData.verified || false,
      createdAt: userData.created_at,
    };
  } catch (error) {
    console.error('Get user from token error:', error);
    return null;
  }
}
