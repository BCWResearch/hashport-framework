import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    optimizeDeps: {
        esbuildOptions: {
            define: { global: 'globalThis' },
            plugins: [
                polyfillNode({ globals: { process: false, __dirname: false, buffer: false } }),
            ],
        },
    },
});
