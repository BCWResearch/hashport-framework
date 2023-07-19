import { createStore } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { BridgeParams, BridgeStep } from '../../../types/api/bridge';
import { HashportError } from '../../../utils/error';
import { v4 as randomUUID } from 'uuid';
import { HashportTransactionData } from '../../../types/state';

type State = { queue: Map<string, HashportTransactionData> };

type Action = {
    queueTransaction(params: BridgeParams, steps: BridgeStep[]): string;
    getTransactionData(id: string): HashportTransactionData;
    updateTransactionState(
        id: string,
        partial: HashportTransactionData['state'],
        consumeStep?: boolean,
    ): void;
    deleteTransaction(id: string): void;
};

export function createHashportStore(
    persistOptions: { persistKey?: string; storage?: StateStorage } = {},
) {
    const { persistKey = 'hashportTransactionsStore', storage = localStorage } = persistOptions;
    return createStore<State & Action>()(
        persist(
            (set, get) => ({
                queue: new Map<string, HashportTransactionData>(),
                queueTransaction(params: BridgeParams, steps: BridgeStep[]) {
                    let id = randomUUID();
                    while (get().queue.has(id)) {
                        id = randomUUID();
                    }
                    set(state => ({
                        ...state,
                        queue: state.queue.set(id, { params, steps, state: {} }),
                    }));
                    return id;
                },
                getTransactionData(id: string) {
                    const transactionData = get().queue.get(id);
                    if (!transactionData)
                        throw new HashportError(
                            `No transaction data found for ${id}`,
                            'INVALID_STATE',
                        );
                    return transactionData;
                },
                updateTransactionState(
                    id: string,
                    partial: HashportTransactionData['state'],
                    consumeStep = false,
                ) {
                    const transactionData = get().getTransactionData(id);
                    set(state => ({
                        ...state,
                        queue: state.queue.set(id, {
                            ...transactionData,
                            state: { ...transactionData.state, ...partial },
                            steps: transactionData.steps.slice(consumeStep ? 1 : 0),
                        }),
                    }));
                },
                deleteTransaction(id: string) {
                    set(state => {
                        state.queue.delete(id);
                        return {
                            ...state,
                        };
                    });
                },
            }),
            {
                name: persistKey,
                storage: createJSONStorage(() => storage, {
                    reviver(key, value) {
                        return key === 'queue' && value && typeof value === 'object'
                            ? new Map(Object.entries(value))
                            : value;
                    },
                    replacer(_, value) {
                        return value instanceof Map ? Object.fromEntries(value) : value;
                    },
                }),
            },
        ),
    );
}
