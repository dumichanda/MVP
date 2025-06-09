import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  verified: boolean;
  created_at: string;
  interests: string[] | null;
  phone: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function createUser(email: string, password: string, userData: {
  fullName: string;
  phone?: string;
}): Promise<User> {
  const hashedPassword = await hashPassword(password);
  
  const result = await query(
    `INSERT INTO users (email, password_hash, full_name, phone) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, email, full_name, avatar_url, bio, location, verified, created_at, interests, phone`,
    [email, hashedPassword, userData.fullName, userData.phone]
  );
  
  return result.rows[0];
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const user = result.rows[0];
  const isValid = await verifyPassword(password, user.password_hash);
  
  if (!isValid) {
    return null;
  }
  
  // Return user without password hash
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await query(
    `SELECT id, email, full_name, avatar_url, bio, location, verified, created_at, interests, phone 
     FROM users WHERE id = $1`,
    [id]
  );
  
  return result.rows[0] || null;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const fields = Object.keys(updates).filter(key => key !== 'id');
  const values = fields.map(field => updates[field as keyof User]);
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  
  const result = await query(
    `UPDATE users SET ${setClause}, updated_at = NOW() 
     WHERE id = $1 
     RETURNING id, email, full_name, avatar_url, bio, location, verified, created_at, interests, phone`,
    [id, ...values]
  );
  
  return result.rows[0];
}