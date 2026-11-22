import { Types } from "mongoose";
import { AppError } from "../../../lib/error/app-error";
import postRepository from "../repositories/post.repository";

export class PostService {
    createPost = async (userId: string, content: string) => {
        if (!content?.trim()) throw new AppError('Post content is required', 400);
        return postRepository.create({
            content: content.trim(),
            userId: new Types.ObjectId(userId),
            commentsCount: 0,
            reactionsCount: 0,
            allowedComments: true,
        });
    };

    getPosts = async () => postRepository.getAllPosts();

    getPostsByUser = async (userId: string) => postRepository.findByUserId(userId);

    deletePost = async (postId: string, userId: string) => {
        const post = await postRepository.findById(postId);
        if (!post) throw new AppError('Post not found', 404);
        if (post.userId.toString() !== userId) throw new AppError('Not allowed to delete this post', 403);
        return postRepository.deleteById(postId);
    };
}

export default new PostService();
