import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:password@db:5432/maptabi';

const pool = new Pool({
  connectionString: DATABASE_URL,
});

// データベース接続テスト
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    logger.error('Database connection error:', err.stack);
  } else {
    logger.info('Database connected:', res.rows[0]);
  }
});

export default pool;
