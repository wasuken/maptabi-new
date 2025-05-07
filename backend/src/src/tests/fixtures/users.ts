// src/tests/fixtures/users.ts
export const mockUsers = [
  {
    id: 1,
    email: 'test@example.com',
    display_name: 'Test User',
    password_hash: '$2b$10$abcdefghijklmnopqrstuvwxyz',
    created_at: new Date('2024-01-01T00:00:00Z'),
    updated_at: new Date('2024-01-01T00:00:00Z'),
  },
];

// src/tests/fixtures/diaries.ts
export const mockDiaries = [
  {
    id: 1,
    user_id: 1,
    title: 'Test Diary',
    content: 'This is a test diary content',
    is_public: false,
    created_at: new Date('2024-01-01T00:00:00Z'),
    updated_at: new Date('2024-01-01T00:00:00Z'),
  },
];

// src/tests/fixtures/locations.ts
export const mockLocations = [
  {
    id: 1,
    diary_id: 1,
    name: 'Test Location',
    coordinates: 'SRID=4326;POINT(139.7673068 35.6809591)',
    latitude: 35.6809591,
    longitude: 139.7673068,
    altitude: 10.5,
    recorded_at: new Date('2024-01-01T12:00:00Z'),
    order_index: 0,
    created_at: new Date('2024-01-01T00:00:00Z'),
  },
];
