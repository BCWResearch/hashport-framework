import { useBridgeParamsDispatch } from 'hooks';
import { useSelectedTokens } from 'hooks/useSelectedTokens';
import { AssetInfo } from 'types';
import { describe } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from './test-utils';

const HBAR: AssetInfo = {
    chainId: 295,
    id: 'HBAR',
    name: 'HBAR',
    symbol: 'HBAR',
    isNative: true,
    decimals: 8,
    handleSelect: () => null,
    bridgeableAssets: [
        { assetId: `${'0x14ab470682Bc045336B1df6262d538cB6c35eA2A'}-${1}`, chainId: 1 },
    ],
    icon: 'https://cdn.hashport.network/HBAR.svg',
};

const HBAR_ETH: AssetInfo = {
    chainId: 1,
    id: '0x14ab470682Bc045336B1df6262d538cB6c35eA2A',
    name: 'HBAR[eth]',
    symbol: 'HBAR[eth]',
    isNative: false,
    decimals: 8,
    handleSelect: () => null,
    bridgeableAssets: [{ assetId: `${'HBAR'}-${295}`, chainId: 1 }],
    icon: 'https://cdn.hashport.network/HBAR.svg',
};

const SelectToken = () => {
    const { setSourceAsset, setTargetAsset } = useBridgeParamsDispatch();
    const { sourceAsset, targetAsset } = useSelectedTokens();

    return (
        <div>
            {sourceAsset ? <p data-testid="source">{sourceAsset.symbol}</p> : <p>No source</p>}
            {targetAsset ? <p data-testid="target">{targetAsset.symbol}</p> : <p>No target</p>}
            <button onClick={() => setSourceAsset(HBAR)}>Select source</button>
            <button onClick={() => setTargetAsset(HBAR_ETH)}>Select target</button>
        </div>
    );
};

describe('useSelectedToken', () => {
    test('should display correct values for source and target', async () => {
        const user = userEvent.setup();
        render(<SelectToken />);

        const selectSourceBtn: HTMLButtonElement = await screen.findByText('Select source');
        user.click(selectSourceBtn);
        const sourceDisplay = await screen.findByTestId('source');
        expect(sourceDisplay).toBeInTheDocument();
        expect(sourceDisplay).toHaveTextContent('HBAR');

        const selectTargetBtn: HTMLButtonElement = await screen.findByText('Select target');
        user.click(selectTargetBtn);
        const targetDisplay = await screen.findByTestId('target');
        expect(targetDisplay).toBeInTheDocument();
        expect(targetDisplay).toHaveTextContent('HBAR[eth]');
    });
});
