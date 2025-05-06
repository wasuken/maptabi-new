export interface Diary {
  id: number;
  userId: number;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryInput {
  title: string;
  content: string;
  isPublic?: boolean;
}

export interface DiaryWithLocations extends Diary {
  locations: Location[];
}
