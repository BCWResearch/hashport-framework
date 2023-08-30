import { useBlockConfirmations } from 'hooks/useBlockConfirmations';
import { describe, expect, test } from 'vitest';
import { renderHook, waitFor } from './test-utils';

describe('useBlockConfirmations', () => {
    test.each<[number, number]>([
        [1, 6],
        [137, 150],
        [0, 5],
    ])('%i should return correct block confirmations', async (chain, expected) => {
        const { result } = renderHook(() => useBlockConfirmations(chain));
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toBe(expected);
    });
});
