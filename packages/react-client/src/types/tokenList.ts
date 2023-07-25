import { CondensedAsset } from '@hashport/sdk';
import { SelectTokenPayload } from 'types';

export type ChainId = number;

export type AssetId = `${string}-${ChainId}`;

export type AssetInfo = Omit<CondensedAsset, 'bridgeableNetworks'> & {
    chainId: ChainId;
    bridgeableAssets: { chainId: ChainId; assetId: AssetId }[];
    handleSelect: (token: SelectTokenPayload) => void;
};

export type AssetMap = Map<AssetId, AssetInfo>;

export type HashportAssets = {
    fungible: AssetMap;
    nonfungible: AssetMap;
};

export type TokenListProps = {
    onSelect?: () => void;
};
