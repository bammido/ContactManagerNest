import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';

@Injectable()
export class authMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const secretKey = process.env.SECRET;
      const key = new TextEncoder().encode(secretKey);

      const token: string = (req.headers?.token as string) ?? '';

      const { payload } = await jwtVerify(token, key, {
        algorithms: ['HS256'],
      });

      if (payload) {
        return next();
      }

      return res.status(403).json({ message: 'token inválido' });
    } catch (error) {
      return res.status(403).json({ message: 'token inválido' });
    }
  }
}
