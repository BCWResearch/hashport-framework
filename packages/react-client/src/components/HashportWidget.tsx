import { HashportTransactionState } from '@hashport/sdk/lib/types';
import { useBridgeParams, useBridgeParamsDispatch } from 'hooks/useBridgeParams';
import { useHashportClient, useQueue, useQueueHashportTransaction } from 'hooks/useHashportClient';
import { useTokenList } from 'hooks/useTokenList';
import { ChangeEventHandler, FormEventHandler, useEffect, useState } from 'react';

export const HashportWidget = () => {
    const hashportClient = useHashportClient();
    const queue = useQueue();
    const queueTransaction = useQueueHashportTransaction();
    const dispatch = useBridgeParamsDispatch();
    const { data: tokens } = useTokenList();
    const bridgeParams = useBridgeParams();

    const [isPorting, setIsPorting] = useState(false);
    const [transactionResult, setTransactionResult] = useState<
        HashportTransactionState | { error: string }
    >();

    const { sourceAssetId, sourceNetworkId, amount, targetNetworkId } = bridgeParams;
    const source = { id: sourceAssetId, chain: sourceNetworkId };
    const sourceId = source.id && source.chain ? (`${source.id}-${+source.chain}` as const) : null;
    const sourceAsset = sourceId && tokens?.fungible.get(sourceId);
    const bridgeable = sourceAsset ? sourceAsset?.bridgeableAssets : null;
    const target = bridgeable?.find(({ chainId }) => chainId === +targetNetworkId);
    const targetAsset = target && tokens?.fungible.get(target.assetId);

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

    const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        queueTransaction?.().then(() => dispatch.resetBridgeParams());
    };

    const handleAmount: ChangeEventHandler<HTMLInputElement> = e => {
        dispatch.setAmount({
            amount: e.target.value,
            sourceAssetDecimals: sourceAsset?.decimals,
            targetAssetDecimals: targetAsset?.decimals,
        });
    };

    const handleSetSource: ChangeEventHandler<HTMLSelectElement> = e => {
        dispatch.setSourceAsset(tokens?.fungible.get(e.target.value as `${string}-${number}`));
    };

    const handleSetTarget: ChangeEventHandler<HTMLSelectElement> = e => {
        dispatch.setTargetAsset(tokens?.fungible.get(e.target.value as `${string}-${number}`));
    };

    const handleExecuteTransaction = async () => {
        try {
            setIsPorting(true);
            setTransactionResult(undefined);
            const id = queue.keys().next().value;
            const result = await hashportClient.execute(id);
            setTransactionResult(result);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                setTransactionResult({ error: error.message });
            }
        } finally {
            setIsPorting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}
        >
            <label>
                Amount:
                <input onChange={handleAmount} value={amount} />
            </label>
            {tokens && (
                <>
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
                </>
            )}
            <button type="submit" disabled={!queueTransaction}>
                Queue transaction
            </button>
            <button
                type="button"
                disabled={queue.size < 1 || isPorting}
                onClick={handleExecuteTransaction}
            >
                Execute first transaction
            </button>
            {transactionResult && <pre>{JSON.stringify(transactionResult, null, 2)}</pre>}
            <h3>Bridge Params</h3>
            <pre>{JSON.stringify(bridgeParams, null, 2)}</pre>
            <h3>State</h3>
            <pre>{JSON.stringify(Array.from(queue), null, 2)}</pre>
        </form>
    );
};
