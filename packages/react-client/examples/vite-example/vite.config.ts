import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';
// import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3000,
        open: true,
    },
    plugins: [react()],
    optimizeDeps: {
        include: ['@hashport/react-client', '@hashport/sdk'],
        esbuildOptions: {
            define: { global: 'globalThis' },
            plugins: [
                // https://github.com/cyco130/esbuild-plugin-polyfill-node/pull/15
                // eslint-disable-next-line
                // @ts-ignore: ts(2769)
                polyfillNode({
                    globals: { process: false, __dirname: false, buffer: false },
                }),
            ],
        },
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
});
