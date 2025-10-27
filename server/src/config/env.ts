// Environment Configuration
export const env = {
  // Server Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  HOST: process.env.HOST || 'localhost',

  // Client Configuration
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  VERSIONS_DIR: process.env.VERSIONS_DIR || 'versions',

  // Rate Limiting
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),

  // Security
  CORS_ORIGIN: process.env.CORS_ORIGIN || process.env.CLIENT_URL || 'http://localhost:3000',
  ENABLE_HELMET: process.env.ENABLE_HELMET !== 'false',

  // AI Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  
  // Logging Configuration
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  ENABLE_CONSOLE: process.env.ENABLE_CONSOLE !== 'false',

  // Development
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const;

// Validation
export const validateEnv = (): void => {
  const required = ['NODE_ENV'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  switch (env.NODE_ENV) {
    case 'development':
      return {
        cors: { origin: env.CLIENT_URL },
        rateLimit: { max: 1000 }, // Higher limit for development
        logging: { level: 'debug' },
      };
    
    case 'production':
      return {
        cors: { origin: env.CLIENT_URL },
        rateLimit: { max: env.RATE_LIMIT_MAX },
        logging: { level: 'warn' },
      };
    
    case 'test':
      return {
        cors: { origin: '*' },
        rateLimit: { max: 10000 },
        logging: { level: 'error' },
      };
    
    default:
      return {
        cors: { origin: env.CLIENT_URL },
        rateLimit: { max: env.RATE_LIMIT_MAX },
        logging: { level: 'info' },
      };
  }
};

export default env;
