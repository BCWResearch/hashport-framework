import { HashportTransactionState } from '@hashport/sdk/lib/types';
import { useHashportClient, useQueue } from '@hashport/react-client';
import { useState } from 'react';

export const ExecuteTransactionButton = () => {
    const hashportClient = useHashportClient();
    const queue = useQueue();
    const [isPorting, setIsPorting] = useState(false);
    const [transactionResult, setTransactionResult] = useState<
        HashportTransactionState | { error: string }
    >();

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
        <>
            <button
                type="button"
                disabled={queue.size < 1 || isPorting}
                onClick={handleExecuteTransaction}
            >
                Execute first transaction
            </button>
            {transactionResult && <pre>{JSON.stringify(transactionResult, null, 2)}</pre>}
        </>
    );
};
