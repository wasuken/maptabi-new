import pool from '../config/database';
import { UserInput, LoginInput, User, AuthResponse } from '../types/user.types';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import logger from '../utils/logger';

export const register = async (userInput: UserInput): Promise<AuthResponse> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // ユーザーの存在確認
    const userExists = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [userInput.email]
    );
    
    if (userExists.rows.length > 0) {
      throw new Error('User already exists');
    }
    
    // パスワードのハッシュ化
    const passwordHash = await hashPassword(userInput.password);
    
    // ユーザーの作成
    const result = await client.query(
      `INSERT INTO users (email, password_hash, display_name, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id, email, display_name, created_at, updated_at`,
      [userInput.email, passwordHash, userInput.displayName]
    );
    
    await client.query('COMMIT');
    
    const user = result.rows[0];
    
    // 応答フォーマットの変換（スネークケース→キャメルケース）
    const formattedUser: User = {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
    
    // JWTトークンの生成
    const token = generateToken(formattedUser);
    
    return {
      user: formattedUser,
      token
    };
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('User registration error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const login = async (loginInput: LoginInput): Promise<AuthResponse> => {
  const client = await pool.connect();
  
  try {
    // ユーザーの取得
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [loginInput.email]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }
    
    const user = result.rows[0];
    
    // パスワードの検証
    const isPasswordValid = await comparePassword(
      loginInput.password,
      user.password_hash
    );
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    
    // 応答フォーマットの変換（スネークケース→キャメルケース）
    const formattedUser: User = {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
    
    // JWTトークンの生成
    const token = generateToken(formattedUser);
    
    return {
      user: formattedUser,
      token
    };
  } catch (error) {
    logger.error('User login error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getUserById = async (userId: number): Promise<User | null> => {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const user = result.rows[0];
    
    // 応答フォーマットの変換（スネークケース→キャメルケース）
    return {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      passwordHash: user.password_hash,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  } catch (error) {
    logger.error('Get user by id error:', error);
    throw error;
  } finally {
    client.release();
  }
};
