import { Comment, IComment } from '../models/comment.model';
import { AbstractRepository } from '../../../lib/db/abstract.repository';

class CommentRepository extends AbstractRepository<IComment> {
    constructor() {
        super(Comment);
    }

    async findById(commentId: string) {
        return Comment.findById(commentId);
    }

    async findByPostId(postId: string) {
        return Comment.find({ postId }).sort({ createdAt: 1 });
    }

    async updateById(commentId: string, content: string) {
        return Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true, runValidators: true }
        );
    }

    async deleteById(commentId: string) {
        return Comment.findByIdAndDelete(commentId);
    }
}

export default new CommentRepository();
