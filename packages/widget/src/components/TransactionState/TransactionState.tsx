import { useProcessingTransaction } from '@hashport/react-client';
import { TransactionExplorerLinkAndCopy } from './TransactionExplorerLinkAndCopy';

export const TransactionState = () => {
    const { currentTransaction } = useProcessingTransaction();
    const currentState = currentTransaction?.state;
    return (
        <>
            <TransactionExplorerLinkAndCopy txIdOrHash={currentState?.hederaDepositTransactionId} />
            <TransactionExplorerLinkAndCopy txIdOrHash={currentState?.evmTransactionHash} />
        </>
    );
};
