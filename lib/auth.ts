import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, getUserById } from './db';
import { logger, handleApiError } from './logger';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key';

if (!process.env.NEXTAUTH_SECRET) {
  logger.warn('NEXTAUTH_SECRET not set, using fallback', 'Auth');
}

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

// Hash password with error handling
export async function hashPassword(password: string): Promise<string> {
  try {
    logger.debug('Hashing password', undefined, 'Auth');
    const hash = await bcrypt.hash(password, 12);
    logger.debug('Password hashed successfully', undefined, 'Auth');
    return hash;
  } catch (error) {
    logger.error('Failed to hash password', 'Auth');
    throw error;
  }
}

// Verify password with error handling
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    logger.debug('Verifying password', undefined, 'Auth');
    const isValid = await bcrypt.compare(password, hashedPassword);
    logger.debug('Password verification result', { isValid }, 'Auth');
    return isValid;
  } catch (error) {
    logger.error('Failed to verify password', 'Auth');
    throw error;
  }
}

// Generate JWT token with error handling
export function generateToken(userId: string): string {
  try {
    logger.debug('Generating JWT token', { userId }, 'Auth');
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    logger.debug('JWT token generated successfully', undefined, 'Auth');
    return token;
  } catch (error) {
    logger.error('Failed to generate JWT token', 'Auth');
    throw error;
  }
}

// Verify JWT token with comprehensive error handling
export function verifyToken(token: string): { userId: string } | null {
  try {
    logger.debug('Verifying JWT token', undefined, 'Auth');
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    logger.debug('JWT token verified successfully', { userId: decoded.userId }, 'Auth');
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('JWT token expired', 'Auth');
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid JWT token', 'Auth');
    } else {
      logger.error('JWT token verification failed', 'Auth');
    }
    return null;
  }
}

// Sign up user with comprehensive error handling
export async function signUp(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<AuthResult> {
  try {
    logger.info('Starting user sign up', { email: userData.email }, 'Auth');
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists
    logger.debug('Checking if user exists', { email }, 'Auth');
    const existingUserResult = await query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existingUserResult.rows.length > 0) {
      logger.warn('User already exists', { email }, 'Auth');
      return { success: false, error: 'User already exists' };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    logger.debug('Creating new user in database', { email }, 'Auth');
    const newUserResult = await query(
      'INSERT INTO users (email, password, first_name, last_name, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [email, hashedPassword, firstName, lastName]
    );

    const newUser = newUserResult.rows[0];
    logger.info('User created successfully', { userId: newUser.id }, 'Auth');

    // Generate token
    const token = generateToken(newUser.id);

    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        verified: newUser.verified || false,
        createdAt: newUser.created_at,
      },
      token,
    };
  } catch (error) {
    logger.error('Sign up failed', 'Auth');
    handleApiError(error, 'signUp');
    return { success: false, error: 'Failed to create account' };
  }
}

// Sign in user with comprehensive error handling
export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    logger.info('Starting user sign in', { email }, 'Auth');

    // Get user from database
    logger.debug('Fetching user from database', { email }, 'Auth');
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      logger.warn('User not found during sign in', { email }, 'Auth');
      return { success: false, error: 'Invalid credentials' };
    }

    const user = userResult.rows[0];
    logger.debug('User found, verifying password', { userId: user.id }, 'Auth');

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      logger.warn('Invalid password during sign in', { userId: user.id }, 'Auth');
      return { success: false, error: 'Invalid credentials' };
    }

    logger.info('Sign in successful', { userId: user.id }, 'Auth');

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
    logger.error('Sign in failed', 'Auth');
    handleApiError(error, 'signIn');
    return { success: false, error: 'Failed to sign in' };
  }
}

// Get user from token with comprehensive error handling
export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    if (!token) {
      logger.debug('No token provided', undefined, 'Auth');
      return null;
    }

    logger.debug('Getting user from token', undefined, 'Auth');
    const decoded = verifyToken(token);
    if (!decoded) {
      logger.debug('Token verification failed', undefined, 'Auth');
      return null;
    }

    logger.debug('Fetching user data from database', { userId: decoded.userId }, 'Auth');
    const userResult = await query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    
    if (userResult.rows.length === 0) {
      logger.warn('User not found for valid token', { userId: decoded.userId }, 'Auth');
      return null;
    }

    const userData = userResult.rows[0];
    logger.debug('User data retrieved successfully', { userId: userData.id }, 'Auth');
    
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
    logger.error('Failed to get user from token', 'Auth');
    handleApiError(error, 'getUserFromToken');
    return null;
  }
}