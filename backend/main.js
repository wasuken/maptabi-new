// app.js (Express版)
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL接続
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// S3 / MinIO接続
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  },
  forcePathStyle: true
});

// APIエンドポイント
// 日記一覧取得
app.get('/api/diaries', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM diaries WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id] // 認証ユーザーID
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 日記作成
app.post('/api/diaries', async (req, res) => {
  const { title, content, locations, tags } = req.body;
  
  // トランザクション処理
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // 日記の登録
    const diaryResult = await client.query(
      'INSERT INTO diaries (user_id, title, content) VALUES ($1, $2, $3) RETURNING id',
      [req.user.id, title, content]
    );
    const diaryId = diaryResult.rows[0].id;
    
    // 位置情報の登録
    if (locations && locations.length > 0) {
      for (let i = 0; i < locations.length; i++) {
        const { name, lat, lng, altitude, recordedAt } = locations[i];
        await client.query(
          'INSERT INTO locations (diary_id, name, coordinates, altitude, recorded_at, order_index) VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography, $5, $6, $7)',
          [diaryId, name, lng, lat, altitude, recordedAt, i]
        );
      }
    }
    
    // タグの登録
    if (tags && tags.length > 0) {
      for (const tagId of tags) {
        await client.query(
          'INSERT INTO diary_tags (diary_id, tag_id) VALUES ($1, $2)',
          [diaryId, tagId]
        );
      }
    }
    
    await client.query('COMMIT');
    res.status(201).json({ id: diaryId });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ... その他のエンドポイント

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
