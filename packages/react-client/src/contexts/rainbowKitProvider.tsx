import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { PropsWithChildren } from 'react';
import { RainbowKitProviderProps } from '@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/RainbowKitProvider';
import { useNetworks } from 'hooks/useNetworks';

export const RainbowKitBoilerPlate = ({
    children,
    chains: chainsOverride = [],
    ...rainbowKitProps
}: PropsWithChildren<Partial<RainbowKitProviderProps>>) => {
    const { data: networks } = useNetworks();
    const hashportChains = (networks ?? [])
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(({ id }) => Object.values(wagmiChains).find(({ id: wagmiId }) => wagmiId === id))
        .filter((chain): chain is wagmiChains.Chain => Boolean(chain));

    const { chains, publicClient } = configureChains(
        [wagmiChains.mainnet, ...hashportChains],
        [publicProvider()],
    );
    const { connectors } = getDefaultWallets({
        appName: 'My RainbowKit App',
        projectId: `4a67d9054f92bb354025bb53fca49943`,
        chains: hashportChains,
    });
    const wagmiConfig = createConfig({
        autoConnect: true,
        connectors,
        publicClient,
    });

    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={[...chainsOverride, ...chains]} {...rainbowKitProps}>
                {children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
};
