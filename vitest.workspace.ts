import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
    {
        test: {
            include: ['./packages/sdk/lib/**/*.test.*'],
            name: 'sdk',
            setupFiles: ['./packages/sdk/lib/test/setup.ts'],
        },
    },
    {
        extends: './vite.config.ts',
        test: {
            include: ['./packages/react-client/src/**/*.test.*'],
            name: 'react-client',
            setupFiles: [
                './packages/react-client/src/test/setup.ts',
                './packages/sdk/lib/test/setup.ts',
            ],
            environment: 'jsdom',
            globals: true,
        },
    },
]);
