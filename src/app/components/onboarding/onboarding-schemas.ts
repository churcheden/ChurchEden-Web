import { z } from "zod";

const currentYear = new Date().getFullYear();

// Step 1: Church Basics Schema
export const churchBasicsSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),
  churchName: z
    .string()
    .trim()
    .min(2, "Church name must be at least 2 characters")
    .max(100, "Church name must not exceed 100 characters"),
  denomination: z
    .string()
    .min(1, "Please select your denomination"),
  churchSize: z
    .string()
    .min(1, "Please select an estimated church size range"),
  foundedYear: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        const num = Number(val);
        return !isNaN(num) && num >= 1800 && num <= currentYear + 1;
      },
      {
        message: `Founded year must be a valid year between 1800 and ${currentYear}`,
      }
    ),
});

export type ChurchBasicsFormData = z.infer<typeof churchBasicsSchema>;

// Step 2: Location & Contact Schema
export const locationContactSchema = z.object({
  country: z.string().min(1, "Please select a country"),
  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters"),
  address: z
    .string()
    .trim()
    .min(3, "Address must be at least 3 characters"),
  churchPhone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number with country code")
    .max(25, "Phone number is too long"),
  churchEmail: z
    .string()
    .trim()
    .email("Please enter a valid church email address"),
  primaryLanguage: z.string().min(1, "Please select primary language"),
  timezone: z.string().min(1, "Please select a time zone"),
});

export type LocationContactFormData = z.infer<typeof locationContactSchema>;

// Step 3: Service Schedule & Branding Schema
export const serviceTimeItemSchema = z.object({
  id: z.string(),
  label: z.string().trim().min(1, "Service label is required"),
  day: z.string().min(1, "Please select a day"),
  time: z.string().min(1, "Please set a service time"),
});

export const serviceBrandingSchema = z.object({
  serviceTimes: z
    .array(serviceTimeItemSchema)
    .min(1, "Please add at least one service time"),
  brandColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid hex color code")
    .optional()
    .default("#F59E0B"),
});

export type ServiceBrandingFormData = z.infer<typeof serviceBrandingSchema>;
