import { HashportContext } from 'contexts/hashportContext';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useBridgeParams } from './useBridgeParams';
import { HashportTransactionData } from '@hashport/sdk';

export const useHashportClient = () => {
    const hashportClient = useContext(HashportContext);
    if (!hashportClient) throw 'useHashportClient must be used within HashportContext';
    return hashportClient;
};

export const useQueue = () => {
    const hashportClient = useHashportClient();
    const [queue, setQueue] = useState<Map<string, HashportTransactionData>>(new Map());

    useEffect(() => {
        // TODO: think about passing in an id to only watch the state of a particulate transaction
        const unsubscribe = hashportClient.subscribe(state => {
            setQueue(state.queue);
        });
        return () => unsubscribe();
    }, [hashportClient]);

    return queue;
};

export const useQueueHashportTransaction = () => {
    const bridgeParams = useBridgeParams();
    const hashportClient = useHashportClient();
    return useCallback(async () => {
        if (Object.values(bridgeParams).some(val => !val)) {
            // TODO: throw some sort of error or return something that explains what went wrong
            // TODO: use parseUnits with decimals to get the actual amount
            console.error('invalid bridge params');
            return;
        }
        return await hashportClient.queueTransaction(bridgeParams);
    }, [bridgeParams, hashportClient]);
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
