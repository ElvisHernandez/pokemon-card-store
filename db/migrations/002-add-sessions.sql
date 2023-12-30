
-- <date>At columns will use ISO8601 format (YYYY-MM-DD HH:MM:SS.SSS)

CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY ASC,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NUll
);

CREATE TABLE IF NOT EXISTS Session (
    id INTEGER PRIMARY KEY ASC,
    sessionId TEXT UNIQUE NOT NULL,
    
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NUll,
    expiresAt TEXT NOT NULL,
    
    userId INTEGER NOT NULL,
    FOREIGN KEY(userId) REFERENCES User(id) ON DELETE CASCADE
);