CREATE TABLE artists (
  id VARCHAR(50) PRIMARY KEY,      -- Ticketmaster's ID
  name VARCHAR(255),
  genre VARCHAR[],
  subgenre VARCHAR[],
  url VARCHAR(255),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE venues (
  id VARCHAR(50) PRIMARY KEY,       -- Ticketmaster's ID
  name VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id VARCHAR(50) PRIMARY KEY,       -- Ticketmaster's ID
  name VARCHAR(255) NOT NULL,
  date TIMESTAMPTZ,        -- With timezone support
  venue_id VARCHAR(50) NOT NULL REFERENCES venues(id),
  url VARCHAR(255),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_artists (
  event_id VARCHAR(50) REFERENCES events(id) ON DELETE CASCADE,
  artist_id VARCHAR(50) REFERENCES artists(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, artist_id)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  city VARCHAR(25) NOT NULL,
  state VARCHAR(2) NOT NULL, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_date TIMESTAMP
);

CREATE TABLE favorite_artists (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  artist_id VARCHAR(50) REFERENCES artists(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, artist_id)
);

CREATE TABLE favorite_venues (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  venue_id VARCHAR(50) REFERENCES venues(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, venue_id)
);

CREATE TABLE user_events (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  event_id VARCHAR(50) REFERENCES events(id) ON DELETE CASCADE,
  is_interested BOOLEAN DEFAULT false,
  is_attended BOOLEAN DEFAULT false,
  marked_attended_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, event_id)
);