import { describe, test, expect } from 'vitest';
import { bridgeParamsMock } from '@hashport/sdk/lib/test/mockData/api/bridge';
import { useHashportClient } from 'hooks/useHashportClient';
import { useState } from 'react';
import { render, screen, waitForElementToBeRemoved } from './test-utils';
import userEvent from '@testing-library/user-event';

const BUTTON_ID = 'button';
const PRE_TAG = 'pre_tag';
const LOADING = 'loading';

const TestComponent = () => {
    const hashportClient = useHashportClient();
    const [isLoading, setIsLoading] = useState(false);
    const [res, setRes] = useState('');

    const handleClick = async () => {
        try {
            setIsLoading(true);
            const id = await hashportClient.queueTransaction(bridgeParamsMock.mint);
            setRes(id);
        } catch (error) {
            console.error(error);
            setRes('failed');
        } finally {
            setIsLoading(false);
        }
    };

    return isLoading ? (
        <div data-testid={LOADING}>Loading</div>
    ) : (
        <>
            <button data-testid={BUTTON_ID} onClick={handleClick}>
                Queue Params
            </button>
            <pre data-testid={PRE_TAG}>{res}</pre>
        </>
    );
};

describe('useHashportClient', () => {
    test('should fail', async () => {
        const user = userEvent.setup();
        render(<TestComponent />);
        const btn = await screen.findByTestId(BUTTON_ID);
        user.click(btn);
        await waitForElementToBeRemoved(() => screen.queryByTestId(BUTTON_ID));
        const preTag = await screen.findByTestId(PRE_TAG);
        expect(preTag.innerHTML).to.match(/^(?:[a-fA-F0-9]+-){4}[a-fA-F0-9]+$/);
    });
});
