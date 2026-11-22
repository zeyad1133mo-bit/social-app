import {AppError} from './app-error';
import {Request, Response, NextFunction} from 'express';

export function globalErrorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });

}