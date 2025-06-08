import type { Config } from 'drizzle-kit';
import { loadEnvConfig } from '@/lib/env';

// load env config based on the current NODE_ENV
loadEnvConfig();

export default {
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
} satisfies Config;
