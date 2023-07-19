import { StateStorage } from 'zustand/middleware';
import { EvmSigner } from '../signers/evmSigner';
import { HederaSigner } from '../signers/hederaSigner';

export type HashportClientConfig = {
    evmSigner: EvmSigner;
    hederaSigner: HederaSigner;
    mode?: 'mainnet' | 'testnet';
    customMirrorNodeUrl?: string;
    customMirrorNodeCredentials?: [string, string];
    debug?: boolean;
    persistOptions?: { persistKey?: string; storage?: StateStorage };
};
