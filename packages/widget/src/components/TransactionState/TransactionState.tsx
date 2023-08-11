import { useBridgeParams, useQueue } from '@hashport/react-client';
import { TransactionExplorerLinkAndCopy } from './TransactionExplorerLinkAndCopy';

export const TransactionState = ({ queueId }: { queueId?: string }) => {
    const queue = useQueue();
    const { amount } = useBridgeParams();
    // at some point the queueId will disappear
    // when that happens, we only need to close the collapses

    // components to return:
    // step description w/ spinner (from queue, get current step and map a descriptor to it OR add descriptions to the SDK)
    // block explorer links (from queue.get(id).state (HashportTransactionState), check if there is hederaDepositTransactionId or evmTransactionHash)
    return (
        <>
            <TransactionExplorerLinkAndCopy txIdOrHash={"0x123123"} />
        </>
    );
};
