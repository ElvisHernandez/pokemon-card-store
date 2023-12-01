CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY ASC,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    createdAt INTEGER,
    updatedAt INTEGER
);

INSERT INTO User (email, password) VALUES (
    'elvishernandezdev@gmail.com',
    'password'
);