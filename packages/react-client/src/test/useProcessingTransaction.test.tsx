import { describe, expect, test } from 'vitest';
import { render, screen, waitForElementToBeRemoved } from './test-utils';
import userEvent from '@testing-library/user-event';
import {
    useProcessingTransaction,
    useHashportClient,
    useProcessingTransactionDispatch,
} from 'hooks';
import { bridgeParamsMock } from '@hashport/sdk/lib/test/mockData/api/bridge';

const ProcessingTransacitonTest = () => {
    const hashportClient = useHashportClient();
    const { status, confirmation } = useProcessingTransaction();
    const { confirmCompletion, executeTransaction } = useProcessingTransactionDispatch();

    const handleExecute = async () => {
        const id = await hashportClient.queueTransaction(bridgeParamsMock.mint);
        await executeTransaction(id);
    };

    return (
        <div>
            <button onClick={handleExecute}>Execute</button>
            {status === 'idle' && <p>Not processing</p>}
            <p data-testid="status">{status}</p>
            {confirmation ? (
                <button onClick={confirmCompletion}>Confirm</button>
            ) : (
                <p>No confirmation</p>
            )}
        </div>
    );
};

describe('useProcessingTransaction', () => {
    test('should handle tx status correctly before, during, and after tx', async () => {
        const user = userEvent.setup();
        render(<ProcessingTransacitonTest />);
        const status = await screen.findByTestId('status');
        expect(status).toHaveTextContent('idle');
        const btn = await screen.findByText('Execute');
        user.click(btn);
        await waitForElementToBeRemoved(() => screen.queryByText('Not processing'));
        expect(status).toHaveTextContent('processing');
        await waitForElementToBeRemoved(() => screen.queryByText('No confirmation'));
        expect(status).toHaveTextContent('complete');
        const confirmBtn = await screen.findByText('Confirm');
        user.click(confirmBtn);
        await waitForElementToBeRemoved(() => screen.queryByText('Confirm'));
        expect(status).toHaveTextContent('idle');
    });
});
