import { useExecuteHashportTransaction, useQueueHashportTransaction } from '@hashport/react-client';
import { Slider } from 'components/styled/Slider';
import { useEffect, useState } from 'react';
import { TransactionState } from '../TransactionState/TransactionState';
import { Collapse } from 'components/styled/Collapse';
import { TermsAndPolicy } from './TermsAndPolicy';
import { useInProgressHashportId } from 'hooks/inProgressHashportId';
import { TryAgainButton } from './TryAgainButton';
import { HashportError, HashportTransactionData } from '@hashport/sdk';
import { StepDescription } from 'components/TransactionState/StepDescription';
import { AfterPortActions } from './AfterPortActions';
import { usePreflightCheck } from '@hashport/react-client';

export const ConfirmationSlider = () => {
    const queueTransaction = useQueueHashportTransaction();
    const execute = useExecuteHashportTransaction();
    const { isValidParams, message } = usePreflightCheck();
    const [isExecuting, setIsExecuting] = useState(false);
    const [inProgressId, setInProgressId] = useInProgressHashportId();
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmationData, setConfirmationData] = useState<HashportTransactionData['state']>();
    // TODO: if isExecuting, don't let them leave page

    const isDisabled = !queueTransaction || isExecuting || !isValidParams;

    useEffect(() => {
        // Handles reset in after port actions
        setConfirmationData(prev => (inProgressId ? prev : undefined));
    }, [inProgressId]);

    const handleConfirm = async () => {
        if (!queueTransaction) return;
        try {
            setErrorMessage('');
            setIsExecuting(true);
            let id: string;
            if (inProgressId) {
                id = inProgressId;
            } else {
                id = await queueTransaction();
                setInProgressId(id);
            }
            const confirmation = await execute(id);
            setConfirmationData(confirmation);
        } catch (e) {
            setErrorMessage(
                e instanceof HashportError ? e.message : 'Something went wrong. Please try again',
            );
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div>
            <Collapse in={!inProgressId}>
                <Slider disabled={isDisabled} onConfirm={handleConfirm} prompt={message} />
                <TermsAndPolicy />
            </Collapse>
            <Collapse in={Boolean(errorMessage)}>
                <TryAgainButton onClick={handleConfirm} />
            </Collapse>
            {!errorMessage && <StepDescription />}
            <TransactionState />
            <AfterPortActions confirmationData={confirmationData} />
        </div>
    );
};

// TODO: recreate the block confirms progress?
