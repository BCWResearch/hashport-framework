import {
    ProcessTransactionDispatchContext,
    ProcessingTransactionContext,
} from 'contexts/processingTransaction';
import { useContext } from 'react';

export const useProcessingTransaction = () => {
    const state = useContext(ProcessingTransactionContext);
    if (!state) throw 'Must use within Processing Transaction Context';
    return state;
};

export const useProcessingTransactionDispatch = () => {
    const dispatch = useContext(ProcessTransactionDispatchContext);
    if (!dispatch) throw 'Must use within Processing Transaction Dispatch Context';
    return dispatch;
};
