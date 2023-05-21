import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthUser {
  id: number;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if(req.path === '/reg' || req.path === '/login') {
    next();
    return;
  }
  const auth = req.get('Authorization');
  if(!auth) {
    res.status(401);
    res.send(JSON.stringify({data: null, error:'unauthorized'}));
    return;
  }
  // мы подписывали с помощью secret токен, сейчас проверяем подпись
  // когда проверили -- достаем из токена id пользователя
  (req as any).user = jwt.verify(auth.split(' ')[1], 'secret') as AuthUser;
  next();
}
