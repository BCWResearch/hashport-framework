import { describe, test, expect, beforeEach } from 'vitest';
import { createHashportStore } from '../clients/hashportClient/helpers/hashportTransactionStore.js';
import { createCacheStorage } from './mocks/cacheStorage.js';
import { bridgeParamsMock, bridgeSteps } from './mockData/api/bridge.js';
import { HBAR } from './mocks/constants.js';

describe('Hashport Transaction Store', () => {
    const cacheStorage = createCacheStorage();
    const storageKey = 'storeTest';
    let store = createHashportStore({
        persistKey: storageKey,
        storage: cacheStorage,
    }).getState();

    beforeEach(() => {
        cacheStorage.getCache().clear();
        store = createHashportStore({ persistKey: storageKey, storage: cacheStorage }).getState();
    });

    test('should have matching current and persisted state', () => {
        const id = store.queueTransaction(bridgeParamsMock.mint, bridgeSteps[HBAR]);
        const parsedCache = JSON.parse(cacheStorage.getCache().get(storageKey) ?? '');
        expect(parsedCache.state.queue[id]).toStrictEqual(store.getTransactionData(id));
    });

    test('should update state with correct values', () => {
        const id = store.queueTransaction(bridgeParamsMock.mint, bridgeSteps[HBAR]);
        const updateValue = 'confirmationValue';
        store.updateTransactionState(id, { confirmationTransactionHashOrId: updateValue });
        expect(store.getTransactionData(id).state.confirmationTransactionHashOrId).toBe(
            updateValue,
        );
    });

    test('should only delete the intended store entry', () => {
        const id = store.queueTransaction(bridgeParamsMock.mint, bridgeSteps[HBAR]);
        const id2 = store.queueTransaction(bridgeParamsMock.mint, bridgeSteps[HBAR]);
        const id3 = store.queueTransaction(bridgeParamsMock.mint, bridgeSteps[HBAR]);
        expect(store.queue.size).toBe(3);
        store.deleteTransaction(id);
        expect(store.queue.size).toBe(2);
        expect(() => store.getTransactionData(id)).toThrowError(
            `No transaction data found for ${id}`,
        );
        expect(store.getTransactionData(id2).params).toStrictEqual(bridgeParamsMock.mint);
        expect(store.getTransactionData(id3).params).toStrictEqual(bridgeParamsMock.mint);
    });

    test('should consume steps if set to do so', () => {
        const id = store.queueTransaction(bridgeParamsMock.mint, bridgeSteps[HBAR]);
        expect(store.getTransactionData(id).steps.length).toBe(bridgeSteps[HBAR].length);
        store.updateTransactionState(id, { hederaDepositTransactionId: 'deposit' }, true);
        expect(store.getTransactionData(id).steps.length).toBe(bridgeSteps[HBAR].length - 1);
    });

    test('should not have id collisions up to 1000 queued transactions', () => {
        const ONE_THOUSAND = 1000;
        for (let i = 0; i < ONE_THOUSAND; i++) {
            store.queueTransaction(bridgeParamsMock.mint, bridgeSteps[HBAR]);
        }
        expect(store.queue.size).toBe(ONE_THOUSAND);
    });
});
