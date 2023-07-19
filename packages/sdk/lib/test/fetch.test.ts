import { describe, test, expect } from 'vitest';
import { Fetcher } from '../utils/fetch.js';

describe('Fetcher', () => {
    test('should be a function', () => {
        expect(Fetcher).toBeTypeOf('function');
    });
    test('should throw when signal aborted', async () => {
        const controller = new AbortController();
        controller.abort();
        await expect(
            new Fetcher('https://jsonplaceholder.typicode.com/todos/1').addAbortSignal(
                controller.signal,
            ),
        ).rejects.toThrowError('aborted');
    });
});
