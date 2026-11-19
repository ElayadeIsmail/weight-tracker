import * as v from "valibot";

const envSchema = v.object({
  EXPO_PUBLIC_APP_ID: v.pipe(v.string(), v.minLength(1)),
  EXPO_PUBLIC_SUPABASE_PROJECT_URL: v.pipe(v.string(), v.minLength(1)),
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: v.pipe(v.string(), v.minLength(1)),
  EXPO_PUBLIC_ESTIMATE_ENDPOINT: v.pipe(v.string(), v.minLength(1)),
});

const parsed = v.safeParse(envSchema, {
  EXPO_PUBLIC_APP_ID: process.env.EXPO_PUBLIC_APP_ID,
  EXPO_PUBLIC_SUPABASE_PROJECT_URL:
    process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL,
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  EXPO_PUBLIC_ESTIMATE_ENDPOINT: process.env.EXPO_PUBLIC_ESTIMATE_ENDPOINT,
});

if (!parsed.success) {
  const message = parsed.issues
    .map((issue) => {
      const path = v.getDotPath(issue);
      return path ? `${path}: ${issue.message}` : issue.message;
    })
    .join("\n");

  throw new Error(`Invalid environment variables:\n${message}`);
}

export const env = parsed.output;
