import { CondensedAsset } from '@hashport/sdk';
import { useQuery } from '@tanstack/react-query';
import { useHashportApiClient } from './useHashportApiClient';

type HashportAssets = Map<`${string}-${number}`, CondensedAsset>;

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
    if (!data) return null;
    // TODO: format hashport assets
};

// const formatAssets = (
//     assetsByNetwork: NetworkAssets,
// ): { fetchedTokenConfig: TokenConfig; fetchedNftConfig: TokenConfig } => {
//     const fungibles: Map<`${string}-${number}`, Token> = new Map();
//     const nonfungibles: Map<`${string}-${number}`, Token> = new Map();
//     const wrappedIdToNativeId: [
//         `${string}-${number}`,
//         { tokenId: string; chainId: number; isNft: boolean },
//     ][] = [];
//     for (const { assets, network } of assetsByNetwork) {
//         const chainId = network.id;
//         Object.entries(assets).forEach(([tokenId, assetDetails]) => {
//             const { symbol, isNative, bridgeableNetworks } = assetDetails;
//             if (tokenBlacklist.has(symbol.split(`[`)[0])) return;
//             const decimals = assetDetails.decimals ?? 0;
//             const isNft = decimals === 0;
//             let bridgeableTokens: Record<number, `${string}-${number}`> = {};
//             if (bridgeableNetworks) {
//                 bridgeableTokens = Object.fromEntries(
//                     Object.entries(bridgeableNetworks).map(([chain, { wrappedAsset }]) => {
//                         // Saving wrapped token's native info
//                         const wrappedAssetId: `${string}-${number}` = `${wrappedAsset}-${+chain}`;
//                         wrappedIdToNativeId.push([
//                             wrappedAssetId,
//                             {
//                                 isNft,
//                                 tokenId,
//                                 chainId,
//                             },
//                         ]);
//                         return [+chain, `${wrappedAsset}-${+chain}`];
//                     }),
//                 );
//             }
//             const key: `${string}-${number}` = `${tokenId}-${chainId}`;
//             const token: Token = {
//                 id: tokenId,
//                 symbol,
//                 nativeChain: chainId,
//                 bridgeableTokens,
//                 decimals,
//                 isNative,
//                 imageSrc: assetDetails.icon,
//             };
//             (isNft ? nonfungibles : fungibles).set(key, token);
//         });
//         // Updating wrapped tokens with respective native info
//         wrappedIdToNativeId.forEach(([wrappedId, nativeTokenInfo]) => {
//             const wrappedToken = (nativeTokenInfo.isNft ? nonfungibles : fungibles).get(wrappedId);
//             if (!wrappedToken) return;
//             const bridgeableTokens: Record<number, `${string}-${number}`> = {
//                 ...wrappedToken.bridgeableTokens,
//                 [nativeTokenInfo.chainId]: `${nativeTokenInfo.tokenId}-${nativeTokenInfo.chainId}`,
//             };
//             wrappedToken.bridgeableTokens = bridgeableTokens;
//         });
//     }
//     return {
//         fetchedTokenConfig: Object.fromEntries(fungibles),
//         fetchedNftConfig: Object.fromEntries(nonfungibles),
//     };
// };
