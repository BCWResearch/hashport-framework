import { useExecuteHashportTransaction, useQueueHashportTransaction } from '@hashport/react-client';
import { Slider } from 'components/styled/Slider';
import { useState } from 'react';
import { TransactionState } from '../TransactionState/TransactionState';

export const ConfirmationSlider = () => {
    const queueTransaction = useQueueHashportTransaction();
    const execute = useExecuteHashportTransaction();
    const [isExecuting, setIsExecuting] = useState(false);
    // TODO: if isExecuting, don't let them leave page

    const isDisabled = !queueTransaction || isExecuting;

    const handleConfirm = async () => {
        if (!queueTransaction) return;
        // queue the transaction
        // while queuing, disable
        try {
            setIsExecuting(true);
            const id = await queueTransaction();
            // then execute
            const confirmation = await execute(id);
            // while executing, collapse the slider and set some state about the transaction so we can disable
            // the inputs and/or collapse them
            // by saving this id, we can then use it to fetch more information about the current transaction
        } catch (error) {
            console.error(error);
        } finally {
            setIsExecuting(false);
        }
    };
    return (
        <>
            <Slider disabled={isDisabled} onConfirm={handleConfirm} />
            <TransactionState queueId={''} />
        </>
    );
};

// TODO: recreate the block confirms progress?
