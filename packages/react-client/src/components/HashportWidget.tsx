import { useBridgeParams, useBridgeParamsDispatch } from 'hooks/useBridgeParams';
import { useHashportClient, useQueue, useQueueHashportTransaction } from 'hooks/useHashportClient';
import { useTokenList } from 'hooks/useTokenList';
import { ChangeEventHandler, FormEventHandler } from 'react';

export const HashportWidget = () => {
    const hashportClient = useHashportClient();
    const queue = useQueue();
    const queueTransaction = useQueueHashportTransaction();
    const bridgeParams = useBridgeParams();
    const { recipient, sourceAssetId, sourceNetworkId, amount, targetNetworkId } = bridgeParams;
    const { setSourceAsset, setTargetAsset, setAmount, setRecipient, resetBridgeParams } =
        useBridgeParamsDispatch();
    const { data: tokens } = useTokenList();

    const sourceId =
        sourceAssetId && sourceNetworkId
            ? (`${sourceAssetId}-${+sourceNetworkId}` as const)
            : undefined;
    const sourceAsset = sourceId && tokens?.fungible.get(sourceId);
    const bridgeableAssets = sourceId && tokens?.fungible.get(sourceId)?.bridgeableAssets;
    const targetId =
        targetNetworkId &&
        (bridgeableAssets?.find(({ chainId }) => chainId.toString() === targetNetworkId)?.assetId ??
            '');

    const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        queueTransaction?.().then(() => resetBridgeParams());
    };

    const handleRecipient: ChangeEventHandler<HTMLInputElement> = e => {
        setRecipient(e.target.value);
    };

    const handleAmount: ChangeEventHandler<HTMLInputElement> = e => {
        setAmount({
            amount: e.target.value,
            decimals: sourceAsset?.decimals ?? 0,
        });
    };

    const handleSetSource: ChangeEventHandler<HTMLSelectElement> = e => {
        const token = tokens?.fungible.get(e.target.value as `${string}-${number}`);
        if (token) setSourceAsset(token);
    };

    const handleSetTarget: ChangeEventHandler<HTMLSelectElement> = e => {
        const token = tokens?.fungible.get(e.target.value as `${string}-${number}`);
        if (token) setTargetAsset(token);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}
        >
            <label>
                Recipient:
                <input onChange={handleRecipient} value={recipient} />
            </label>
            <label>
                Amount:
                <input onChange={handleAmount} value={amount} />
            </label>
            {tokens && (
                <>
                    <label>
                        Source Asset:
                        <select value={sourceId} onChange={handleSetSource}>
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
                        <select value={targetId} onChange={handleSetTarget}>
                            <option value="">Choose a target asset</option>
                            {bridgeableAssets?.map(({ assetId }) => {
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
                onClick={() => {
                    const id = queue.keys().next().value;
                    hashportClient.execute(id);
                }}
            >
                Execute first transaction
            </button>
            <h3>Bridge Params</h3>
            <pre>{JSON.stringify(bridgeParams, null, 2)}</pre>
            <h3>State</h3>
            <pre>{JSON.stringify(Array.from(queue), null, 2)}</pre>
        </form>
    );
};
