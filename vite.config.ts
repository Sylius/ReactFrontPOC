import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      ...(process.env.VITE_APP_ENV === 'development' && {
        proxy: {
          '/api': {
            target: 'https://v2.demo.sylius.com',
            changeOrigin: true,
            rewrite: (path) => path,
          },
        },
      }),
    },
  };
});
