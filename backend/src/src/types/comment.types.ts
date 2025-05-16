export interface Comment {
  id: number;
  locationId: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  // 追加情報（JOIN時に利用）
  userName?: string;
}

export interface CommentInput {
  content: string;
}
