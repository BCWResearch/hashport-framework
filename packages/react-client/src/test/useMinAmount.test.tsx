import { describe, expect, test } from 'vitest';
import { render, screen, waitForElementToBeRemoved } from './test-utils';
import userEvent from '@testing-library/user-event';
import { useMinAmount, useBridgeParamsDispatch } from 'hooks';
import { HBAR_ETH } from '@hashport/sdk/lib/test/mocks/constants';

const MinAmountTest = () => {
    const { setSourceAsset } = useBridgeParamsDispatch();
    const { data } = useMinAmount();
    const handleClick = () => {
        setSourceAsset({
            id: 'HBAR',
            chainId: 295,
            bridgeableAssets: [{ chainId: 1, assetId: `${HBAR_ETH}-${1}` }],
            decimals: 8,
        });
    };
    return (
        <div>
            {data ? <p data-testid="data-result">{data.toString()}</p> : <p>No data</p>}
            <button onClick={handleClick}>Set asset</button>
        </div>
    );
};

describe('useMinAmount', () => {
    test('should only fetch if sourceAssetId and sourceNetworkId are set', async () => {
        const user = userEvent.setup();
        render(<MinAmountTest />);
        const noDataPlaceholderNode = await screen.findByText('No data');
        expect(noDataPlaceholderNode).toBeInTheDocument();
        const btn = await screen.findByText('Set asset');
        user.click(btn);
        await waitForElementToBeRemoved(() => screen.queryByText('No data'));
        // check that the node is gone and that the min amount is there as bigint
        const result = await screen.findByTestId('data-result');
        expect(result).toBeInTheDocument();
        expect(result).toHaveTextContent('11000000000');
    });
});
