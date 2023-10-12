import {
    AssetId,
    useBridgeParamsDispatch,
    useSelectedTokens,
    useTargetTokens,
    useTokenList,
} from '@hashport/react-client';
import { ChangeEventHandler } from 'react';

export const SelectTarget = () => {
    const { setTargetAsset } = useBridgeParamsDispatch();
    const { data: tokens } = useTokenList();
    const { targetAsset } = useSelectedTokens();
    const targetTokens = useTargetTokens();

    const handleChooseTarget: ChangeEventHandler<HTMLSelectElement> = e => {
        const targetAsset = tokens?.fungible.get(e.target.value as AssetId);
        targetAsset && setTargetAsset(targetAsset);
    };

    return tokens ? (
        <select onChange={handleChooseTarget}>
            <option value={''}>--To--</option>
            {targetAsset?.bridgeableAssets.map(({ assetId }) => {
                const asset = tokens?.fungible.get(assetId);
                if (!asset) return;
                return (
                    <option key={assetId} value={assetId}>
                        {asset.symbol}
                    </option>
                );
            })}
            {targetTokens?.map(({ assetId, symbol }) => (
                <option key={assetId} value={assetId}>
                    {symbol}
                </option>
            ))}
        </select>
    ) : (
        <p>loading tokens...</p>
    );
};
