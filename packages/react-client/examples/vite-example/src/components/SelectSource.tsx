import { AssetId, useBridgeParamsDispatch, useTokenList } from '@hashport/react-client';
import { ChangeEventHandler } from 'react';

export const SelectSource = () => {
    const { setSourceAsset } = useBridgeParamsDispatch();
    const { data: tokens } = useTokenList();

    const handleChooseSource: ChangeEventHandler<HTMLSelectElement> = e => {
        const sourceAsset = tokens?.fungible.get(e.target.value as AssetId);
        sourceAsset && setSourceAsset(sourceAsset);
    };

    return tokens ? (
        <select onChange={handleChooseSource}>
            <option value="">--Choose source asset--</option>
            {Array.from(tokens.fungible.entries()).map(([id, token]) => (
                <option key={id} value={id}>
                    {token.symbol}
                </option>
            ))}
        </select>
    ) : (
        <p>loading tokens...</p>
    );
};
