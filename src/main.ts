import bodyParser from 'body-parser';
import express, { Express, Request, Response } from 'express';
import { dbClient } from './db.js';
import jwt from 'jsonwebtoken';
import { Task } from './models/task.js';
import { Comment } from './models/comment.js';
import { User } from './models/user.js';
import { migrate } from 'postgres-migrations';
import { Project } from './models/project.js';
import { sendMail } from './email.js';
import { authMiddleware } from './middlewares.js';

const app: Express = express();
const port = 9090;

app.use(authMiddleware);
app.use(bodyParser.json());

export default app;

app.post('/reg', async (req: Request, res: Response) => {
  const result = await dbClient.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id', [req.body.username, req.body.password, req.body.email]);
  res.send(JSON.stringify({data:{id:result.rows[0].id, ...req.body}, error:null}));
});

app.post('/login', async (req: Request, res: Response) => {
  const result = await dbClient.query('SELECT * FROM users WHERE username=$1 AND password=$2', [req.body.username, req.body.password]);
  if(result.rowCount === 0) {
    res.status(401);
    res.send(JSON.stringify({data: null, error:'username or password invalid'}));
    return;
  }
  res.send(JSON.stringify({data:jwt.sign({ id: result.rows[0].id }, 'secret'), error:null}));
});

app.get('/users', async (_: Request, res: Response) => {
  const result = await dbClient.query('SELECT * FROM users');
  const users = result.rows.map((value: any) => new User(
    value.id,
    value.username
  ));
  res.send(JSON.stringify({data:users, error:null}));
});

app.post('/tasks/create', async (req: Request, res: Response) => {
  const query = `INSERT INTO tasks (
      author_id,
      asignee_id,
      project_id,
      title,
      description,
      deadline,
      status
  ) VALUES ($1, $2, $3, $4, $5, $6::timestamp, $7) RETURNING id`;
  const result = await dbClient.query(query, [
    (req as any).user.id,
    req.body.asigneeId,
    req.body.projectId,
    req.body.title,
    req.body.description,
    req.body.deadline,
    req.body.status
  ]);

  if (!req.body.asigneeId) {
    res.send(JSON.stringify({data:{id:result.rows[0].id, authorId:(req as any).user.id, ...req.body}, error:null}));
    return;
  }
  const queryEmailAndTitle = 'SELECT email, projects.title FROM tasks JOIN users ON asignee_id = users.id JOIN projects ON project_id = projects.id WHERE tasks.id=$1';
  const resultEmailAndTitle = await dbClient.query(queryEmailAndTitle, [result.rows[0].id]);
  const queryAuthor = 'SELECT username FROM users WHERE id=$1';
  const resultAuthor = await dbClient.query(queryAuthor, [(req as any).user.id]);
  try {
    sendMail(resultEmailAndTitle.rows[0].email, `${resultAuthor.rows[0].username} added task to project ${resultEmailAndTitle.rows[0].title}:
Title: ${req.body.title}, deadline:${req.body.deadline}`);
  } catch (e) {
    console.error(`can't send email, error ${e}`);
  }

  res.send(JSON.stringify({data:{id:result.rows[0].id, authorId:(req as any).user.id, ...req.body}, error:null}));
});

app.get('/tasks/:id', async (req: Request, res: Response) => {
  const query = 'SELECT * FROM tasks WHERE id=$1';
  const result = await dbClient.query(query, [req.params.id]);
  if(result.rowCount === 0) {
    res.status(404);
    res.send(JSON.stringify({data:null, error:'not found'}));
  }
  res.send(JSON.stringify({data:result.rows[0], error:null}));
});

app.get('/tasks', async (_: Request, res: Response) => {
  // только проекты, в которых уч-ет пользователь
  // const query = 'SELECT * FROM tasks JOIN project_users USING (project_id) WHERE project_users.user_id=$1';
  // const result = await dbClient.query(query, [(req as any).user.id]);

  // пока что все таски
  const query = 'SELECT * FROM tasks';
  const result = await dbClient.query(query);
  const tasks = await Promise.all(result.rows.map(async (value: any) =>
  {
    const queryUser = 'SELECT username FROM users WHERE id=$1';
    const resultAuthor = await dbClient.query(queryUser, [value.author_id]);
    const resultAsignee = await dbClient.query(queryUser, [value.asignee_id]);
    return new Task(
      value.id,
      value.author_id,
      value.asignee_id,
      value.project_id,
      value.title,
      value.description,
      value.deadline,
      value.status,
      resultAuthor.rows[0].username,
      resultAsignee.rows[0].username
    );
  }));
  res.send(JSON.stringify({data:tasks, error:null}));
});

app.post('/comments/create', async (req: Request, res: Response) => {
  const query = 'INSERT INTO comments (task_id, author_id, create_time, content) VALUES ($1, $2, $3::timestamp, $4) RETURNING id';
  const result = await dbClient.query(query, [
    req.body.taskId,
    (req as any).user.id,
    req.body.createTime,
    req.body.content
  ]);
  res.send(JSON.stringify({data:{id:result.rows[0].id, authorId:(req as any).user.id, ...req.body}, error:null}));
});

app.get('/comments', async (_: Request, res: Response) => {
  const query = 'SELECT * FROM comments';
  const result = await dbClient.query(query);
  const comments = result.rows.map((value: any) => new Comment(
    value.id,
    value.task_id,
    value.author_id,
    value.create_time,
    value.content
  ));
  res.send(JSON.stringify({data:comments, error:null}));
});

app.post('/projects/create', async (req: Request, res: Response) => {
  const query = 'INSERT INTO projects (title) VALUES ($1) RETURNING id';
  const result = await dbClient.query(query, [req.body.title]);
  res.send(JSON.stringify({data:{id:result.rows[0].id, ...req.body}, error:null}));
});

app.post('/projects/:id/adduser', async (req: Request, res: Response) => {
  const query = 'INSERT INTO project_users (project_id, user_id) VALUES ($1, $2)';
  await dbClient.query(query, [req.params.id, req.body.userId]);
  res.send(JSON.stringify({data:null, error:null}));
});

app.get('/projects', async (_: Request, res: Response) => {
  const query = 'SELECT * FROM projects';
  const result = await dbClient.query(query);
  const projects = result.rows.map((value: any) => new Project(
    value.id,
    value.title
  ));
  res.send(JSON.stringify({data:projects, error:null}));
});

async function main() {
  await dbClient.connect();
  await migrate({client: (dbClient as any)}, './migrations');
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

main();
