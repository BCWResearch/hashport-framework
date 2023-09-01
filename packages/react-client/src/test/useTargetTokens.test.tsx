import { useBridgeParamsDispatch, useTokenList } from 'hooks';
import { describe, test } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, waitForElementToBeRemoved } from './test-utils';
import { useTargetTokens } from 'hooks/useTargetTokens';

const TargetTokens = () => {
    const { setSourceAsset } = useBridgeParamsDispatch();
    const targetTokens = useTargetTokens();
    const { data: tokens } = useTokenList({
        onSelect(token) {
            setSourceAsset(token);
        },
    });

    return (
        <div>
            {tokens ? (
                <div data-testid="tokens">
                    {Array.from(tokens.fungible.values()).map(token => (
                        <button key={token.id} onClick={token.handleSelect}>
                            {token.symbol}-{token.chainId}
                        </button>
                    ))}
                </div>
            ) : (
                <p>No tokens</p>
            )}
            {targetTokens ? (
                <div data-testid="target-tokens">
                    {targetTokens?.map(({ id, symbol }) => (
                        <p key={id}>{symbol}</p>
                    ))}
                </div>
            ) : (
                <p>No target tokens</p>
            )}
        </div>
    );
};

describe('useTargetTokens', () => {
    test('should display correct bridgeable tokens after selecting source', async () => {
        const user = userEvent.setup();
        render(<TargetTokens />);
        await waitForElementToBeRemoved(() => screen.queryByText('No tokens'));

        const hbarEthBtn: HTMLButtonElement = await screen.findByText('HBAR[eth]-1');
        await waitFor(() => user.click(hbarEthBtn));
        const targetTokens = await screen.findByTestId('target-tokens');
        expect(targetTokens).toHaveTextContent('HBAR');

        const hbarBtn: HTMLButtonElement = await screen.findByText('HBAR-295');
        await waitFor(() => user.click(hbarBtn));
        const targetTokens2 = await screen.findByTestId('target-tokens');
        expect(targetTokens2).toHaveTextContent('HBAR[eth]');
    });
});
