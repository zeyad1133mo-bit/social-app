import { AppError } from "../../lib/error/app-error";

export const otpExpired =
    new AppError('OTP Expired.', 410);
export const invalidCode =
    new AppError('Invalid Code.', 400);
export const invalidPassword =
    new AppError('Invalid Password.', 401);
