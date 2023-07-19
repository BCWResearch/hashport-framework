import { describe, test, expect } from 'vitest';
import { HashportApiClient } from '../clients/hashportApiClient/index.js';

describe('HashportApiClient', () => {
    test('should fetch results', async () => {
        const client = new HashportApiClient();
        await expect(client.networkAssets(1)).resolves.toBeTypeOf('object');
    });
    test('should throw when signal aborted', async () => {
        const client = new HashportApiClient();
        const controller = new AbortController();
        controller.abort();
        await expect(client.assets().addAbortSignal(controller.signal)).rejects.toThrowError(
            'aborted',
        );
    });
});
