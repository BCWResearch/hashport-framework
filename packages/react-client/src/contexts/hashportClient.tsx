import { ComponentProps, createContext, PropsWithChildren } from 'react';
import { HashportClient } from '@hashport/sdk';
import { HashportClientConfig } from '@hashport/sdk';
import { BridgeParamsProvider } from './bridgeParams';
import { useRainbowKitSigner } from 'hooks/useRainbowKitSigner';
import { RainbowKitBoilerPlate } from './rainbowKitProvider';
import { HashportApiProvider } from './hashportApi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

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

type HashportClientWithRainbowKitProviderProps = Omit<HashportContextProps, 'evmSigner'> & {
    renderConnectButton?: (
        children: React.ReactNode,
        RainbowKitConnectButton: typeof ConnectButton,
    ) => React.ReactNode;
};

const HashportClientForRainbowKit = ({
    children,
    renderConnectButton = (children, RainbowKitConnectButton) => {
        return (
            <>
                <RainbowKitConnectButton />
                {children}
            </>
        );
    },
    hederaSigner,
    mode = 'mainnet',
    disconnectedAccountsFallback = <p>Please connect signers for both EVM and Hedera networks</p>,
    ...rest
}: HashportClientWithRainbowKitProviderProps) => {
    const evmSigner = useRainbowKitSigner();
    const hashportClient =
        evmSigner &&
        hederaSigner &&
        new HashportClient({
            evmSigner,
            hederaSigner,
            mode,
            ...rest,
        });
    return (
        <HashportClientContext.Provider value={hashportClient}>
            <BridgeParamsProvider>
                {renderConnectButton(
                    hashportClient ? children : disconnectedAccountsFallback,
                    ConnectButton,
                )}
            </BridgeParamsProvider>
        </HashportClientContext.Provider>
    );
};

export const HashportClientProviderWithRainbowKit = ({
    children,
    rainbowKitProviderProps = {},
    ...props
}: HashportClientWithRainbowKitProviderProps & {
    rainbowKitProviderProps?: ComponentProps<typeof RainbowKitBoilerPlate>;
}) => {
    return (
        <HashportApiProvider mode={props.mode}>
            <RainbowKitBoilerPlate {...rainbowKitProviderProps}>
                <HashportClientForRainbowKit {...props}>{children}</HashportClientForRainbowKit>
            </RainbowKitBoilerPlate>
        </HashportApiProvider>
    );
};
