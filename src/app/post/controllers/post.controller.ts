import { NextFunction, Request, Response } from 'express';
import postService from '../services/post.service';

class PostController {
    createPost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const post = await postService.createPost(req.user.sub, req.body.content);
            res.status(201).json({ success: true, data: post });
        } catch (error) {
            next(error);
        }
    };

    getPosts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const posts = await postService.getPosts();
            res.json({ success: true, data: posts });
        } catch (error) {
            next(error);
        }
    };

    getPostsByUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const posts = await postService.getPostsByUser(req.params.id as string);
            res.json({ success: true, data: posts });
        } catch (error) {
            next(error);
        }
    };

    deletePost = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const post = await postService.deletePost(req.params.id as string, req.user.sub);
            res.json({ success: true, data: post });
        } catch (error) {
            next(error);
        }
    };
}

export default new PostController();
