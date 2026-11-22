import { AppError } from '../error/app-error';
import JWT,{JwtPayload} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';


export function authGuard(req: Request, res: Response, next: NextFunction) {
    try {
        // logic to check if the user is authenticated(check token)
        const token = req.cookies.access_token;
        if (!token) {
            throw new AppError('no token provided', 403);
        }
        req.user = JWT.verify(token, env.jwt.accessSecret) as JwtPayload & { sub: string };
        // req.user = payload;
        next();
    } catch (error) {
        next(error);
    }

}
