import { z } from 'zod';
import { AppError } from '../error/app-error';

export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        const message = result.error.issues.map((issue) => issue.message).join(', ');
        throw new AppError(message || 'Invalid data', 400);
    }
    return result.data;
}
