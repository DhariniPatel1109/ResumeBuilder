import 'dotenv/config';
import app from './app';
import { config } from './config';
import { env } from './config/env';
import { logger } from './services/Logger';

const server = app.listen(Number(config.server.port), config.server.host, () => {
  logger.info('ResumeBuilder Server started', {
    host: config.server.host,
    port: config.server.port,
    environment: config.server.nodeEnv,
    corsOrigin: config.cors.origin,
    logLevel: env.LOG_LEVEL
  }, 'Server');
  
  logger.info('Server endpoints', {
    healthCheck: `http://${config.server.host}:${config.server.port}/health`,
    apiDocs: `http://${config.server.host}:${config.server.port}/api`
  }, 'Server');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully', {}, 'Server');
  server.close(() => {
    logger.info('Process terminated', {}, 'Server');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully', {}, 'Server');
  server.close(() => {
    logger.info('Process terminated', {}, 'Server');
  });
});
