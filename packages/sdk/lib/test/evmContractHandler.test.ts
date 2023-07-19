import { describe, test, expect, vi } from 'vitest';
import { MOCK_HASHES, mockEvmSigner } from './mocks/mockSigners.js';
import { EvmContractHandler } from '../clients/hashportClient/helpers/evmContractHandler.js';
import { bridgeParamsMock, bridgeSteps } from './mockData/api/bridge.js';
import { USDC } from './mocks/constants.js';
import { createHashportStore } from '../clients/hashportClient/helpers/hashportTransactionStore.js';
import { createCacheStorage } from './mocks/cacheStorage.js';
import { EvmBridgeStep } from '../types/api/bridge.js';

describe('EVM Contract Handler', () => {
    test('should not submit transaction if one has already been submitted', async () => {
        const hashportStore = createHashportStore({ storage: createCacheStorage() }).getState();
        const lockSteps = bridgeSteps[USDC].slice(2);
        const id = hashportStore.queueTransaction(bridgeParamsMock.lock, lockSteps);
        hashportStore.updateTransactionState(id, { evmTransactionHash: MOCK_HASHES.lock });
        const signerSpy = vi.spyOn(mockEvmSigner, 'getContract');
        const contractHandler = new EvmContractHandler(
            mockEvmSigner,
            lockSteps[0] as EvmBridgeStep,
            hashportStore.getTransactionData(id),
        );
        await contractHandler.lock();
        expect(signerSpy).not.toHaveBeenCalled();
    });
});
