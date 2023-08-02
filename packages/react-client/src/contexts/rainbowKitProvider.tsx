import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, sepolia, polygon, optimism, arbitrum, zora, arbitrumGoerli } from 'wagmi/chains';
// import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum, zora, arbitrumGoerli, sepolia],
    [
        // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
        publicProvider(),
    ],
);
const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    projectId: `4a67d9054f92bb354025bb53fca49943`,
    chains,
});
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});

// TODO: allow configuring chains, testnet and mainnet
export const RainbowKitBoilerPlate = ({ children }: { children: React.ReactNode }) => {
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
        </WagmiConfig>
    );
};
