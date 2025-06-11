// Comprehensive error logging utility
export class Logger {
  private static instance: Logger;
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatError(error: any, context?: string): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}] ` : '';
    
    if (error instanceof Error) {
      return `${timestamp} ${contextStr}ERROR: ${error.message}\nStack: ${error.stack}`;
    }
    
    return `${timestamp} ${contextStr}ERROR: ${JSON.stringify(error)}`;
  }

  error(error: any, context?: string) {
    const formattedError = this.formatError(error, context);
    console.error(formattedError);
    
    // In production, you might want to send to external logging service
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Could send to Sentry, LogRocket, etc.
    }
  }

  warn(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}] ` : '';
    console.warn(`${timestamp} ${contextStr}WARN: ${message}`);
  }

  info(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}] ` : '';
    console.info(`${timestamp} ${contextStr}INFO: ${message}`);
  }

  debug(message: string, data?: any, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      const contextStr = context ? `[${context}] ` : '';
      console.debug(`${timestamp} ${contextStr}DEBUG: ${message}`, data || '');
    }
  }
}

export const logger = Logger.getInstance();

// Error boundary hook for React components
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    logger.error(error, 'React Error Boundary');
    logger.debug('Error Info', errorInfo, 'React Error Boundary');
  };
}

// API error handler
export function handleApiError(error: any, endpoint: string) {
  logger.error(error, `API:${endpoint}`);
  
  if (error.response) {
    logger.debug('API Response Error', {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    }, `API:${endpoint}`);
  } else if (error.request) {
    logger.debug('API Request Error', error.request, `API:${endpoint}`);
  }
}

// Database error handler
export function handleDbError(error: any, query: string) {
  logger.error(error, 'Database');
  logger.debug('Failed Query', { query }, 'Database');
}