import dotenv from 'dotenv';
import path from 'path';

// テスト環境用の.envファイルを読み込む
dotenv.config({ path: path.resolve(__dirname, '../../../.env.test') });

// Mock DB setup
import { Pool } from 'pg';

// データベース接続のモック
jest.mock('../../config/database', () => {
  const mockPool = {
    connect: jest.fn().mockImplementation(() => {
      return {
        query: jest.fn(),
        release: jest.fn(),
      };
    }),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { default: mockPool };
});

// グローバルなテスト前後の処理を設定できます
beforeAll(async () => {
  // テスト開始前の共通処理
});

afterAll(async () => {
  // テスト終了後の共通処理
});
