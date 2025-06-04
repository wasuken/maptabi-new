export interface Comment {
  id: number;
  locationId: number;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userName?: string;
}

export interface CommentInput {
  content: string;
}
