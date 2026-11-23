import { Post } from '../models/post.model';
import { IPost } from '../models/post.model';
import { AbstractRepository } from '../../../lib/db/abstract.repository';


class PostRepository extends AbstractRepository<IPost> {

    constructor() {
        super(Post);
    }

    async findByUserId(userId: string) {
        return Post.find({ userId: userId });
    }

    async findById(postId: string) {
        return Post.findById(postId);
    }
    async updateById(postId: string, content: string) {
        return Post.findByIdAndUpdate(postId, {
            content
        }, { new: true, runValidators: true })
    }


    async getAllPosts() {
        return Post.find().sort({ createdAt: -1 });
    }

    async deleteById(postId: string) {
        return Post.findByIdAndDelete(postId);
    }

    async incrementCommentsCount(postId: string) {
        return Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
    }

    async decrementCommentsCount(postId: string) {
        return Post.findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } });
    }


}

export default new PostRepository();
