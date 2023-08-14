import { useExecuteHashportTransaction, useQueueHashportTransaction } from '@hashport/react-client';
import { Slider } from 'components/styled/Slider';
import { useState } from 'react';
import { TransactionState } from '../TransactionState/TransactionState';
import { Collapse } from 'components/styled/Collapse';

export const ConfirmationSlider = () => {
    const queueTransaction = useQueueHashportTransaction();
    const execute = useExecuteHashportTransaction();
    const [isExecuting, setIsExecuting] = useState(false);
    const [inProgressId, setInProgressId] = useState('');
    // TODO: if isExecuting, don't let them leave page

    const isDisabled = !queueTransaction || isExecuting;

    const handleConfirm = async () => {
        if (!queueTransaction) return;
        try {
            setIsExecuting(true);
            const id = await queueTransaction();
            setInProgressId(id);
            const confirmation = await execute(id);
            // after confirmation, take the confirmation hash and pass it to a component below?
            // that component should give the user a change to save the info as a receipt
            // reset inProgressId? or in useEffect?
        } catch (error) {
            console.error(error);
            // TODO: handle error and pass to try again button
        } finally {
            setIsExecuting(false);
        }
    };
    return (
        <div>
            <Collapse in={!inProgressId}>
                <Slider disabled={isDisabled} onConfirm={handleConfirm} />
            </Collapse>
            {/* TODO: retry button */}
            <TransactionState inProgressId={inProgressId} />
        </div>
    );
};

// TODO: recreate the block confirms progress?
