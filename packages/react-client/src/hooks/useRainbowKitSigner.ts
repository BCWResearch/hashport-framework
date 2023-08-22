import { createWagmiSigner, EvmSigner } from '@hashport/sdk';
import { usePublicClient, useWalletClient } from 'wagmi';

export const useRainbowKitSigner = (): EvmSigner | undefined => {
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    if (!publicClient || !walletClient) return undefined;
    return createWagmiSigner(publicClient, walletClient);
};
