import { AppError } from "../../lib/error/app-error";

export const userNotExist = new AppError('User Not Exists.', 404);
export const userAlreadyExist = new AppError('User Already Exists.', 409);
export const userAlreadyVerified = new AppError('User Already Verified.', 400);
export const userNotVerified = new AppError('user Not Verified', 403);
export const cannotFollowYourself = new AppError('You cannot follow yourself', 400);
export const alreadyFollowing = new AppError('You already follow this user', 400);
export const notFollowing = new AppError('You are not following this user', 400);
