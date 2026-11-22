import { model, Schema, Types } from 'mongoose';

export interface IComment {
    postId: Types.ObjectId;
    userId: Types.ObjectId;
    content: string;
}

const schema = new Schema<IComment>({
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true, minlength: 1, maxlength: 500 },
}, { timestamps: true });

export const Comment = model<IComment>('Comment', schema);
