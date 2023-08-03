import { useBridgeParams, useBridgeParamsDispatch } from 'hooks/useBridgeParams';
import { describe, expect, test } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { BridgeParamsProvider } from 'contexts/bridgeParams';

// TODO: Repalce with actual component
const AMOUNT_INPUT_ID = 'AMOUNT_INPUT_ID';
const AmountInput = () => {
    const params = useBridgeParams();
    const { setAmount } = useBridgeParamsDispatch();
    return (
        <input
            data-testid={AMOUNT_INPUT_ID}
            value={params.amount}
            onChange={({ target }) => setAmount({ amount: target.value, decimals: 8 })}
        />
    );
};

describe('useBridgeParams', () => {
    test('should accept only 1 decimal character, and correct decimal places', async () => {
        const user = userEvent.setup();
        render(
            <BridgeParamsProvider>
                <AmountInput />
            </BridgeParamsProvider>,
        );
        const inputElement: HTMLInputElement = await screen.findByTestId(AMOUNT_INPUT_ID);

        await waitFor(() => user.type(inputElement, '100'));
        expect(inputElement.value).toBe('100');
        await waitFor(() => user.type(inputElement, 'abc'));
        expect(inputElement.value).toBe('100');

        await waitFor(() => user.clear(inputElement));
        await waitFor(() => user.type(inputElement, '0'));
        expect(inputElement.value).toBe('0');
        await waitFor(() => user.type(inputElement, '.'));
        expect(inputElement.value).toBe('0.');
        await waitFor(() => user.type(inputElement, '.'));
        expect(inputElement.value).toBe('0.');

        await waitFor(() => user.clear(inputElement));
        await waitFor(() => user.type(inputElement, '00'));
        expect(inputElement.value).toBe('00');
        await user.keyboard('[ArrowLeft][ArrowLeft][Digit1]');
        expect(inputElement.value).toBe('100');
        await user.keyboard('[Backspace][Digit2]');
        expect(inputElement.value).toBe('200');

        await waitFor(() => user.clear(inputElement));
        await waitFor(() => user.type(inputElement, '1.0'));
        expect(inputElement.value).toBe('1.0');

        await waitFor(() => user.clear(inputElement));
        await waitFor(() => user.type(inputElement, '0.00'));
        expect(inputElement.value).toBe('0.00');

        await waitFor(() => user.clear(inputElement));
        await waitFor(() => user.type(inputElement, '0.000000000'));
        expect(inputElement.value).toBe('0.00000000');
    });
});
