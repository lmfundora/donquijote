import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

if (
  typeof process !== "undefined" &&
  process.env &&
  !process.env.BETTER_AUTH_URL
) {
  try {
    // Si estás en Node 20.6+:
    process.loadEnvFile?.();
  } catch {
    // Si falla o la función no existe, no rompemos el flujo
  }
}

export const env = createEnv({
  server: {
    BETTER_AUTH_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1).optional(),
    CONVEX_DEPLOYMENT: z.string().min(1),
  },

  /**
   * En Vite / TanStack Start, las variables expuestas al cliente
   * deben empezar obligatoriamente con el prefijo VITE_
   */
  clientPrefix: "VITE_",

  client: {
    VITE_CONVEX_URL: z.string().url(),
    VITE_CONVEX_SITE_URL: z.string().url(), //judicious-bird-312.convex.site
    VITE_SITE_URL: z.string().url(),
  },

  /**
   * Pasa tus variables al entorno de ejecución
   */
  runtimeEnv: {
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    VITE_CONVEX_URL: process.env.VITE_CONVEX_URL,
    VITE_CONVEX_SITE_URL: process.env.VITE_CONVEX_SITE_URL,
    VITE_SITE_URL: process.env.VITE_SITE_URL,
    CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
  },

  /**
   * Trata las cadenas vacías como no definidas (útil si hay vars en blanco en el .env)
   */
  emptyStringAsUndefined: true,
});
