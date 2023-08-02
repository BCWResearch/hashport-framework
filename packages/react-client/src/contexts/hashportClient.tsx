import { createContext, PropsWithChildren } from 'react';
// TODO: replace after publishing package
import { HashportClient } from '@hashport/sdk/lib/clients/hashportClient';
import { HashportClientConfig } from '@hashport/sdk/lib/types/clients';
import { BridgeParamsProvider } from './bridgeParams';

export type HashportContextProps = PropsWithChildren<Partial<HashportClientConfig>> & {
    disconnectedAccountsFallback?: React.ReactNode;
};

export const HashportClientContext = createContext<undefined | HashportClient>(undefined);

export const HashportClientContextProvider = ({
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
    return (
        <HashportClientContext.Provider value={hashportClient}>
            <BridgeParamsProvider>
                {hashportClient ? children : disconnectedAccountsFallback}
            </BridgeParamsProvider>
        </HashportClientContext.Provider>
    );
};
