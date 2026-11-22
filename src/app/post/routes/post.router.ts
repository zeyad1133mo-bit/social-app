import { Router } from 'express';
import postController from '../controllers/post.controller';
import { authGuard } from '../../../lib/auth/authGuard';

export const postRouter = Router();

postRouter.get('/', authGuard, postController.getPosts);
postRouter.post('/', authGuard, postController.createPost);
postRouter.get('/user/:id', authGuard, postController.getPostsByUser);
postRouter.delete('/:id', authGuard, postController.deletePost);
