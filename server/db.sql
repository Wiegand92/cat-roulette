--Users table
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(25) UNIQUE NOT NULL
);

--Table for messages
CREATE TABLE messages(
  id SERIAL PRIMARY KEY,
  content VARCHAR(100)
);

--Exposes relationship between users & messages
CREATE TABLE users_messages(
  user_id INTEGER REFERENCES users(id) ON DELETE SET DEFAULT,
  message_id INTEGER REFERENCES messages(id),
  PRIMARY KEY (user_id, message_id)
);

--When a user is deleted sets the default to anonymous
ALTER TABLE users_messages
ALTER COLUMN user_id SET DEFAULT 0;

--Default unknown user
INSERT INTO users (id, name) VALUES (0, 'anonymous');

--Selects a table of messages formatted for the app
SELECT users.name AS sender, messages.content AS content, messages.id AS id
  FROM users, messages, users_messages
  WHERE users.id = users_messages.user_id AND
  messages.id = users_messages.message_id;