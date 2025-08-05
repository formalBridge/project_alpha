import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const isDocker = process.env.DOCKER === 'true';

declare module '@remix-run/server-runtime' {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    host: isDocker ? '0.0.0.0' : 'localhost',
    port: 3000,
    strictPort: true,
    hmr: isDocker
      ? {
          host: '0.0.0.0',
          port: 24678,
          clientPort: 24678,
        }
      : true,
    watch: {
      usePolling: isDocker,
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      scss: {
        loadPaths: ['.'],
      },
    },
  },
});
