/**
 * Environment variables with type safety
 * Access environment variables through this module for type checking
 */

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  AUTH_SECRET: process.env.AUTH_SECRET!,
  NODE_ENV: process.env.NODE_ENV || "development",
} as const;

// Validate required environment variables
if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

if (!env.AUTH_SECRET && env.NODE_ENV === "production") {
  throw new Error("AUTH_SECRET is required in production");
}
