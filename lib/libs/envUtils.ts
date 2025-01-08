import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export function getEnvVariable(key: string): string | undefined {
  // Use `import.meta.env` for Vite during development or build
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[`VITE_${key}`]) {
    return import.meta.env[`VITE_${key}`];
  }

  // Check for process.env if it exists
  if (typeof process !== 'undefined' && process.env) {
    // For Next.js environment variables
    if (process.env[`NEXT_PUBLIC_${key}`]) {
      return process.env[`NEXT_PUBLIC_${key}`];
    }

    // For Create React App variables
    if (process.env[`REACT_APP_${key}`]) {
      return process.env[`REACT_APP_${key}`];
    }

    // General fallback for other environments
    if (process.env[key]) {
      return process.env[key];
    }
  }

  // Check for runtime-injected variables via `window.env`
  if (typeof window !== 'undefined' && (window as any).env && (window as any).env[key]) {
    return (window as any).env[key];
  }

  // Return undefined if no variable is found
  return undefined;
}
