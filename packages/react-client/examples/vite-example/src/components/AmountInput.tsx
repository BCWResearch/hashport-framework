import { useBridgeParamsDispatch, useSelectedTokens } from '@hashport/react-client';
import { ChangeEventHandler } from 'react';

export const AmountInput = () => {
    const { sourceAsset, targetAsset } = useSelectedTokens();
    const { setAmount } = useBridgeParamsDispatch();

    const handleAmount: ChangeEventHandler<HTMLInputElement> = e => {
        setAmount({
            amount: e.target.value,
            sourceAssetDecimals: sourceAsset?.decimals,
            targetAssetDecimals: targetAsset?.decimals,
        });
    };

    return <input placeholder="amount" onChange={handleAmount} />;
};
