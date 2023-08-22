import {
    useProcessingTransaction,
    useProcessingTransactionDispatch,
    useQueueHashportTransaction,
} from '@hashport/react-client';
import { Slider } from 'components/styled/Slider';
import { TransactionState } from '../TransactionState/TransactionState';
import { Collapse } from 'components/styled/Collapse';
import { TermsAndPolicy } from './TermsAndPolicy';
import { TryAgainButton } from './TryAgainButton';
import { StepDescription } from 'components/TransactionState/StepDescription';
import { AfterPortActions } from './AfterPortActions';
import { usePreflightCheck } from '@hashport/react-client';

export const ConfirmationSlider = () => {
    const queueTransaction = useQueueHashportTransaction();
    const { status, id } = useProcessingTransaction();
    const { executeTransaction } = useProcessingTransactionDispatch();
    const { isValidParams, message } = usePreflightCheck();
    // TODO: if isExecuting, don't let them leave page

    const isDisabled = !queueTransaction || status !== 'idle' || !isValidParams;

    const handleConfirm = async () => {
        if (!queueTransaction) return;
        try {
            if (!id) {
                const queuedId = await queueTransaction();
                await executeTransaction(queuedId);
            } else {
                await executeTransaction(id);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <Collapse in={status === 'idle'}>
                <Slider disabled={isDisabled} onConfirm={handleConfirm} prompt={message} />
                <TermsAndPolicy />
            </Collapse>
            <Collapse in={status === 'error'}>
                <TryAgainButton onClick={handleConfirm} />
            </Collapse>
            <StepDescription />
            <TransactionState />
            <AfterPortActions />
        </div>
    );
};
