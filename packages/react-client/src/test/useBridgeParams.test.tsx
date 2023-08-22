import { useBridgeParams, useBridgeParamsDispatch } from 'hooks/useBridgeParams';
import { describe, expect, test } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from './test-utils';

const AMOUNT_INPUT_ID = 'AMOUNT_INPUT_ID';
const AmountInput = () => {
    const params = useBridgeParams();
    const { setAmount } = useBridgeParamsDispatch();
    return (
        <input
            data-testid={AMOUNT_INPUT_ID}
            value={params.amount}
            onChange={({ target }) =>
                setAmount({ amount: target.value, sourceAssetDecimals: 8, targetAssetDecimals: 8 })
            }
        />
    );
};

const NO_SELECTED_TOKEN_AMOUNT = 'NO_SELECTED_TOKEN_AMOUNT';
const NoSelectedTokenAmountInput = () => {
    const params = useBridgeParams();
    const { setAmount } = useBridgeParamsDispatch();
    return (
        <input
            data-testid={NO_SELECTED_TOKEN_AMOUNT}
            value={params.amount}
            onChange={({ target }) =>
                setAmount({
                    amount: target.value,
                    sourceAssetDecimals: undefined,
                    targetAssetDecimals: undefined,
                })
            }
        />
    );
};

describe('useBridgeParams', () => {
    test('should accept only 1 decimal character, and correct decimal places', async () => {
        const user = userEvent.setup();
        render(<AmountInput />);
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
        await waitFor(() => user.keyboard('[ArrowLeft][ArrowLeft][Digit1]'));
        expect(inputElement.value).toBe('100');
        await waitFor(() => user.keyboard('[Backspace][Digit2]'));
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

    test('should allow a max of 6 decimals if token not selected', async () => {
        const user = userEvent.setup();
        render(<NoSelectedTokenAmountInput />);
        const inputElement: HTMLInputElement = await screen.findByTestId(NO_SELECTED_TOKEN_AMOUNT);
        await waitFor(() => user.type(inputElement, '1.1234567'));
        expect(inputElement.value).toBe('1.123456');
    });
});
