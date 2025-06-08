import { config } from 'dotenv';
import path from 'path';

/**
 * Load environment variables based on the current NODE_ENV
 * Supports: development, production, test environments
 */
export function loadEnvConfig() {
  const NODE_ENV = process.env.NODE_ENV;

  if (!NODE_ENV) {
    throw new Error('Missing env: NODE_ENV');
  }

  // Define the path to the environment file
  const envFile = `.env.${NODE_ENV}`;
  const envPath = path.resolve(process.cwd(), envFile);

  console.info('Loading environment variables from', envFile, '...');

  // Load the environment file
  const result = config({ path: envPath });

  if (result.error) {
    throw new Error(`Warning: ${envFile} not found.`);
  }
}
