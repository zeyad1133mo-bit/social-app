import { NextFunction, Request, Response } from 'express';
import commentService from '../services/comment.service';

class CommentController {
    createComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comment = await commentService.createComment(
                req.params.postId as string,
                req.user.sub,
                req.body.content
            );
            res.status(201).json({ success: true, data: comment });
        } catch (error) {
            next(error);
        }
    };

    getComments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comments = await commentService.getComments(req.params.postId as string);
            res.json({ success: true, data: comments });
        } catch (error) {
            next(error);
        }
    };

    deleteComment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comment = await commentService.deleteComment(req.params.id as string, req.user.sub);
            res.json({ success: true, data: comment });
        } catch (error) {
            next(error);
        }
    };
}

export default new CommentController();
