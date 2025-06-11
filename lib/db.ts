import { Pool, neonConfig } from '@neondatabase/serverless';
import { logger, handleDbError } from './logger';

// Configure Neon for serverless environments
neonConfig.fetchConnectionCache = true;

// Validate environment variables
if (!process.env.DATABASE_URL) {
  const error = new Error('DATABASE_URL environment variable is not set');
  logger.error(error, 'Database Configuration');
  throw error;
}

logger.info('Initializing database connection', 'Database');

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Database query function with comprehensive error handling and logging
export async function query(text: string, params?: any[]) {
  const startTime = Date.now();
  const client = await pool.connect();
  
  try {
    logger.debug('Executing query', { 
      query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      params: params ? params.map(p => typeof p === 'string' && p.length > 50 ? p.substring(0, 50) + '...' : p) : undefined
    }, 'Database');
    
    const result = await client.query(text, params);
    const duration = Date.now() - startTime;
    
    logger.debug('Query completed', { 
      duration: `${duration}ms`,
      rowCount: result.rowCount 
    }, 'Database');
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Query failed after ${duration}ms`, 'Database');
    handleDbError(error, text);
    throw error;
  } finally {
    client.release();
  }
}

// For serverless functions - creates new connection each time
export async function queryServerless(text: string, params?: any[]) {
  const startTime = Date.now();
  
  try {
    logger.debug('Executing serverless query', { 
      query: text.substring(0, 100) + (text.length > 100 ? '...' : '')
    }, 'Database');
    
    const { Pool } = await import('@neondatabase/serverless');
    const tempPool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    const result = await tempPool.query(text, params);
    const duration = Date.now() - startTime;
    
    logger.debug('Serverless query completed', { 
      duration: `${duration}ms`,
      rowCount: result.rowCount 
    }, 'Database');
    
    await tempPool.end();
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Serverless query failed after ${duration}ms`, 'Database');
    handleDbError(error, text);
    throw error;
  }
}

// Helper functions for common operations with error handling
export async function getUser(email: string) {
  try {
    logger.debug('Getting user by email', { email }, 'Database');
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      logger.debug('User not found', { email }, 'Database');
      return null;
    }
    
    logger.debug('User found', { userId: result.rows[0].id }, 'Database');
    return result.rows[0];
  } catch (error) {
    logger.error('Failed to get user by email', 'Database');
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    logger.debug('Getting user by ID', { id }, 'Database');
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      logger.debug('User not found by ID', { id }, 'Database');
      return null;
    }
    
    logger.debug('User found by ID', { userId: id }, 'Database');
    return result.rows[0];
  } catch (error) {
    logger.error('Failed to get user by ID', 'Database');
    throw error;
  }
}

export async function createUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  try {
    logger.debug('Creating new user', { email: userData.email }, 'Database');
    const { email, password, firstName, lastName } = userData;
    
    const result = await query(
      'INSERT INTO users (email, password, first_name, last_name, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [email, password, firstName, lastName]
    );
    
    logger.info('User created successfully', { userId: result.rows[0].id }, 'Database');
    return result.rows[0];
  } catch (error) {
    logger.error('Failed to create user', 'Database');
    throw error;
  }
}

// Test database connection
export async function testConnection() {
  try {
    logger.info('Testing database connection', 'Database');
    const result = await query('SELECT NOW() as current_time');
    logger.info('Database connection successful', { time: result.rows[0].current_time }, 'Database');
    return true;
  } catch (error) {
    logger.error('Database connection test failed', 'Database');
    return false;
  }
}

// Export the pool for direct use if needed
export { pool };

// Default export for convenience
export default pool;