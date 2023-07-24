import { useContext } from 'react';
import { BridgeParamsContext, BridgeParamsDispatchContext } from '../contexts/bridgeParamsContext';

export const useBridgeParams = () => {
    return useContext(BridgeParamsContext);
};

export const useBridgeParamsDispatch = () => {
    const dispatch = useContext(BridgeParamsDispatchContext);
    if (!dispatch) throw 'Bridge Params Dispatch must be used within provider';
    return dispatch;
};
