-- Extension for spatial data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Diaries table
CREATE TABLE IF NOT EXISTS diaries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations table (with PostGIS support)
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  diary_id INTEGER REFERENCES diaries(id) ON DELETE CASCADE,
  name VARCHAR(255),
  coordinates GEOGRAPHY(POINT) NOT NULL,
  altitude FLOAT,
  recorded_at TIMESTAMP WITH TIME ZONE,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Images table
CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY,
  diary_id INTEGER REFERENCES diaries(id) ON DELETE CASCADE,
  file_path VARCHAR(255) NOT NULL,
  caption TEXT,
  taken_at TIMESTAMP WITH TIME ZONE,
  location_id INTEGER REFERENCES locations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) DEFAULT '#CCCCCC',
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Diary-Tags relationship table
CREATE TABLE IF NOT EXISTS diary_tags (
  diary_id INTEGER REFERENCES diaries(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (diary_id, tag_id)
);

-- Indexes for optimized queries
CREATE INDEX IF NOT EXISTS diaries_user_id_idx ON diaries(user_id);
CREATE INDEX IF NOT EXISTS locations_diary_id_idx ON locations(diary_id);
CREATE INDEX IF NOT EXISTS locations_coordinates_idx ON locations USING GIST (coordinates);
CREATE INDEX IF NOT EXISTS images_diary_id_idx ON images(diary_id);
CREATE INDEX IF NOT EXISTS tags_user_id_idx ON tags(user_id);
