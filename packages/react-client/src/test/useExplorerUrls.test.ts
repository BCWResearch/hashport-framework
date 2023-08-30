import { useExplorerUrls } from 'hooks/useExplorerUrls';
import { describe, expect, test } from 'vitest';
import { renderHook, waitFor } from './test-utils';

describe('useExplorerUrls', () => {
    test('should return mapping of chainId to URL', async () => {
        const { result } = renderHook(() => useExplorerUrls());
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        const explorerEntries = Object.entries(result.current.data);
        const areValidUrls = explorerEntries.every(
            ([chain, url]) =>
                !isNaN(parseInt(chain)) && typeof url === 'string' && url.includes('https'),
        );
        expect(areValidUrls).toBe(true);
    });
});
