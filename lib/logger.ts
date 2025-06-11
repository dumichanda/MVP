// lib/logger.ts - Simple logger utility
export class Logger {
  private static instance: Logger;
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: string, message: string, context?: string): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}] ` : '';
    return `${timestamp} ${contextStr}${level}: ${message}`;
  }

  error(message: string, context?: string) {
    console.error(this.formatMessage('ERROR', message, context));
  }

  warn(message: string, context?: string) {
    console.warn(this.formatMessage('WARN', message, context));
  }

  info(message: string, context?: string) {
    console.info(this.formatMessage('INFO', message, context));
  }

  debug(message: string, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('DEBUG', message, context));
    }
  }
}

export const logger = Logger.getInstance();

// API error handler
export function handleApiError(error: any, endpoint: string) {
  logger.error(`API Error in ${endpoint}: ${error instanceof Error ? error.message : JSON.stringify(error)}`, 'API');
}