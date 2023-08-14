import { useBridgeParams, useBridgeParamsDispatch, useTokenList } from '@hashport/react-client';
import { Input } from 'components/styled/Input';
import { ChangeEventHandler } from 'react';
import { SourceAssetSelect } from './SourceAssetSelect';
import { Collapse } from 'components/styled/Collapse';
import { useInProgressHashportId } from 'hooks/inProgressHashportId';

export const AmountInput = () => {
    const dispatch = useBridgeParamsDispatch();
    const { data: tokens } = useTokenList();
    const [inProgressId] = useInProgressHashportId();
    const { amount, sourceAssetId, sourceNetworkId, targetNetworkId } = useBridgeParams();

    const sourceId = `${sourceAssetId}-${+sourceNetworkId}` as const;
    const sourceAsset = sourceId && tokens?.fungible.get(sourceId);
    const bridgeable = sourceAsset ? sourceAsset?.bridgeableAssets : null;
    const target = bridgeable?.find(({ chainId }) => chainId === +targetNetworkId);
    const targetAsset = target && tokens?.fungible.get(target.assetId);

    const handleAmount: ChangeEventHandler<HTMLInputElement> = e => {
        dispatch.setAmount({
            amount: e.target.value,
            sourceAssetDecimals: sourceAsset?.decimals,
            targetAssetDecimals: targetAsset?.decimals,
        });
    };

    return (
        <Collapse
            in={!inProgressId}
            sx={({ spacing }) => ({ marginBottom: spacing(!inProgressId ? 2 : 0) })}
        >
            <Input
                disabled={!sourceAssetId}
                placeholder="0.00000000"
                onChange={handleAmount}
                value={amount}
                endAdornment={<SourceAssetSelect />}
            />
        </Collapse>
    );
};
