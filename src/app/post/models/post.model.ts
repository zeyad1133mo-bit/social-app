import {model, Schema, Types} from 'mongoose';


export interface IPost {
    content: string;
    userId: Types.ObjectId;
    commentsCount: number;
    reactionsCount: number;
    allowedComments: boolean;
}

const schema = new Schema<IPost>({
    content: { type: String, required: true ,trim: true, minlength: 1, maxlength: 200},
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    commentsCount: { type: Number, default: 0 },
    reactionsCount: { type: Number, default: 0 },
    allowedComments: { type: Boolean, default: true }
});


export const Post = model<IPost>('Post', schema);