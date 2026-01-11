export const envConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  appName: import.meta.env.VITE_APP_NAME || 'OneLink',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
} as const;
