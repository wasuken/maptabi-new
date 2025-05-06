import app from './app';
import logger from './utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

// 適切なシャットダウン処理
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});
