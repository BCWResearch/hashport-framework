import React, { useEffect } from 'react';
import type { Preview } from '@storybook/react';
import {
    HashportClientProviderWithRainbowKit,
    ProcessingTransactionProvider,
    useHashConnect,
} from '@hashport/react-client';
import { createHashPackSigner } from '@hashport/sdk';
import { ThemeProvider } from '../packages/widget/src/theme';

const handler: Parameters<typeof addEventListener<'message'>>[1] = (e: MessageEvent<unknown>) => {
    const { data } = e;
    if (
        typeof data === 'object' &&
        data &&
        'type' in data &&
        typeof data.type === 'string' &&
        data.type.includes('hashconnect')
    ) {
        parent.postMessage(data, '*');
    }
};

const HashconnectMessageForwarding = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    return children;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
    const { hashConnect, pairingData } = useHashConnect();
    const hederaSigner =
        hashConnect && pairingData && createHashPackSigner(hashConnect, pairingData);
    return (
        <div style={{ padding: '2em', backgroundColor: 'rgb(25,25,35)' }}>
            <ThemeProvider>
                <HashportClientProviderWithRainbowKit mode="testnet" hederaSigner={hederaSigner}>
                    <ProcessingTransactionProvider>{children}</ProcessingTransactionProvider>
                </HashportClientProviderWithRainbowKit>
            </ThemeProvider>
        </div>
    );
};

const preview: Preview = {
    decorators: [
        (story, ctx) => {
            return ctx.componentId.includes('hashport-widget') ? (
                story()
            ) : (
                <Providers>{story()}</Providers>
            );
        },
        story => {
            return <HashconnectMessageForwarding>{story()}</HashconnectMessageForwarding>;
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
