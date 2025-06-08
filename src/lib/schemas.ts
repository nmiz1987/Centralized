import { z } from 'zod';

// Define Zod schema for signin validation
export const SignInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

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

// Define Zod schema for links validation
export const LinkSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters').max(255, 'Description must be less than 255 characters'),
  category: z.string().min(3, 'Category must be at least 3 characters').max(100, 'Category must be less than 100 characters'),
  url: z.string().min(3, 'URL must be at least 3 characters').max(255, 'URL must be less than 255 characters'),
  icon: z.string().min(3, 'Icon must be at least 3 characters').max(255, 'Icon must be less than 255 characters'),
  isRecommended: z.boolean().default(false),
  userId: z.string().min(1, 'User ID is required'),
});

export type LinkData = z.infer<typeof LinkSchema>;

export type SignInData = z.infer<typeof SignInSchema>;
export type SignUpData = z.infer<typeof SignUpSchema>;
