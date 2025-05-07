import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken, hashPassword, comparePassword } from '../../../utils/auth';
import config from '../../../config/environment';

jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('../../../config/environment', () => ({
  jwtSecret: 'test_secret'
}));

describe('Auth Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      // モックの設定 - 型を明示的に指定
      jest.spyOn(jwt, 'sign').mockImplementation(() => 'generated-token');
      
      const user = {
        id: 1,
        email: 'test@example.com',
        displayName: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // 関数呼び出し
      const token = generateToken(user);

      // 検証
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          email: 'test@example.com'
        }),
        config.jwtSecret
      );
      expect(token).toBe('generated-token');
    });
  });

  describe('verifyToken', () => {
    it('should verify and return decoded token', () => {
      // モックの設定
      const decodedToken = { id: 1, email: 'test@example.com' };
      jest.spyOn(jwt, 'verify').mockImplementation(() => decodedToken);

      // 関数呼び出し
      const result = verifyToken('valid-token');

      // 検証
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', config.jwtSecret);
      expect(result).toEqual(decodedToken);
    });

    it('should throw error for invalid token', () => {
      // モックの設定
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // 検証
      expect(() => verifyToken('invalid-token')).toThrow('Invalid token');
    });
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      // モックの設定
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);

      // 関数呼び出し
      const result = await hashPassword('password123');

      // 検証
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(result).toBe('hashed-password');
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      // モックの設定
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      // 関数呼び出し
      const result = await comparePassword('password123', 'hashed-password');

      // 検証
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      // モックの設定
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      // 関数呼び出し
      const result = await comparePassword('wrong-password', 'hashed-password');

      // 検証
      expect(bcrypt.compare).toHaveBeenCalledWith('wrong-password', 'hashed-password');
      expect(result).toBe(false);
    });
  });
});
