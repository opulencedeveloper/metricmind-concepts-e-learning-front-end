import { Environment } from '@/types/environment';

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    console.warn(`Environment variable ${key} is missing! Using default or undefined.`);
  }

  return value || '';
};

const appConfig = {
  app: {
    environment: (process.env.NODE_ENV || Environment.Development) as Environment,
    isDevelopment: process.env.NODE_ENV === Environment.Development,
    isProduction: process.env.NODE_ENV === Environment.Production,
    name: 'MetricMind E-Learning',
  },

  api: {
    baseURL: getEnv('NEXT_PUBLIC_API_URL', 'http://localhost:8080/api/v1'),
    timeout: parseInt(getEnv('NEXT_PUBLIC_API_TIMEOUT', '30000'), 10),
  },

  frontend: {
    baseUrl: getEnv('NEXT_PUBLIC_FRONTEND_URL', 'http://localhost:3000'),
  },

};

export default appConfig;
