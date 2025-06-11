// lib/auth.ts - Fixed authentication with proper error handling
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, getUser, createUser } from './db';
import { logger } from './logger';

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
  try {
    const hash = await bcrypt.hash(password, 12);
    logger.debug('Password hashed successfully', undefined, 'Auth');
    return hash;
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)), 'Auth');
    throw error;
  }
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    logger.debug(`Password verification: ${isValid ? 'success' : 'failed'}`, undefined, 'Auth');
    return isValid;
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)), 'Auth');
    throw error;
  }
}

// Generate JWT token
export function generateToken(userId: string): string {
  try {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    logger.debug('JWT token generated successfully', undefined, 'Auth');
    return token;
  } catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)), 'Auth');
    throw error;
  }
}

// Verify JWT token
export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    logger.debug('JWT token verified successfully', undefined, 'Auth');
    return decoded;
  } catch (error) {
    logger.debug(`JWT token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`, undefined, 'Auth');
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
    logger.info(`Sign up attempt for email: ${userData.email}`, 'Auth');
    
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await getUser(email);
    if (existingUser) {
      logger.warn(`Sign up failed - user already exists: ${email}`, 'Auth');
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

    logger.info(`User signed up successfully: ${email}`, 'Auth');

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
    logger.error(error instanceof Error ? error : new Error(`Sign up failed for email: ${userData.email}`), 'Auth');
    return { success: false, error: 'Failed to create account' };
  }
}

// Sign in user
export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    logger.info(`Sign in attempt for email: ${email}`, 'Auth');

    // Get user from database
    const user = await getUser(email);
    if (!user) {
      logger.warn(`Sign in failed - user not found: ${email}`, 'Auth');
      return { success: false, error: 'Invalid credentials' };
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      logger.warn(`Sign in failed - invalid password: ${email}`, 'Auth');
      return { success: false, error: 'Invalid credentials' };
    }

    // Generate token
    const token = generateToken(user.id);

    logger.info(`User signed in successfully: ${email}`, 'Auth');

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
    logger.error(error instanceof Error ? error : new Error(`Sign in failed for email: ${email}`), 'Auth');
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
      logger.warn(`User not found for token: ${decoded.userId}`, 'Auth');
      return null;
    }

    const userData = user.rows[0];
    logger.debug(`User retrieved from token: ${userData.email}`, undefined, 'Auth');
    
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
    logger.error(error instanceof Error ? error : new Error('Failed to get user from token'), 'Auth');
    return null;
  }
}