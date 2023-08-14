import { useHashportTransactionQueue } from '@hashport/react-client';
import { TransactionExplorerLinkAndCopy } from './TransactionExplorerLinkAndCopy';
import { useInProgressHashportId } from 'hooks/inProgressHashportId';

export const TransactionState = () => {
    const [inProgressId] = useInProgressHashportId();
    const transactionQueue = useHashportTransactionQueue();
    const txData = transactionQueue.get(inProgressId);

    return (
        <>
            <TransactionExplorerLinkAndCopy txIdOrHash={txData?.state.hederaDepositTransactionId} />
            <TransactionExplorerLinkAndCopy txIdOrHash={txData?.state.evmTransactionHash} />
        </>
    );
};
