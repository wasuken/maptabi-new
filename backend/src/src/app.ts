import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorMiddleware } from './middlewares/error.middleware';
import logger from './utils/logger';

// 環境変数の読み込み
dotenv.config();

const app = express();

// ミドルウェア
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// リクエストのロギング
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ルートの設定
app.use('/api', routes);

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// エラーハンドリングミドルウェア
app.use(errorMiddleware);

export default app;
