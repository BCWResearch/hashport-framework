import {
    useBridgeParams,
    useProcessingTransaction,
    useProcessingTransactionDispatch,
    useQueueHashportTransaction,
} from '@hashport/react-client';
import { Slider } from 'components/styled/Slider';
import { TransactionState } from '../TransactionState/TransactionState';
import { Collapse } from 'components/styled/Collapse';
import { TermsAndPolicy } from './TermsAndPolicy';
import { TryAgainButton } from '../TransactionState/TryAgainButton';
import { StepDescription } from 'components/TransactionState/StepDescription';
import { AfterPortActions } from '../TransactionState/AfterPortActions';
import { usePreflightCheck } from '@hashport/react-client';
import { NetworkSwitchButton } from '../Header/NetworkSwitchButton';
import { useChainId } from 'wagmi';

export const ConfirmationSlider = () => {
    const queueTransaction = useQueueHashportTransaction();
    const { status, id } = useProcessingTransaction();
    const { executeTransaction } = useProcessingTransactionDispatch();
    const { isValidParams, message } = usePreflightCheck();
    const chainId = useChainId();
    const { sourceNetworkId, targetNetworkId } = useBridgeParams();
    const isWrongNetwork =
        sourceNetworkId &&
        targetNetworkId &&
        +sourceNetworkId !== chainId &&
        +targetNetworkId !== chainId;
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
                {isWrongNetwork ? (
                    <NetworkSwitchButton />
                ) : (
                    <Slider disabled={isDisabled} onConfirm={handleConfirm} prompt={message} />
                )}
                <TermsAndPolicy />
            </Collapse>
            <Collapse in={status === 'error'}>
                <TryAgainButton />
            </Collapse>
            <StepDescription />
            <TransactionState />
            <AfterPortActions />
        </div>
    );
};
