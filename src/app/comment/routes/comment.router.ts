import { Router } from 'express';
import commentController from '../controllers/comment.controller';
import { authGuard } from '../../../lib/auth/authGuard';

export const commentRouter = Router();

commentRouter.post('/:postId/comments', authGuard, commentController.createComment);
commentRouter.get('/:postId/comments', authGuard, commentController.getComments);
commentRouter.get('/:id', authGuard, commentController.getCommentById);
commentRouter.patch('/:id', authGuard, commentController.updateComment);
commentRouter.delete('/:id', authGuard, commentController.deleteComment);
