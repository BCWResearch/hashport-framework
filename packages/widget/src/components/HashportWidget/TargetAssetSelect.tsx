import {
    useBridgeParams,
    useBridgeParamsDispatch,
    useHashportClient,
    useTokenList,
} from '@hashport/react-client';
import { ChangeEventHandler, useEffect } from 'react';

export const TargetAssetSelect = () => {
    const hashportClient = useHashportClient();
    const dispatch = useBridgeParamsDispatch();
    const { data: tokens, isError, isLoading } = useTokenList();
    const { sourceAssetId, sourceNetworkId, targetNetworkId } = useBridgeParams();

    const source = { id: sourceAssetId, chain: sourceNetworkId };
    const sourceId = source.id && source.chain ? (`${source.id}-${+source.chain}` as const) : null;
    const sourceAsset = sourceId && tokens?.fungible.get(sourceId);
    const bridgeable = sourceAsset ? sourceAsset?.bridgeableAssets : null;
    const target = bridgeable?.find(({ chainId }) => chainId === +targetNetworkId);

    useEffect(() => {
        if (!targetNetworkId) {
            dispatch.setRecipient('');
            return;
        }
        const hederaId = hashportClient.hederaSigner.accountId;
        const evmAccount = hashportClient.evmSigner.getAddress();
        const hederaChains = [296, 295];
        dispatch.setRecipient(hederaChains.includes(+targetNetworkId) ? hederaId : evmAccount);
    }, [
        targetNetworkId,
        dispatch,
        hashportClient.evmSigner,
        hashportClient.hederaSigner.accountId,
    ]);

    const handleSetTarget: ChangeEventHandler<HTMLSelectElement> = e => {
        dispatch.setTargetAsset(tokens?.fungible.get(e.target.value as `${string}-${number}`));
    };

    if (isLoading || isError) {
        return <></>;
    } else {
        return (
            <label>
                TargetAsset:
                <select value={target?.assetId ?? ''} onChange={handleSetTarget}>
                    <option value="">Choose a target asset</option>
                    {bridgeable?.map(({ assetId }) => {
                        const token = tokens.fungible.get(assetId);
                        if (!token) return;
                        return (
                            <option key={assetId} value={assetId}>
                                {token.symbol}
                            </option>
                        );
                    })}
                </select>
            </label>
        );
    }
};
