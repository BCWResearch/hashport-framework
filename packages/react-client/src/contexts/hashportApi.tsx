// TODO: replace after publishing package
import { HashportApiClient } from '../../../sdk/lib/clients/hashportApiClient';
import { createContext, useMemo } from 'react';

export const HashportApiContext = createContext<HashportApiClient | null>(null);

export const HashportApiProvider = ({
    children,
    mode = 'mainnet',
}: {
    children: React.ReactNode;
    mode: 'mainnet' | 'testnet';
}) => {
    const hashportApiClient = useMemo(() => new HashportApiClient(mode), [mode]);
    return (
        <HashportApiContext.Provider value={hashportApiClient}>
            {children}
        </HashportApiContext.Provider>
    );
};
