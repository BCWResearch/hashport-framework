import { HBAR, HBAR_ETH } from '@hashport/sdk/lib/test/mocks/constants';
import { useBridgeParamsDispatch, useQueue, useQueueHashportTransaction } from 'hooks';
import { useState } from 'react';
import { describe, expect, test } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, waitForElementToBeRemoved } from './test-utils';

const QUEUE_BUTTON = 'QUEUE_BUTTON';
const QUEUE_BUTTON_PLACEHOLDER = 'QUEUE_BUTTON_PLACEHOLDER';
const ID_NODE = 'ID_NODE';
const ID_NODE_PLACEHOLDER = 'ID_NODE_PLACEHOLDER';
const BUTTON_ID = 'BUTTON_ID';
const INPUT_ID = 'INPUT_ID';

const TestComponent = () => {
    const [savedId, setSavedId] = useState<string>('');
    const dispatch = useBridgeParamsDispatch();
    const queueTransaction = useQueueHashportTransaction();
    const queue = useQueue();
    const queuedAmount = queue.get(savedId)?.params.amount;

    const handleClick = () => {
        dispatch.setRecipient('0x0000000000000000000000000000000000000000');
        dispatch.setSourceAsset({
            id: HBAR,
            chainId: 295,
            bridgeableAssets: [{ chainId: 1, assetId: `${HBAR_ETH}-${1}` }],
            decimals: 8,
        });
        dispatch.setTargetAsset({
            id: HBAR_ETH,
            chainId: 1,
            bridgeableAssets: [{ chainId: 295, assetId: `${HBAR}-${295}` }],
            decimals: 8,
        });
    };

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        dispatch.setAmount({
            amount: e.target.value,
            sourceAssetDecimals: 8,
            targetAssetDecimals: 8,
        });
    };

    return (
        <>
            {queueTransaction ? (
                <button
                    data-testid={QUEUE_BUTTON}
                    onClick={async () => {
                        const id = await queueTransaction();
                        console.log(id);
                        setSavedId(id);
                    }}
                >
                    Queue
                </button>
            ) : (
                <p data-testid={QUEUE_BUTTON_PLACEHOLDER}>Placeholder</p>
            )}
            <button data-testid={BUTTON_ID} onClick={handleClick}>
                Set Params
            </button>
            <input data-testid={INPUT_ID} onChange={handleChange} />
            {queuedAmount ? (
                <p data-testid={ID_NODE}>{queuedAmount}</p>
            ) : (
                <p data-testid={ID_NODE_PLACEHOLDER}>Placeholder</p>
            )}
        </>
    );
};

describe('useQueueHashportTransaction', () => {
    test('Parses decimals correctly when queuing', async () => {
        const user = userEvent.setup();
        render(<TestComponent />);
        const btn = await screen.findByTestId(BUTTON_ID);
        await waitFor(() => user.click(btn));
        const input = await screen.findByTestId(INPUT_ID);
        await waitFor(() => user.type(input, '900.1'));
        const queueBtn = await screen.findByTestId(QUEUE_BUTTON);
        user.click(queueBtn);
        await waitForElementToBeRemoved(() => screen.queryByTestId(ID_NODE_PLACEHOLDER));
        const resultNode = await screen.findByTestId(ID_NODE);
        expect(resultNode.innerHTML).toBe('90010000000');
    });
});
