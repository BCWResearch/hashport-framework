import { createWagmiSigner } from '@hashport/sdk/lib/adapters/wagmi';
import { EvmSigner } from '@hashport/sdk/lib/types';
import { usePublicClient, useWalletClient } from 'wagmi';

export const useRainbowKitSigner = (): EvmSigner | undefined => {
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    if (!publicClient || !walletClient) return undefined;
    return createWagmiSigner(publicClient, walletClient);
};
