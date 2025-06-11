// lib/logger.ts - Fixed logger utility with proper method signatures
export class Logger {
  private static instance: Logger;
  
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: string, message: string, data?: any, context?: string): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}] ` : '';
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `${timestamp} ${contextStr}${level}: ${message}${dataStr}`;
  }

  error(message: string | Error, context?: string) {
    const errorMessage = message instanceof Error ? message.message : message;
    console.error(this.formatMessage('ERROR', errorMessage, undefined, context));
  }

  warn(message: string, context?: string) {
    console.warn(this.formatMessage('WARN', message, undefined, context));
  }

  info(message: string, context?: string) {
    console.info(this.formatMessage('INFO', message, undefined, context));
  }

  debug(message: string, data?: any, context?: string) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('DEBUG', message, data, context));
    }
  }
}

export const logger = Logger.getInstance();

// API error handler
export function handleApiError(error: any, endpoint: string) {
  const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
  logger.error(`API Error in ${endpoint}: ${errorMessage}`, 'API');
}