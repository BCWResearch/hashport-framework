import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, sepolia, polygon, optimism, arbitrum, zora, arbitrumGoerli } from 'wagmi/chains';
// import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { PropsWithChildren } from 'react';
import { RainbowKitProviderProps } from '@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/RainbowKitProvider';

const { chains: hashportChains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, zora, arbitrumGoerli, sepolia],
    [
        // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
        publicProvider(),
    ],
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

// TODO: allow configuring chains, testnet and mainnet
export const RainbowKitBoilerPlate = ({
    children,
    chains = [],
    ...rainbowKitProps
}: PropsWithChildren<Partial<RainbowKitProviderProps>>) => {
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={[...chains, ...hashportChains]} {...rainbowKitProps}>
                {children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
};
