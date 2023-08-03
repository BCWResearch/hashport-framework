import { createContext, PropsWithChildren } from 'react';
// TODO: replace after publishing package
import { HashportClient } from '@hashport/sdk/lib/clients/hashportClient';
import { HashportClientConfig } from '@hashport/sdk/lib/types/clients';
import { BridgeParamsProvider } from './bridgeParams';
import { useRainbowKitSigner } from 'hooks/useRainbowKitSigner';
import { RainbowKitBoilerPlate } from './rainbowKitProvider';
import { HashportApiProvider } from './hashportApi';

export type HashportContextProps = PropsWithChildren<Partial<HashportClientConfig>> & {
    disconnectedAccountsFallback?: React.ReactNode;
};

export const HashportClientContext = createContext<undefined | HashportClient>(undefined);

export const HashportClientProvider = ({
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
        <HashportApiProvider mode={mode}>
            <HashportClientContext.Provider value={hashportClient}>
                <BridgeParamsProvider>
                    {hashportClient ? children : disconnectedAccountsFallback}
                </BridgeParamsProvider>
            </HashportClientContext.Provider>
        </HashportApiProvider>
    );
};

const HashportClientForRainbowKit = ({
    children,
    hederaSigner,
    customMirrorNodeCredentials,
    customMirrorNodeUrl,
    debug,
    persistOptions,
    mode = 'mainnet',
    disconnectedAccountsFallback = <p>Please connect signers for both EVM and Hedera networks</p>,
}: Omit<HashportContextProps, 'evmSigner'>) => {
    const evmSigner = useRainbowKitSigner();
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

export const HashportClientAndRainbowKitProvider = ({
    children,
    ...props
}: Omit<HashportContextProps, 'evmSigner'>) => {
    return (
        <HashportApiProvider mode={props.mode}>
            <RainbowKitBoilerPlate>
                <HashportClientForRainbowKit {...props}>{children}</HashportClientForRainbowKit>
            </RainbowKitBoilerPlate>
        </HashportApiProvider>
    );
};
