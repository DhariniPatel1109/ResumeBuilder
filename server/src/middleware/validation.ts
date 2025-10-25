import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse } from '../types';

export class ValidationMiddleware {
  /**
   * Validate request body against schema
   */
  static validateBody(schema: Joi.ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const { error } = schema.validate(req.body);
      
      if (error) {
        const response: ApiResponse = {
          success: false,
          error: error.details[0].message
        };
        res.status(400).json(response);
        return;
      }
      
      next();
    };
  }

  /**
   * Validate request query against schema
   */
  static validateQuery(schema: Joi.ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const { error } = schema.validate(req.query);
      
      if (error) {
        const response: ApiResponse = {
          success: false,
          error: error.details[0].message
        };
        res.status(400).json(response);
        return;
      }
      
      next();
    };
  }
}

// Common validation schemas
export const validationSchemas = {
  saveVersion: Joi.object({
    companyName: Joi.string().min(1).max(100).required(),
    sections: Joi.object({
      personalSummary: Joi.string().required(),
      workExperience: Joi.array().items(
        Joi.object({
          title: Joi.string().required(),
          company: Joi.string().required(),
          duration: Joi.string().required(),
          bullets: Joi.array().items(Joi.string()).required()
        })
      ).required(),
      projects: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          description: Joi.string().required(),
          bullets: Joi.array().items(Joi.string()).required()
        })
      ).required()
    }).required()
  }),

  export: Joi.object({
    sections: Joi.object().required(),
    companyName: Joi.string().min(1).max(100).required()
  })
};
