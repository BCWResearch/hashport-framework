import { HashportTransactionData, HashportTransactionState } from '@hashport/sdk';
import { useBridgeParamsDispatch, useHashportClient, useHashportTransactionQueue } from 'hooks';
import { Reducer, createContext, useCallback, useMemo, useReducer } from 'react';

type ProcessingTransactionState =
    | { status: 'idle'; id?: string; confirmation?: undefined; error?: undefined }
    | { status: 'processing'; id: string; confirmation?: undefined; error?: undefined }
    | { status: 'error'; id: string; confirmation?: undefined; error: unknown }
    | { status: 'complete'; id: string; confirmation: HashportTransactionState; error?: undefined };

export const ProcessingTransactionContext = createContext<
    (ProcessingTransactionState & { currentTransaction?: HashportTransactionData }) | null
>(null);

type ProcessTransactionDispatchValue = {
    executeTransaction: (id: string) => Promise<void>;
    confirmCompletion: () => void;
};

export const ProcessTransactionDispatchContext =
    createContext<ProcessTransactionDispatchValue | null>(null);

// Creates payloads out of state. "idle" does not have a payload.
type ProcessingTransactionAction = {
    [State in ProcessingTransactionState as State['status']]: {
        type: State['status'];
    } & (State['status'] extends 'idle'
        ? { payload?: never }
        : {
              payload: {
                  [P in keyof Omit<State, 'status'>]: State[P] extends undefined ? never : State[P];
              };
          });
}[ProcessingTransactionState['status']];

const processingTransactionReducer: Reducer<
    ProcessingTransactionState,
    ProcessingTransactionAction
> = (_, { type, payload }) => {
    switch (type) {
        case 'idle': {
            return { status: 'idle' };
        }
        case 'processing': {
            const { id } = payload;
            return { status: 'processing', id };
        }
        case 'complete': {
            const { confirmation, id } = payload;
            return { status: 'complete', id, confirmation };
        }
        case 'error': {
            const { error, id } = payload;
            return { status: 'error', id, error };
        }
    }
};

export const ProcessingTransactionProvider = ({ children }: { children: React.ReactNode }) => {
    const hashportClient = useHashportClient();
    const { resetBridgeParams } = useBridgeParamsDispatch();
    const [state, dispatch] = useReducer(processingTransactionReducer, { status: 'idle' });
    const transactionQueue = useHashportTransactionQueue();
    const currentTransaction = transactionQueue.get(state.id ?? '');

    const executeTransaction = useCallback(
        async (id: string) => {
            try {
                dispatch({ type: 'processing', payload: { id } });
                const confirmation = await hashportClient.execute(id);
                dispatch({ type: 'complete', payload: { confirmation, id } });
            } catch (error) {
                console.error(error);
                dispatch({ type: 'error', payload: { id, error } });
            }
        },
        [hashportClient],
    );

    const confirmCompletion = useCallback(() => {
        if (state.status !== 'processing') {
            dispatch({ type: 'idle' });
            resetBridgeParams();
        }
    }, [state, resetBridgeParams]);

    const dispatchValue = useMemo(
        () => ({ executeTransaction, confirmCompletion }),
        [executeTransaction, confirmCompletion],
    );

    return (
        <ProcessingTransactionContext.Provider value={{ ...state, currentTransaction }}>
            <ProcessTransactionDispatchContext.Provider value={dispatchValue}>
                {children}
            </ProcessTransactionDispatchContext.Provider>
        </ProcessingTransactionContext.Provider>
    );
};
