import { Response, Request, NextFunction } from 'express';
import AuthService from '@src/services/auth';

export default function AuthMiddleware(
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void {
  try {
    const token = req.headers?.['x-access-token'] as string;
    const decoded = AuthService.decodedToken(token);
    req.decoded = decoded;
    next();
  } catch (error) {
    res.status?.(401).send({
      code: 401,
      error: error.message,
    });
  }
}
