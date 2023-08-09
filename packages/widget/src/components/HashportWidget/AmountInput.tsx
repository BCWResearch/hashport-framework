import { useBridgeParams, useBridgeParamsDispatch, useTokenList } from '@hashport/react-client';
import { Input } from 'components/styled/Input';
import { ChangeEventHandler } from 'react';

export const AmountInput = () => {
    const dispatch = useBridgeParamsDispatch();
    const { data: tokens } = useTokenList();
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
        <Input
            placeholder="0.00000000"
            onChange={handleAmount}
            value={amount}
            // endAdornment={<TokenSelect/>}
        />
    );
};
