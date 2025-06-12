import { z } from 'zod';

// Define Zod schema for signup validation
export const SignUpSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Define Zod schema for signin validation
export const SignInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Define Zod schema for reset password validation
export const ResetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Define Zod schema for links validation
export const LinkSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(255, 'Description must be less than 255 characters'),
  url: z
    .string()
    .min(1, 'URL is required')
    .max(255, 'URL must be less than 255 characters')
    .startsWith('http', 'The URL must starts with http!')
    .url('Invalid URL'),
  category: z.string().min(1, 'Category is required').max(100, 'Category must be less than 100 characters'),
  icon: z.string().max(255, 'Icon must be less than 255 characters').optional(),
  isRecommended: z.boolean().default(false).optional(),
});

export type LinkData = z.infer<typeof LinkSchema>;

export type SignInData = z.infer<typeof SignInSchema>;
export type SignUpData = z.infer<typeof SignUpSchema>;
export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;
