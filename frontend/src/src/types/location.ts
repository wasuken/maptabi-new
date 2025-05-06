export interface DiaryLocation {
  id: number;
  diaryId: number;
  name?: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  recordedAt?: string;
  orderIndex: number;
  createdAt: string;
}

export interface LocationInput {
  name?: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  recordedAt?: string;
  orderIndex?: number;
}
