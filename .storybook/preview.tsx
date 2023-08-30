import React from 'react';
import type { Preview } from '@storybook/react';
import {
    HashportClientProviderWithRainbowKit,
    ProcessingTransactionProvider,
    useHashConnect,
} from '@hashport/react-client';
import { createHashPackSigner } from '@hashport/sdk';
import { ThemeProvider } from '../packages/widget/src/theme';

const Providers = ({ children }: { children: React.ReactNode }) => {
    const { hashConnect, pairingData } = useHashConnect();
    return (
        <div style={{ padding: '2em', backgroundColor: 'rgb(25,25,35)' }}>
            <ThemeProvider>
                <HashportClientProviderWithRainbowKit
                    mode="testnet"
                    hederaSigner={hashConnect && createHashPackSigner(hashConnect, pairingData)}
                >
                    <ProcessingTransactionProvider>{children}</ProcessingTransactionProvider>
                </HashportClientProviderWithRainbowKit>
            </ThemeProvider>
        </div>
    );
};

const preview: Preview = {
    decorators: [
        (story, ctx) => {
            return ctx.componentId === 'hashport-widget' ? (
                story()
            ) : (
                <Providers>{story()}</Providers>
            );
        },
    ],
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
};

export default preview;
