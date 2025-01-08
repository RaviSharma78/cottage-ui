
import { z } from "zod";

export const FieldsSchema = z.object({
  id: z.number().optional(), // Optional since it might be auto-generated.
  fieldName: z
    .string()
    .nonempty({ message: "Field name is mandatory" }),
  fieldType: z.nativeEnum({
    // Replace this with actual `FieldType` enum values.
    TEXT: "TEXT",
    NUMBER: "NUMBER",
    BOOLEAN: "BOOLEAN",
    // Add other field types based on your Java `FieldType` enum.
  }),
  required: z.boolean().default(false),
  errorMessage: z.string().optional(),
  placeHolder: z.string().optional(),
  isAvailableForSignIn: z.boolean().optional(),
  maxcaracter: z.number().int().optional(),
  mincaracter: z.number().int().optional(),
  fieldLogoURL: z
    .string()
    .url({ message: "URL format is invalid" })
    .optional(),
  userId: z.number().optional(),
  options: z.array(z.string()).default([]),
  isAddedAsCustomField: z.boolean().default(false),
});


export const OAuthLoginSchema = z.object({
  id: z
    .string()
    .uuid()
    .default(() => crypto.randomUUID()), // Automatically generates a UUID if not provided.
  fieldName: z
    .string()
    .nonempty({ message: "Field name is mandatory" }), // Mandatory field name validation.
  fieldURL: z
    .string()
    .url({ message: "URL format is invalid" }) // Validates the URL format.
    .optional(), // Optional field as it might not always be provided.
  logoURL: z
    .string()
    .url({ message: "Logo URL format is invalid" }) // Validates the URL format for logos.
    .optional(), // Optional field.
});



export const ApplicationSchema = z.object({
  id: z.number().optional(), // Auto-generated ID
  name: z.string().optional(),
  createdAt: z.string().datetime().default(() => new Date().toISOString()),
  updatedAt: z.string().datetime().optional(),
  customHeading: z.string().optional(),
  customDescription: z.string().optional(),
  customLogoUrl: z.string().url({ message: "Invalid URL format" }).optional(),
  userId: z.array(z.number()).default([]),
  devUserId: z.number().optional(),
  agencyUniqueId: z.string().uuid().default(() => crypto.randomUUID()),
  clientEmail: z
    .string()
    .email({ message: "Invalid email format" })
    .optional(),
  oAuthFields: z.array(z.number()).default([]),
  signInFields: z.array(z.number()).default([]),
  signUpFields: z.array(z.number()).default([]),
  customFields: z.array(z.number()).default([]),
  appUserType: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]).default("USER"), // Replace with actual enum values
  mfaEnabled: z.boolean().default(false),
  recentActivities: z.array(z.object({})).default([]), // Replace with proper `RecentActivity` schema
  events: z.array(z.object({})).default([]), // Replace with proper `Event` schema
});
