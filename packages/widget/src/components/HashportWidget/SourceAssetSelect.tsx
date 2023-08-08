import { useBridgeParams, useBridgeParamsDispatch, useTokenList } from '@hashport/react-client';
import { ChangeEventHandler } from 'react';

export const SourceAssetSelect = () => {
    const dispatch = useBridgeParamsDispatch();
    const { data: tokens, isError, isLoading } = useTokenList();
    const { sourceAssetId, sourceNetworkId } = useBridgeParams();

    const source = { id: sourceAssetId, chain: sourceNetworkId };
    const sourceId = source.id && source.chain ? (`${source.id}-${+source.chain}` as const) : null;

    const handleSetSource: ChangeEventHandler<HTMLSelectElement> = e => {
        dispatch.setSourceAsset(tokens?.fungible.get(e.target.value as `${string}-${number}`));
    };

    if (isLoading) {
        return <p>Loading Assets</p>;
    } else if (isError) {
        return <p>Error Loading Assets</p>;
    } else {
        return (
            <label>
                Source Asset:
                <select value={sourceId ?? ''} onChange={handleSetSource}>
                    <option value="">Choose a source asset</option>
                    {Array.from(tokens.fungible)
                        .sort((a, b) => a[1].symbol.localeCompare(b[1].symbol))
                        .map(([id, token]) => {
                            return (
                                <option key={id} value={id}>
                                    {token.symbol}
                                </option>
                            );
                        })}
                </select>
            </label>
        );
    }
};
