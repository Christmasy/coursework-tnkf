CREATE TABLE users (
  id SERIAL,
  username TEXT,
  password TEXT,
  email TEXT
);

CREATE TABLE tasks (
  id SERIAL,
  author_id INT,
  asignee_id INT,
  project_id INT,
  title TEXT,
  description TEXT,
  deadline TIMESTAMP,
  status INT
);

CREATE TABLE comments (
  id SERIAL,
  task_id INT,
  author_id INT,
  create_time TIMESTAMP,
  content TEXT
);

CREATE TABLE projects (
  id SERIAL,
  title TEXT
);

-- user with user_id is in project with project_id
CREATE TABLE project_users (
  project_id INT,
  user_id INT
);
