import { CustomFee } from './fees';

export type TokenType = 'ft' | 'nft';

export type Network = {
    id: number;
    name: string;
};

export type FeePercentage = {
    amount: number;
    maxPercentage: number;
};

export type BridgeableNetwork = {
    network: Network;
    wrappedAsset: string;
};

export type Asset = {
    id: string;
    name: string;
    symbol: string;
    decimals: number;
    isNative: boolean;
    type: TokenType;
    minAmount: string;
    feePercentage: FeePercentage;
    reserveAmount: string;
    icon: string;
    bridgeableNetworks?: Record<number, BridgeableNetwork>;
    customFees?: CustomFee[];
    fee?: number;
    releaseTimestamp?: number;
};

export type NetworkReserveAmounts = Record<
    string, //network's chain id
    Record<string, AssetReserveAmounts> // key = token id
>;

export type AssetReserveAmounts = {
    id: string;
    name: string;
    networkId: string;
    networkName: string;
    reserveAmount: string;
    symbol: string;
    type: TokenType;
    bridgeableNetworks?: Record<string, BridgeableNetworkReserveAmounts>; // key = chain id
    decimals?: number;
    releaseTimestamp?: number;
};

export type BridgeableNetworkReserveAmounts = {
    network: Network;
    wrappedAsset: AssetReserveAmounts;
};

export type AssetMinAmount = {
    minAmount: string;
};

// Record of network chain id to map of token id to amount
export type NetworkMinAmounts = Record<string, Record<string, string>>;
