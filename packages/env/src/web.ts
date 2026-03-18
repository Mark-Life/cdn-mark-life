import { z } from "zod";

const envSchema = z.object({
  VITE_CONVEX_URL: z.string().url(),
  VITE_CDN_BASE_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(env: Record<string, string | undefined>): Env {
  return envSchema.parse(env);
}
