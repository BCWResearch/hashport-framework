import { AssetId } from 'types';
import { useBridgeParams } from './useBridgeParams';
import { useTokenList } from './useTokenList';

export const useSelectedTokens = () => {
    const { data: tokens } = useTokenList();
    const { sourceAssetId, sourceNetworkId, targetNetworkId } = useBridgeParams();

    const sourceId: AssetId = `${sourceAssetId}-${+sourceNetworkId}`;
    const sourceAsset = tokens?.fungible.get(sourceId);
    const targetId: AssetId =
        sourceAsset?.bridgeableAssets.find(({ chainId }) => chainId === +targetNetworkId)
            ?.assetId ?? `${''}-${0}`;
    const targetAsset = tokens?.fungible.get(targetId);

    return {
        sourceAsset,
        targetAsset,
    };
};
