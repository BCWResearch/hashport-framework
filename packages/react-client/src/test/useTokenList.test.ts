import { assets } from '../../../sdk/lib/test/mockData/api/assets';
import { describe, expect, test } from 'vitest';
import { formatAssets } from '../hooks/useTokenList';

describe('useTokenList', () => {
    test('should have no undefined properties', () => {
        const formattedAssets = formatAssets(assets);
        const isValid = Array.from(formattedAssets.fungible).every(([_, assetInfo]) => {
            const { chainId, bridgeableAssets, icon, decimals, id, isNative, name, symbol } =
                assetInfo;
            const hasWrapped = Object.entries(bridgeableAssets ?? {}).length > 0;
            return Boolean(
                chainId ?? hasWrapped ?? icon ?? decimals ?? id ?? isNative ?? name ?? symbol,
            );
        });
        expect(isValid).toBe(true);
    });
});
