import { useHashportClient } from '@hashport/react-client';
import { TransactionExplorerLinkAndCopy } from './TransactionExplorerLinkAndCopy';
import { useEffect, useState } from 'react';
import { HashportTransactionData } from '@hashport/sdk';
import { StepDescription } from './StepDescription';

export const TransactionState = ({ inProgressId }: { inProgressId: string }) => {
    const hashportClient = useHashportClient();
    const [txData, setTxData] = useState<HashportTransactionData | undefined>(
        hashportClient.transactionStore.queue.get(inProgressId),
    );

    useEffect(() => {
        setTxData(hashportClient.transactionStore.queue.get(inProgressId));
        const unsubscribe = hashportClient.subscribe(state => {
            const newData = state.queue.get(inProgressId);
            setTxData(newData ? { ...newData } : undefined);
        });
        return unsubscribe;
    }, [hashportClient, inProgressId]);

    return (
        <>
            {/* TODO: use proper step description */}
            <StepDescription description={txData?.steps?.[0].type} />
            <TransactionExplorerLinkAndCopy txIdOrHash={txData?.state.hederaDepositTransactionId} />
            <TransactionExplorerLinkAndCopy txIdOrHash={txData?.state.evmTransactionHash} />
        </>
    );
};
