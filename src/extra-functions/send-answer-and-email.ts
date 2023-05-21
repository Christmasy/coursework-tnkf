import { sendMail } from './email.js';
import { dbClient } from '../db.js';
import { Request, Response } from 'express';

export async function sendAnswerAndMail(req: Request, res: Response, taskId: string, taskStatus: string) {
  if (!req.body.asigneeId) {
    res.send(JSON.stringify({data:{id:taskId, authorId:(req as any).user.id, ...req.body}, error:null}));
    return;
  }
  const queryEmailAndTitle = 'SELECT email, projects.title FROM tasks JOIN users ON asignee_id = users.id JOIN projects ON project_id = projects.id WHERE tasks.id=$1';
  const resultEmailAndTitle = await dbClient.query(queryEmailAndTitle, [taskId]);
  const queryAuthor = 'SELECT username FROM users WHERE id=$1';
  const resultAuthor = await dbClient.query(queryAuthor, [(req as any).user.id]);
  try {
    sendMail(resultEmailAndTitle.rows[0].email, `${resultAuthor.rows[0].username} ${taskStatus} task in project ${resultEmailAndTitle.rows[0].title}:
Title: ${req.body.title}, deadline:${req.body.deadline}`, `Task ${taskStatus}`);
  } catch (e) {
    console.error(`can't send email, error ${e}`);
  }
  res.send(JSON.stringify({data:{id:taskId, authorId:(req as any).user.id, ...req.body}, error:null}));
}
