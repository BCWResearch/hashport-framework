import { createContext, PropsWithChildren } from 'react';
// TODO: replace after publishing package
import { HashportClient } from '@hashport/sdk/lib/clients/hashportClient';
import { HashportClientConfig } from '@hashport/sdk/lib/types/clients';
import { BridgeParamsProvider } from './bridgeParams';
import { HashportApiProvider } from './hashportApi';
import { HashportQueryClient } from './hashportQueryClient';

export type HashportContextProps = PropsWithChildren<Partial<HashportClientConfig>> & {
    disconnectedAccountsFallback?: React.ReactNode;
};

export const HashportContext = createContext<null | HashportClient>(null);

export const HashportContextProvider = ({
    children,
    evmSigner,
    hederaSigner,
    customMirrorNodeCredentials,
    customMirrorNodeUrl,
    debug,
    persistOptions,
    mode = 'mainnet',
    disconnectedAccountsFallback = <p>Please connect signers for both EVM and Hedera networks</p>,
}: HashportContextProps) => {
    const hashportClient =
        evmSigner &&
        hederaSigner &&
        new HashportClient({
            evmSigner,
            hederaSigner,
            customMirrorNodeCredentials,
            customMirrorNodeUrl,
            debug,
            mode,
            persistOptions,
        });
    return hashportClient ? (
        <HashportContext.Provider value={hashportClient}>
            <BridgeParamsProvider>
                <HashportQueryClient>
                    <HashportApiProvider mode={mode}>{children}</HashportApiProvider>
                </HashportQueryClient>
            </BridgeParamsProvider>
        </HashportContext.Provider>
    ) : (
        disconnectedAccountsFallback
    );
};
