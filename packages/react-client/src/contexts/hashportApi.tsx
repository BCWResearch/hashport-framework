// TODO: replace after publishing package
import { HashportApiClient } from '@hashport/sdk/lib/clients/hashportApiClient';
import { createContext, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const hashportQueryClient = new QueryClient();

export const HashportApiContext = createContext<HashportApiClient | null>(null);

export const HashportApiProvider = ({
    children,
    mode,
}: {
    children: React.ReactNode;
    mode: 'mainnet' | 'testnet';
}) => {
    const hashportApiClient = useMemo(() => new HashportApiClient(mode), [mode]);
    return (
        <HashportApiContext.Provider value={hashportApiClient}>
            <QueryClientProvider client={hashportQueryClient}>{children}</QueryClientProvider>
        </HashportApiContext.Provider>
    );
};
