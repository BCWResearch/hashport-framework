import { useBridgeParams, useMinAmount, useTokenList } from '@hashport/react-client';
import { formatUnits } from 'viem';

export const MinAmount = () => {
    const { data: tokens } = useTokenList();
    const { data: minAmount } = useMinAmount();
    const { sourceAssetId, sourceNetworkId } = useBridgeParams();

    const sourceId = `${sourceAssetId}-${+sourceNetworkId}` as const;
    const sourceAssetDecimals = tokens?.fungible.get(sourceId)?.decimals;

    return minAmount && sourceAssetDecimals ? (
        <p style={{ color: 'white' }}>
            Min amount: {formatUnits(BigInt(minAmount), sourceAssetDecimals)}
        </p>
    ) : (
        <></>
    );
};
