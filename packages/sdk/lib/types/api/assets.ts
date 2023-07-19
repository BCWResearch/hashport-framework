import { BridgeableNetwork, Network } from './networks';

export type NetworkAssets = {
  assets: Record<string, CondensedAsset>;
  network: Network;
};

export type CondensedAsset = {
  id: string;
  isNative: boolean;
  name: string;
  symbol: string;
  icon: string;
  decimals?: number;
  bridgeableNetworks?: Record<string, BridgeableNetwork>;
  releaseTimestamp?: number;
};
