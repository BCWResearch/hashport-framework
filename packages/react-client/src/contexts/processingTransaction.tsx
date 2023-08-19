import { HashportTransactionData } from '@hashport/sdk';
import { useHashportClient, useHashportTransactionQueue } from 'hooks';
import { Reducer, createContext, useCallback, useReducer } from 'react';

type ProcessingTransactionState =
    | {
          id: string;
          isProcessing: true;
          isError: false;
          error: undefined;
      }
    | {
          // TODO: add confirmation value
          id: undefined | string;
          isProcessing: false;
          isError: false;
          error: undefined;
      }
    | {
          id: string;
          isProcessing: false;
          isError: true;
          error: unknown;
      };

// useProcessingTransaction - state from current tx
// useProcessTransaction - queue, execute, cancel
// it would need to sit inside ALL the providers
// dispatches:
// execute <- should replace the current execute function?
// confirm completion
// Handle bridge params resetting on completion? or would that be annoying?

export const ProcessingTransactionContext = createContext<
    // TODO: if isProcessing, state should be defined
    (ProcessingTransactionState & { state?: HashportTransactionData }) | null
>(null);

type ProcessTransactionDispatchValue = {
    executeTransaction: (id: string) => Promise<void>;
};

export const ProcessTransactionDispatchContext =
    createContext<ProcessTransactionDispatchValue | null>(null);

type ProcessingTransactionAction =
    | {
          type: 'start';
          payload: { id: string };
      }
    | {
          type: 'complete';
          payload?: never;
      }
    | {
          type: 'error';
          payload: { error: unknown; id: string };
      }
    | {
          type: 'reset';
          payload?: never;
      }
    | {
          type: 'paused';
          payload?: never;
      };

const processingTransactionReducer: Reducer<
    ProcessingTransactionState,
    ProcessingTransactionAction
> = (state, { type, payload }) => {
    switch (type) {
        case 'start': {
            return {
                id: payload.id,
                isProcessing: true,
                isError: false,
                error: undefined,
            };
        }
        case 'complete': {
            return { id: undefined, isProcessing: false, isError: false, error: undefined };
        }
        case 'reset': {
            return {
                id: undefined,
                isProcessing: false,
                isError: false,
                error: undefined,
            };
        }
        case 'error': {
            return {
                isProcessing: false,
                isError: true,
                error: payload.error,
                id: payload.id,
            };
        }
        case 'paused': {
            return {
                ...state,
                isProcessing: false,
            };
        }
    }
};

export const ProcessingTransactionProvider = ({ children }: { children: React.ReactNode }) => {
    const hashportClient = useHashportClient();
    const [state, dispatch] = useReducer(processingTransactionReducer, {
        id: undefined,
        isProcessing: false,
        isError: false,
        error: undefined,
    });
    const transactionQueue = useHashportTransactionQueue();
    const currentTransaction = transactionQueue.get(state.id ?? '');

    const executeTransaction = useCallback(
        async (id: string) => {
            try {
                dispatch({ type: 'start', payload: { id } });
                const confirmation = await hashportClient.execute(id);
                // TODO: save confirmation
            } catch (error) {
                console.error(error);
                dispatch({ type: 'error', payload: { id, error } });
            } finally {
                dispatch({ type: 'paused' });
            }
        },
        [hashportClient],
    );

    return (
        <ProcessingTransactionContext.Provider value={{ ...state, state: currentTransaction }}>
            <ProcessTransactionDispatchContext.Provider value={{ executeTransaction }}>
                {children}
            </ProcessTransactionDispatchContext.Provider>
        </ProcessingTransactionContext.Provider>
    );
};
