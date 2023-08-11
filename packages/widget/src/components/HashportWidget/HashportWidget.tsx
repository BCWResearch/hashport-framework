import { useBridgeParams, useBridgeParamsDispatch } from '@hashport/react-client';
import { useQueue, useQueueHashportTransaction } from '@hashport/react-client';
import { FormEventHandler } from 'react';
import { AmountInput } from './AmountInput';
import { MinAmount } from './MinAmount';
import { ThemeProvider } from 'theme';
import { Container } from 'components/styled/Container';
import { ReceivedAmount } from './ReceivedAmount';
import { Slider } from 'components/styled/Slider';

const WidgetContainer = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useBridgeParamsDispatch();
    const queueTransaction = useQueueHashportTransaction();
    const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        queueTransaction?.().then(() => dispatch.resetBridgeParams());
    };

    return (
        <Container>
            <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}
            >
                {children}
            </form>
        </Container>
    );
};

const QueueTransactionButton = () => {
    const queueTransaction = useQueueHashportTransaction();
    return (
        <button type="submit" disabled={!queueTransaction}>
            Queue transaction
        </button>
    );
};

const BridgeParamsViewer = () => {
    const bridgeParams = useBridgeParams();
    return (
        <>
            <h3>Bridge Params</h3>
            <pre>{JSON.stringify(bridgeParams, null, 2)}</pre>
        </>
    );
};

const TransactionStateViewer = () => {
    const queue = useQueue();
    return (
        <>
            <h3>State</h3>
            <pre>{JSON.stringify(Array.from(queue), null, 2)}</pre>
        </>
    );
};

export const HashportWidget = () => {
    return (
        <ThemeProvider>
            <WidgetContainer>
                <AmountInput />
                <ReceivedAmount />
                <MinAmount />
                <Slider disabled={false} onConfirm={() => console.log('confirmed')} />
            </WidgetContainer>
            <BridgeParamsViewer />
            <TransactionStateViewer />
        </ThemeProvider>
    );
};
