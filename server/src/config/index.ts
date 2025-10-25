// Server Configuration
export const config = {
  // Server Configuration
  server: {
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // CORS Configuration
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },

  // File Upload Configuration
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['.docx', '.doc', '.pdf'],
    tempDir: 'uploads',
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },

  // Directories
  directories: {
    uploads: 'uploads',
    versions: 'versions',
    temp: 'temp',
  },

  // API Configuration
  api: {
    basePath: '/api',
    version: 'v1',
    timeout: 30000, // 30 seconds
  },

  // Export Configuration
  export: {
    word: {
      defaultFontSize: 20,
      titleFontSize: 24,
    },
    pdf: {
      format: 'A4',
      margin: {
        top: '1in',
        right: '1in',
        bottom: '1in',
        left: '1in',
      },
    },
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: process.env.NODE_ENV !== 'production',
  },

  // Security Configuration
  security: {
    helmet: {
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    },
  },
} as const;

// Environment-specific overrides
if (config.server.nodeEnv === 'production') {
  config.cors.origin = process.env.CLIENT_URL || 'https://your-production-domain.com';
  config.logging.enableConsole = false;
}

if (config.server.nodeEnv === 'test') {
  config.server.port = 0; // Use random port for tests
  config.rateLimit.max = 1000; // Higher limit for tests
}

export default config;
