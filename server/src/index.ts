import 'dotenv/config';
import app from './app';
import { config } from './config';
import { env } from './config/env';

const server = app.listen(config.server.port, config.server.host, () => {
  console.log(`🚀 ResumeBuilder Server running on ${config.server.host}:${config.server.port}`);
  console.log(`📊 Health check: http://${config.server.host}:${config.server.port}/health`);
  console.log(`📄 API docs: http://${config.server.host}:${config.server.port}/api`);
  console.log(`🌍 Environment: ${config.server.nodeEnv}`);
  console.log(`🔗 CORS Origin: ${config.cors.origin}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
