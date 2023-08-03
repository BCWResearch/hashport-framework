import { HashportClientContext } from 'contexts/hashportClient';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useBridgeParams } from './useBridgeParams';
import { HashportTransactionData } from '@hashport/sdk';
import { useTokenList } from './useTokenList';
import { parseUnits } from 'viem';

export const useHashportClient = () => {
    const hashportClient = useContext(HashportClientContext);
    if (!hashportClient) throw 'useHashportClient must be used within HashportContext';
    return hashportClient;
};

// TODO: think about passing in an id to only watch the state of a particulate transaction
export const useQueue = () => {
    const hashportClient = useHashportClient();
    // TODO: expose transaactionStore as zustand store in SDK for easier monitoring
    const [queue, setQueue] = useState<Map<string, HashportTransactionData>>(
        hashportClient.transactionStore.queue,
    );

    useEffect(() => {
        const unsubscribe = hashportClient.subscribe(state => {
            setQueue(state.queue);
        });
        return () => unsubscribe();
    }, [hashportClient]);

    return queue;
};

export const useQueueHashportTransaction = () => {
    const hashportClient = useHashportClient();
    const { data: tokens } = useTokenList();
    const bridgeParams = useBridgeParams();

    const isValidBridgeParams = Object.values(bridgeParams).every(val => Boolean(val));
    const tokenId = `${bridgeParams.sourceAssetId}-${+bridgeParams.sourceNetworkId}` as const;
    const selectedToken = tokens?.fungible.get(tokenId) ?? tokens?.nonfungible.get(tokenId);

    const queueHashportTransaction = useCallback(async () => {
        if (!isValidBridgeParams || !tokens || !selectedToken) {
            throw 'Failed to queue. Missing bridge params';
        }
        if (selectedToken.decimals && bridgeParams.amount) {
            // Fungible transaction
            const amount = parseUnits(bridgeParams.amount, selectedToken.decimals).toString();
            return await hashportClient.queueTransaction({ ...bridgeParams, amount });
        } else {
            // Nonfungible transaction
            return await hashportClient.queueTransaction(bridgeParams);
        }
    }, [bridgeParams, hashportClient, tokens, isValidBridgeParams, selectedToken]);

    if (!isValidBridgeParams || !tokens || !selectedToken) return;
    return queueHashportTransaction;
};

export const useExecuteHashportTransaction = () => {
    const hashportClient = useHashportClient();
    return useCallback(
        async (id: string) => {
            return await hashportClient.execute(id);
        },
        [hashportClient],
    );
};
