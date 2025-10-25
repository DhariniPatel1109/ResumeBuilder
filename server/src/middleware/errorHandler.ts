import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export class ErrorHandler {
  /**
   * Global error handler middleware
   */
  static handle(error: Error, req: Request, res: Response, next: NextFunction): void {
    console.error('Global error handler:', error);

    const response: ApiResponse = {
      success: false,
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message
    };

    res.status(500).json(response);
  }

  /**
   * 404 handler for undefined routes
   */
  static notFound(req: Request, res: Response, next: NextFunction): void {
    const response: ApiResponse = {
      success: false,
      error: `Route ${req.originalUrl} not found`
    };

    res.status(404).json(response);
  }
}
