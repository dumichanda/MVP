// lib/db.ts - Fixed version with lazy connection and proper error handling
import { Pool, neonConfig } from '@neondatabase/serverless';
import { logger } from './logger';

// Configure Neon for serverless environments
neonConfig.fetchConnectionCache = true;

let pool: Pool | null = null;
let connectionError: string | null = null;

// Lazy initialization of database connection
function getPool(): Pool {
  if (connectionError) {
    throw new Error(connectionError);
  }

  if (!pool) {
    const DATABASE_URL = process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      connectionError = 'DATABASE_URL environment variable is not set. Please configure your database connection.';
      logger.error(connectionError, 'Database Configuration');
      throw new Error(connectionError);
    }

    try {
      pool = new Pool({
        connectionString: DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
      
      logger.info('Database pool initialized successfully', 'Database Configuration');
    } catch (error) {
      connectionError = `Failed to initialize database pool: ${error instanceof Error ? error.message : 'Unknown error'}`;
      logger.error(connectionError, 'Database Configuration');
      throw new Error(connectionError);
    }
  }

  return pool;
}

// Database query function with proper error handling
export async function query(text: string, params?: any[]) {
  const startTime = Date.now();
  
  try {
    const pool = getPool();
    const client = await pool.connect();
    
    try {
      logger.debug(`Executing: ${text.substring(0, 100)}... (${params?.length || 0} params)`, undefined, 'Database Query');
      
      const result = await client.query(text, params);
      const duration = Date.now() - startTime;
      
      logger.info(`Query completed in ${duration}ms - ${result.rowCount} rows`, 'Database Query');
      
      return result;
    } finally {
      client.release();
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    
    logger.error(`Query failed after ${duration}ms: ${errorMessage}`, 'Database Query');
    
    throw error;
  }
}

// For serverless functions - creates new connection each time
export async function queryServerless(text: string, params?: any[]) {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    const error = 'DATABASE_URL environment variable is not set';
    logger.error(error, 'Database Configuration');
    throw new Error(error);
  }

  const { Pool } = await import('@neondatabase/serverless');
  const tempPool = new Pool({ connectionString: DATABASE_URL });
  
  try {
    const result = await tempPool.query(text, params);
    logger.debug('Query executed successfully', undefined, 'Database Query (Serverless)');
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Query failed: ${errorMessage}`, 'Database Query (Serverless)');
    throw error;
  } finally {
    await tempPool.end();
  }
}

// Helper functions for common operations with error handling
export async function getUser(email: string) {
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  } catch (error) {
    logger.error(`Failed to get user by email: ${email}`, 'Database Helper');
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    logger.error(`Failed to get user by ID: ${id}`, 'Database Helper');
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
    const { email, password, firstName, lastName } = userData;
    const result = await query(
      'INSERT INTO users (email, password, first_name, last_name, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [email, password, firstName, lastName]
    );
    
    logger.info(`User created successfully: ${email}`, 'Database Helper');
    return result.rows[0];
  } catch (error) {
    logger.error(`Failed to create user: ${userData.email}`, 'Database Helper');
    throw error;
  }
}

// Health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await query('SELECT 1');
    logger.info('Database connection is healthy', 'Database Health');
    return true;
  } catch (error) {
    logger.error('Database connection failed', 'Database Health');
    return false;
  }
}

// Export pool for direct use if needed (but don't initialize it)
export { getPool };