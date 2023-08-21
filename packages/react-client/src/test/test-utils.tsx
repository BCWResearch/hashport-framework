/* eslint-disable react-refresh/only-export-components */
import { mockEvmSigner, mockHederaSigner } from '@hashport/sdk/lib/test/mocks/mockSigners';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderOptions, render, renderHook } from '@testing-library/react';
import { HashportClientProvider } from 'contexts';
import { ProcessingTransactionProvider } from 'contexts/processingTransaction';

const Providers = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return (
        <HashportClientProvider evmSigner={mockEvmSigner} hederaSigner={mockHederaSigner}>
            <ProcessingTransactionProvider>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </ProcessingTransactionProvider>
        </HashportClientProvider>
    );
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) => {
    render(ui, { ...options, wrapper: Providers });
};

const customHookRender: typeof renderHook = (hook, options?) => {
    return renderHook(hook, { ...options, wrapper: Providers });
};

export * from '@testing-library/react';
export { customRender as render };
export { customHookRender as renderHook };
