import { NetworkAssets } from '@hashport/sdk';
import { useQuery } from '@tanstack/react-query';
import { useHashportApiClient } from './useHashportApiClient';
import { AssetId, AssetInfo, HashportAssets, TokenListProps } from 'types';

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
            const assetCollection = isNft ? partialNonfungibles : partialFungibles;
            const bridgeableAssets = Object.entries(bridgeableNetworks ?? {}).map(
                ([wrappedChainId, { wrappedAsset }]) => {
                    const wrappedAssetId: AssetId = `${wrappedAsset}-${+wrappedChainId}`;
                    const wrappedAssetInfo = assetCollection.get(wrappedAssetId) ?? {};
                    assetCollection.set(wrappedAssetId, {
                        ...wrappedAssetInfo,
                        bridgeableAssets: [{ chainId, assetId }],
                    });
                    return { chainId: +wrappedChainId, assetId: wrappedAssetId };
                },
            );

            const currentBridgeableAssets = assetCollection.get(assetId)?.bridgeableAssets ?? [];
            const token: AssetInfo = {
                id: tokenId,
                symbol,
                chainId,
                name,
                bridgeableAssets: [...bridgeableAssets, ...currentBridgeableAssets],
                decimals,
                isNative,
                icon: assetDetails.icon,
                handleSelect: () => null,
            };
            assetCollection.set(assetId, token);
        });
    }
    return {
        fungible: partialFungibles,
        nonfungible: partialNonfungibles,
    } as HashportAssets;
};

export const useTokenList = ({ onSelect }: TokenListProps = {}) => {
    const hashportApiClient = useHashportApiClient();

    const queryInfo = useQuery({
        staleTime: Infinity,
        queryKey: ['token-list'],
        queryFn: async () => {
            const assets = await hashportApiClient.assets();
            return formatAssets(assets);
        },
    });

    return {
        ...queryInfo,
        data: queryInfo.data
            ? {
                  fungible: new Map(
                      Array.from(queryInfo.data.fungible).map(([id, assetInfo]) => [
                          id,
                          { ...assetInfo, handleSelect: () => onSelect?.(assetInfo) },
                      ]),
                  ),
                  nonfungible: new Map(
                      Array.from(queryInfo.data.nonfungible).map(([id, assetInfo]) => [
                          id,
                          { ...assetInfo, handleSelect: () => onSelect?.(assetInfo) },
                      ]),
                  ),
              }
            : undefined,
    } as typeof queryInfo;
};
