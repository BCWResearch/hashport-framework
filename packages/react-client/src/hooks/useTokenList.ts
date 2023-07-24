import { CondensedAsset, NetworkAssets } from '@hashport/sdk';
import { useQuery } from '@tanstack/react-query';
import { useHashportApiClient } from './useHashportApiClient';

type ChainId = number;

type AssetId = `${string}-${ChainId}`;

type AssetInfo = Omit<CondensedAsset, 'bridgeableNetworks'> & {
    chainId: ChainId;
    bridgeableAssets: { chainId: ChainId; assetId: AssetId }[];
};

type AssetMap = Map<AssetId, AssetInfo>;

type HashportAssets = {
    fungible: AssetMap;
    nonfungible: AssetMap;
};

export const validateAssets = (
    asset: [AssetId, Partial<AssetInfo>],
): asset is [AssetId, AssetInfo] => {
    const { bridgeableAssets, chainId, decimals, icon, id, isNative, name, symbol } = asset[1];
    const hasWrappedAssets = (bridgeableAssets?.length ?? 0) > 0;
    return Boolean(
        hasWrappedAssets &&
            chainId &&
            typeof decimals === 'number' &&
            icon &&
            id &&
            isNative !== undefined &&
            name &&
            symbol,
    );
};

export const formatAssets = (networkAssets: NetworkAssets[]): HashportAssets => {
    const partialFungibles = new Map<AssetId, Partial<AssetInfo>>();
    const partialNonfungibles = new Map<AssetId, Partial<AssetInfo>>();

    for (const { assets, network } of networkAssets) {
        const chainId = network.id;
        Object.entries(assets).forEach(([tokenId, assetDetails]) => {
            const { symbol, isNative, bridgeableNetworks, name } = assetDetails;
            const assetId: AssetId = `${tokenId}-${chainId}`;
            const decimals = assetDetails.decimals ?? 0;
            const isNft = decimals === 0;
            const bridgeableAssets = Object.entries(bridgeableNetworks ?? {}).map(
                ([wrappedChainId, { wrappedAsset }]) => {
                    const wrappedAssetId: AssetId = `${wrappedAsset}-${+wrappedChainId}`;
                    const assetCollection = isNft ? partialNonfungibles : partialFungibles;
                    const wrappedAssetInfo = assetCollection.get(wrappedAssetId) ?? {};
                    assetCollection.set(wrappedAssetId, {
                        ...wrappedAssetInfo,
                        bridgeableAssets: [{ chainId, assetId }],
                    });
                    return { chainId: +wrappedChainId, assetId: wrappedAssetId };
                },
            );

            const token: Partial<AssetInfo> = {
                id: tokenId,
                symbol,
                chainId,
                name,
                bridgeableAssets,
                decimals,
                isNative,
                icon: assetDetails.icon,
            };
            (isNft ? partialNonfungibles : partialFungibles).set(assetId, token);
        });
    }
    const fungible = new Map(Array.from(partialFungibles).filter(validateAssets));
    const nonfungible = new Map(Array.from(partialNonfungibles).filter(validateAssets));
    return {
        fungible,
        nonfungible,
    };
};

// TODO: pass in optional onSelect handlers, etc
export const useTokenList = () => {
    const hashportApiClient = useHashportApiClient();
    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['token-list'],
        queryFn: async () => {
            const assets = await hashportApiClient.assets();
            return assets;
        },
    });
    //  TODO: think about how to handle network errors, etc
    if (!data || isLoading || isError) return null;
    return formatAssets(data);
};
