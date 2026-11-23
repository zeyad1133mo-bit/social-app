import { Types } from "mongoose";
import { AppError } from "../../../lib/error/app-error";
import postRepository from "../../post/repositories/post.repository";
import commentRepository from "../repositories/comment.repository";

export class CommentService {
    createComment = async (postId: string, userId: string, content: string) => {
        if (!content?.trim()) throw new AppError('Comment content is required', 400);
        const post = await postRepository.findById(postId);
        if (!post) throw new AppError('Post not found', 404);

        const comment = await commentRepository.create({
            postId: new Types.ObjectId(postId),
            userId: new Types.ObjectId(userId),
            content: content.trim(),
        });
        await postRepository.incrementCommentsCount(postId);
        return comment;
    };

    getComments = async (postId: string) => {
        const post = await postRepository.findById(postId);
        if (!post) throw new AppError('Post not found', 404);
        return commentRepository.findByPostId(postId);
    };

    getCommentById = async (commentId: string) => {
        const comment = await commentRepository.findById(commentId);
        if (!comment) throw new AppError('Comment not found', 404);
        return comment;
    };

    updateComment = async (commentId: string, userId: string, content: string) => {
        if (!content?.trim()) throw new AppError('Comment content is required', 400);
        const comment = await commentRepository.findById(commentId);
        if (!comment) throw new AppError('Comment not found', 404);
        if (comment.userId.toString() !== userId) throw new AppError('Not allowed to update this comment', 403);
        return commentRepository.updateById(commentId, content.trim());
    };

    deleteComment = async (commentId: string, userId: string) => {
        const comment = await commentRepository.findById(commentId);
        if (!comment) throw new AppError('Comment not found', 404);

        const post = await postRepository.findById(comment.postId.toString());
        const isCommentOwner = comment.userId.toString() === userId;
        const isPostOwner = post?.userId.toString() === userId;
        if (!isCommentOwner && !isPostOwner) throw new AppError('Not allowed to delete this comment', 403);

        const deleted = await commentRepository.deleteById(commentId);
        await postRepository.decrementCommentsCount(comment.postId.toString());
        return deleted;
    };
}

export default new CommentService();
