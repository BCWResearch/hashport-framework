import {
    useBridgeParamsDispatch,
    useProcessingTransaction,
    useProcessingTransactionDispatch,
    useQueueHashportTransaction,
} from '@hashport/react-client';

export const ExecuteButton = () => {
    const { resetBridgeParams } = useBridgeParamsDispatch();
    const queueTransaction = useQueueHashportTransaction();
    const { executeTransaction, confirmCompletion } = useProcessingTransactionDispatch();
    const processingTx = useProcessingTransaction();

    const handleExecute = async () => {
        if (!queueTransaction) return;
        if (processingTx.status === 'complete') {
            confirmCompletion();
            resetBridgeParams();
            return;
        }
        try {
            if (processingTx.id) {
                await executeTransaction(processingTx.id);
            } else {
                const id = await queueTransaction();
                await executeTransaction(id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <button
            disabled={!queueTransaction || processingTx.status === 'processing'}
            onClick={handleExecute}
        >
            {processingTx.status === 'processing'
                ? 'In progress...'
                : processingTx.status === 'complete'
                ? 'Confirm'
                : 'Execute'}
        </button>
    );
};
