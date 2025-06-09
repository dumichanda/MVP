// lib/db.ts - Fixed version for Neon DB (NO pg imports)
import { Pool, neonConfig } from '@neondatabase/serverless';

// Configure Neon for serverless environments
neonConfig.fetchConnectionCache = true;

// Validate environment variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Database query function with proper error handling
export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// For serverless functions - creates new connection each time
export async function queryServerless(text: string, params?: any[]) {
  const { Pool } = await import('@neondatabase/serverless');
  const tempPool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const result = await tempPool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    await tempPool.end();
  }
}

// Helper functions for common operations
export async function getUser(email: string) {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

export async function getUserById(id: string) {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

export async function createUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const { email, password, firstName, lastName } = userData;
  const result = await query(
    'INSERT INTO users (email, password, first_name, last_name, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
    [email, password, firstName, lastName]
  );
  return result.rows[0];
}

// Export the pool for direct use if needed
export { pool };

// Default export for convenience
export default pool;
