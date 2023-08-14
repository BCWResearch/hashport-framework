import { useBridgeParams, useMinAmount, useTokenList } from '@hashport/react-client';
import { formatUnits } from 'viem';

// TODO: write a hook that can tell if queuing will work or not. ie, enough balance, meets minimum
export const usePreflightCheck = () => {
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
