export interface DiaryLocation {
  id: number;
  diaryId: number;
  name?: string;
  coordinates: string; // WKB形式の地理空間データ
  latitude: number; // クライアント使用用
  longitude: number; // クライアント使用用
  altitude?: number;
  recordedAt?: Date;
  orderIndex: number;
  createdAt: Date;
}

export interface LocationInput {
  diaryId: number;
  name?: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  recordedAt?: Date;
  orderIndex?: number;
}
