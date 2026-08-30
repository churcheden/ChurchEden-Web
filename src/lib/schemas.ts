import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export const onboardingStep1Schema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(60),
  lastName: z.string().trim().min(1, 'Last name is required').max(60),
  churchName: z.string().trim().min(1, 'Church name is required').max(150),
  denomination: z.string().trim().min(1, 'Denomination is required').max(100),
  congregationSize: z.enum([
    'RANGE_1_100',
    'RANGE_101_500',
    'RANGE_501_1000',
    'RANGE_1001_2000',
    'RANGE_2000_PLUS',
  ] as const),
  foundedYear: z.coerce.number().int().min(1500).max(new Date().getFullYear()).optional(),
});

export const onboardingStep2Schema = z.object({
  country: z.string().trim().min(1, 'Country is required'),
  city: z.string().trim().min(1, 'City is required').max(100),
  address: z.string().trim().min(1, 'Address is required').max(255),
  phone: z.string().trim().min(1, 'Phone is required'),
  email: z.string().email('Invalid church email address').max(255),
  primaryLanguage: z.enum(['ENGLISH', 'FRENCH', 'SPANISH'] as const),
  timeZone: z.string().min(1, 'Time zone is required'),
});

export const serviceTimeItemSchema = z.object({
  label: z.string().trim().min(1, 'Label is required').max(60),
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be HH:MM format (24h)'),
});

export const customMinistryItemSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  type: z.enum(['MINISTRY', 'DEPARTMENT'] as const),
  description: z.string().trim().max(255).optional(),
  icon: z.string().optional(),
});

export const onboardingStep4Schema = z.object({
  ministryIds: z.array(z.string().uuid()).default([]),
  customMinistries: z.array(customMinistryItemSchema).default([]),
});

export const completeProfileSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(120),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'PREFER_NOT_TO_SAY'] as const),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  contactEmail: z.string().email('Invalid contact email address').max(255),
  city: z.string().trim().min(1, 'City is required').max(100),
  address: z.string().trim().min(1, 'Address is required').max(255),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'PREFER_NOT_TO_SAY'] as const),
  occupation: z.string().trim().max(100).optional(),
});

export const joinRequestSchema = z.object({
  churchId: z.string().uuid('Invalid church ID'),
});

export const rejectJoinRequestSchema = z.object({
  membershipId: z.string().uuid('Invalid membership ID'),
  rejectionReason: z.string().trim().max(500).optional(),
});
