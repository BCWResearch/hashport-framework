import { assets } from '../../../sdk/lib/test/mockData/api/assets';
import { describe, expect, test } from 'vitest';
import { formatAssets } from '../hooks/useTokenList';

describe('useTokenList', () => {
    test('should have correct number of assets', () => {
        const totalFungible = assets.reduce((acc, curr) => {
            return acc + Object.values(curr.assets).filter(({ decimals }) => !!decimals).length;
        }, 0);
        const totalNonfungible = assets.reduce((acc, curr) => {
            return acc + Object.values(curr.assets).filter(({ decimals }) => !decimals).length;
        }, 0);
        const formattedAssets = formatAssets(assets);
        expect(totalFungible).toEqual(formattedAssets.fungible.size);
        expect(totalNonfungible).toEqual(formattedAssets.nonfungible.size);
    });
});
