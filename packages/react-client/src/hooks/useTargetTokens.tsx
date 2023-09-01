import { AssetId, AssetInfo } from 'types';
import { useBridgeParams } from './useBridgeParams';
import { useTokenList } from './useTokenList';

export const useTargetTokens = () => {
    const { data: tokens } = useTokenList();
    const { sourceAssetId, sourceNetworkId } = useBridgeParams();

    const sourceId: AssetId = `${sourceAssetId}-${+sourceNetworkId}`;
    const sourceAsset = tokens?.fungible.get(sourceId);

    if (!tokens) return tokens;

    return sourceAsset?.bridgeableAssets
        .map(({ assetId }) => {
            const asset = tokens.fungible.get(assetId);
            if (!asset) return;
            return {
                ...asset,
                assetId,
            };
        })
        .filter((token): token is AssetInfo & { assetId: AssetId } => !!token);
};
