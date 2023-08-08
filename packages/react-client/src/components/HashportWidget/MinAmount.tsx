import { useBridgeParams, useMinAmount, useTokenList } from 'hooks';
import { formatUnits } from 'viem';

export const MinAmount = () => {
    const { data: tokens } = useTokenList();
    const { data: minAmount } = useMinAmount();
    const { sourceAssetId, sourceNetworkId } = useBridgeParams();

    const sourceId = `${sourceAssetId}-${+sourceNetworkId}` as const;
    const sourceAssetDecimals = tokens?.fungible.get(sourceId)?.decimals;

    return minAmount && sourceAssetDecimals ? (
        <p>Min amount: {formatUnits(BigInt(minAmount), sourceAssetDecimals)}</p>
    ) : (
        <></>
    );
};
