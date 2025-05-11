// APIエラー型の定義
export interface ApiError {
  message: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}
