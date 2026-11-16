import { Types } from 'mongoose';
import {Provider, Gender} from '../../app/authentication/enum/enum';

export interface IUser {
    userName: string;
    email: string;
    password?: string;
    provider?: Provider;
    gender: Gender;
    isVerified?: boolean;
    twoStepVerification?: boolean;
    followers?: Types.ObjectId[];
    following?: Types.ObjectId[];
    isPrivate?: boolean;
}
