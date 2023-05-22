import bodyParser from 'body-parser';
import express, { Express, Request, Response } from 'express';
import { db } from './db.js';
//import { db } from '@vercel/postgres';
//import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { Task } from './models/task.js';
import { Comment } from './models/comment.js';
import { User } from './models/user.js';
import { migrate } from 'postgres-migrations';
import { Project } from './models/project.js';
import { authMiddleware } from './middlewares.js';
import { sendAnswerAndMail } from './extra-functions/send-answer-and-email.js';

//import { createPool } from '@vercel/postgres';
import dotenv from 'dotenv';
dotenv.config();

//const db = createPool({
//  connectionString: process.env.POSTGRES_URL,
//});

const app: Express = express();
const port = 9090;

app.use(authMiddleware);
app.use(bodyParser.json());
app.use('/static', express.static('./build/static'));

export default app;

app.get('*', async (_: Request, res: Response) => {
  res.sendFile('./build/index.html', {root: './'});
});

app.post('/api/reg', async (req: Request, res: Response) => {
  const result = await db.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id', [req.body.username, req.body.password, req.body.email]);
  res.send(JSON.stringify({data:{id:result.rows[0].id, ...req.body}, error:null}));
});

app.post('/api/login', async (req: Request, res: Response) => {
  const result = await db.query('SELECT * FROM users WHERE username=$1 AND password=$2', [req.body.username, req.body.password]);
  console.log(req.body.username);
  console.log(req.body.password);
  console.log(result.rowCount);
  if(result.rowCount === 0) {
    res.status(401);
    res.send(JSON.stringify({data: null, error:'username or password invalid'}));
    return;
  }
  res.send(JSON.stringify({data:jwt.sign({ id: result.rows[0].id }, 'secret'), error:null}));
});

app.get('/api/users', async (_: Request, res: Response) => {
  const result = await db.query('SELECT * FROM users');
  const users = result.rows.map((value: any) => new User(
    value.id,
    value.username
  ));
  res.send(JSON.stringify({data:users, error:null}));
});

app.post('/api/tasks/create', async (req: Request, res: Response) => {
  const query = `INSERT INTO tasks (
      author_id,
      asignee_id,
      project_id,
      title,
      description,
      deadline,
      status
  ) VALUES ($1, $2, $3, $4, $5, $6::timestamp, $7) RETURNING id`;
  const result = await db.query(query, [
    (req as any).user.id,
    req.body.asigneeId,
    req.body.projectId,
    req.body.title,
    req.body.description,
    req.body.deadline,
    req.body.status
  ]);

  sendAnswerAndMail(req, res, result.rows[0].id, 'created');
});

app.post('/api/tasks/:id/edit', async (req: Request, res: Response) => {
  const query = `UPDATE tasks SET (
      author_id,
      asignee_id,
      project_id,
      title,
      description,
      deadline,
      status
  ) = ($1, $2, $3, $4, $5, $6::timestamp, $7) WHERE id=$8`;

  await db.query(query, [
    (req as any).user.id,
    req.body.asigneeId,
    req.body.projectId,
    req.body.title,
    req.body.description,
    req.body.deadline,
    req.body.status,
    req.params.id
  ]);

  sendAnswerAndMail(req, res, req.params.id, 'updated');
});

app.get('/api/tasks/:id', async (req: Request, res: Response) => {
  const query = 'SELECT * FROM tasks WHERE id=$1';
  const result = await db.query(query, [req.params.id]);
  if(result.rowCount === 0) {
    res.status(404);
    res.send(JSON.stringify({data:null, error:'not found'}));
  }
  res.send(JSON.stringify({data:result.rows[0], error:null}));
});

app.get('/api/tasks', async (_: Request, res: Response) => {
  // только проекты, в которых уч-ет пользователь
  // const query = 'SELECT * FROM tasks JOIN project_users USING (project_id) WHERE project_users.user_id=$1';
  // const result = await dbClient.query(query, [(req as any).user.id]);

  // пока что все таски
  const query = 'SELECT * FROM tasks';
  const result = await db.query(query);
  const tasks = await Promise.all(result.rows.map(async (value: any) =>
  {
    const queryUser = 'SELECT username FROM users WHERE id=$1';
    const resultAuthor = await db.query(queryUser, [value.author_id]);
    const resultAsignee = await db.query(queryUser, [value.asignee_id]);
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

app.get('/api/projects/:id', async (req: Request, res: Response) => {
  // только таски этого проекта
  const query = 'SELECT * FROM tasks WHERE project_id=$1';
  const result = await db.query(query, [req.params.id]);
  const tasks = await Promise.all(result.rows.map(async (value: any) =>
  {
    const queryUser = 'SELECT username FROM users WHERE id=$1';
    const resultAuthor = await db.query(queryUser, [value.author_id]);
    const resultAsignee = await db.query(queryUser, [value.asignee_id]);
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

app.post('/api/comments/create', async (req: Request, res: Response) => {
  const query = 'INSERT INTO comments (task_id, author_id, create_time, content) VALUES ($1, $2, $3::timestamp, $4) RETURNING id';
  const result = await db.query(query, [
    req.body.taskId,
    (req as any).user.id,
    req.body.createTime,
    req.body.content
  ]);
  res.send(JSON.stringify({data:{id:result.rows[0].id, authorId:(req as any).user.id, ...req.body}, error:null}));
});

app.get('/api/comments', async (_: Request, res: Response) => {
  const query = 'SELECT * FROM comments';
  const result = await db.query(query);
  const comments = result.rows.map((value: any) => new Comment(
    value.id,
    value.task_id,
    value.author_id,
    value.create_time,
    value.content
  ));
  res.send(JSON.stringify({data:comments, error:null}));
});

app.post('/api/projects/create', async (req: Request, res: Response) => {
  const query = 'INSERT INTO projects (title) VALUES ($1) RETURNING id';
  const result = await db.query(query, [req.body.title]);
  res.send(JSON.stringify({data:{id:result.rows[0].id, ...req.body}, error:null}));
});

app.post('/api/projects/:id/adduser', async (req: Request, res: Response) => {
  const query = 'INSERT INTO project_users (project_id, user_id) VALUES ($1, $2)';
  await db.query(query, [req.params.id, req.body.userId]);
  res.send(JSON.stringify({data:null, error:null}));
});

app.get('/api/projects', async (_: Request, res: Response) => {
  const query = 'SELECT * FROM projects';
  const result = await db.query(query);
  const projects = result.rows.map((value: any) => new Project(
    value.id,
    value.title
  ));
  res.send(JSON.stringify({data:projects, error:null}));
});

async function main() {
  await db.connect();
  await migrate({client: (db as any)}, './migrations');
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

main();
