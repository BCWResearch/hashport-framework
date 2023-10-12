import { useProcessingTransaction } from '@hashport/react-client';

export const TransactionStatus = () => {
    const processingTx = useProcessingTransaction();

    return (
        <p>
            Transaction Status: <span className="status-text">{processingTx.status}</span>
        </p>
    );
};
