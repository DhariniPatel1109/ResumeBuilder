/**
 * Logger Service - Centralized logging with different levels
 * Supports: debug, info, warn, error
 * Configurable via LOG_LEVEL environment variable
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  data?: any;
  component?: string;
}

class Logger {
  private logLevel: LogLevel;
  private enableConsole: boolean;

  constructor() {
    // Get log level from environment
    const envLogLevel = process.env.LOG_LEVEL?.toLowerCase() || 'info';
    this.logLevel = this.parseLogLevel(envLogLevel);
    this.enableConsole = process.env.ENABLE_CONSOLE !== 'false';
  }

  private parseLogLevel(level: string): LogLevel {
    switch (level) {
      case 'debug': return LogLevel.DEBUG;
      case 'info': return LogLevel.INFO;
      case 'warn': return LogLevel.WARN;
      case 'error': return LogLevel.ERROR;
      default: return LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(level: string, message: string, data?: any, component?: string): string {
    const timestamp = new Date().toISOString();
    const componentStr = component ? `[${component}]` : '';
    const dataStr = data ? ` ${JSON.stringify(data, null, 2)}` : '';
    
    return `${timestamp} ${level.toUpperCase()}${componentStr} ${message}${dataStr}`;
  }

  private log(level: LogLevel, levelName: string, message: string, data?: any, component?: string): void {
    if (!this.shouldLog(level)) return;

    const formattedMessage = this.formatMessage(levelName, message, data, component);
    
    if (this.enableConsole) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage);
          break;
        case LogLevel.ERROR:
          console.error(formattedMessage);
          break;
      }
    }
  }

  debug(message: string, data?: any, component?: string): void {
    this.log(LogLevel.DEBUG, 'debug', message, data, component);
  }

  info(message: string, data?: any, component?: string): void {
    this.log(LogLevel.INFO, 'info', message, data, component);
  }

  warn(message: string, data?: any, component?: string): void {
    this.log(LogLevel.WARN, 'warn', message, data, component);
  }

  error(message: string, data?: any, component?: string): void {
    this.log(LogLevel.ERROR, 'error', message, data, component);
  }

  // Convenience methods for common patterns
  apiRequest(method: string, url: string, data?: any): void {
    this.info(`${method} ${url}`, data, 'API');
  }

  apiResponse(method: string, url: string, status: number, data?: any): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const levelName = status >= 400 ? 'error' : 'info';
    this.log(level, levelName, `${method} ${url} - ${status}`, data, 'API');
  }

  fileOperation(operation: string, filePath: string, data?: any): void {
    this.info(`${operation}: ${filePath}`, data, 'FILE');
  }

  parsingStep(step: string, data?: any): void {
    this.debug(`Parsing: ${step}`, data, 'PARSER');
  }

  sectionDetection(sectionName: string, type: string, data?: any): void {
    this.debug(`Section detected: ${sectionName} (${type})`, data, 'PARSER');
  }

  contentExtraction(type: string, count: number, data?: any): void {
    this.debug(`Content extracted: ${type} (${count} items)`, data, 'PARSER');
  }
}

// Export singleton instance
export const logger = new Logger();
export default logger;
