import { model, Schema, HydratedDocument, Types } from 'mongoose';
import { Provider, Gender } from '../../authentication/enum/enum';
import { IUser } from '../../../lib/interface/interface';

export type UserDocument = HydratedDocument<IUser>;

const schema = new Schema<IUser>(
    {
        userName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 20,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            lowercase: true,
        },
        password: {
            type: String,
            required: function (this: IUser) {
                return this.provider === Provider.LOCAL;
            },
            trim: true,
        },
        provider: {
            type: Number,
            enum: Provider,
            default: Provider.LOCAL,
        },
        gender: {
            type: String,
            enum: Gender,
            default: Gender.MALE,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        twoStepVerification: {
            type: Boolean,
            default: false,
        },
        isPrivate: {
            type: Boolean,
            default: false,
        },
        followers: [
            {
                type: Types.ObjectId,
                ref: 'User',
                default: [],
            },
        ],
        following: [
            {
                type: Types.ObjectId,
                ref: 'User',
                default: [],
            },
        ],
    },
    { timestamps: true }
);

export const User = model<IUser>('User', schema);