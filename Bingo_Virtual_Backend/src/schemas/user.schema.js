import {z} from 'zod';

export const registerSchema = z.object({
    email: z.string({
        message: 'Email is required',
    }).email({
        message: 'Invalid email format',
    }),
    password: z.string({
        message: 'Password is required',
    }).min(6,{
        message: 'Password must be at least 6 characters',
    }),
    name: z.string({
        message: 'Name is required',
    }).min(3, {
        message: 'Name must be at least 3 characters',
    }),
});

export const loginSchema = z.object({
    email: z.string({
        message: 'Email is required',
    }).email({
        message: 'Invalid email format',
    }),
    password: z.string({
        message: 'Password is required',
    }).min(6,{
        message: 'Password must be at least 6 characters',
    }),
})