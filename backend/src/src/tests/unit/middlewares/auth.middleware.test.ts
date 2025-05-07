import { Request, Response, NextFunction } from 'express';
import { authMiddleware, AuthRequest } from '../../../middlewares/auth.middleware';
import * as authUtils from '../../../utils/auth';

jest.mock('../../../utils/auth');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn().mockReturnValue({});
    statusMock = jest.fn().mockReturnThis();

    mockRequest = {
      headers: {},
    };

    mockResponse = {
      json: jsonMock,
      status: statusMock,
    };

    nextFunction = jest.fn();

    jest.clearAllMocks();
  });

  it('should call next function when token is valid', () => {
    // モックの設定
    mockRequest.headers = {
      authorization: 'Bearer valid-token',
    };

    (authUtils.verifyToken as jest.Mock).mockReturnValue({ id: 1, email: 'test@example.com' });

    // ミドルウェア呼び出し
    authMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    // 検証
    expect(authUtils.verifyToken).toHaveBeenCalledWith('valid-token');
    expect(nextFunction).toHaveBeenCalled();
    expect((mockRequest as AuthRequest).user).toEqual({ id: 1, email: 'test@example.com' });
  });

  it('should return 401 when no authorization header is present', () => {
    // ミドルウェア呼び出し
    authMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    // 検証
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ message: '認証トークンがありません' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 when token format is invalid', () => {
    // モックの設定
    mockRequest.headers = {
      authorization: 'InvalidFormat',
    };

    // ミドルウェア呼び出し
    authMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    // 検証
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ message: '認証トークンの形式が不正です' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 when token verification fails', () => {
    // モックの設定
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    };

    (authUtils.verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // ミドルウェア呼び出し
    authMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    // 検証
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ message: '認証に失敗しました' });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
