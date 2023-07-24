import type { BridgeParams } from '@hashport/sdk';
import { ReactNode, createContext, useMemo, useReducer } from 'react';

const DEFAULT_BRIDGE_PARAMS = {
    recipient: '',
    sourceAssetId: '',
    sourceNetworkId: '',
    targetNetworkId: '',
    amount: '',
};
export const BridgeParamsContext = createContext<BridgeParams>(DEFAULT_BRIDGE_PARAMS);

type BridgeParamsDispatch = {
    updateBridgeParams(params: Partial<BridgeParams>): void;
    resetBridgeParams(): void;
};

export const BridgeParamsDispatchContext = createContext<BridgeParamsDispatch | null>(null);

type Action =
    | {
          type: 'reset';
          payload?: never;
      }
    | { type: 'update'; payload: Partial<BridgeParams> };

const bridgeParamsReducer: React.Reducer<BridgeParams, Action> = (state, { type, payload }) => {
    switch (type) {
        case 'update': {
            const { amount, tokenId, ...updatePayload } = payload;
            if (tokenId) {
                const { amount: _, ...prevState } = state;
                return {
                    ...prevState,
                    ...payload,
                    tokenId,
                };
            } else if (amount) {
                const { tokenId: _, ...prevState } = state;
                return {
                    ...prevState,
                    ...payload,
                    amount,
                };
            } else {
                return {
                    ...state,
                    ...updatePayload,
                };
            }
        }
        case 'reset': {
            return {
                recipient: '',
                sourceAssetId: '',
                sourceNetworkId: '',
                targetNetworkId: '',
                amount: '',
            };
        }
    }
};

export const BridgeParamsProvider = ({ children }: { children: ReactNode }) => {
    const [bridgeParams, dispatch] = useReducer(bridgeParamsReducer, DEFAULT_BRIDGE_PARAMS);

    const bridgeParamsDispatch = useMemo<BridgeParamsDispatch>(
        () => ({
            updateBridgeParams(params) {
                dispatch({ type: 'update', payload: params });
            },
            resetBridgeParams() {
                dispatch({ type: 'reset' });
            },
        }),
        [dispatch],
    );

    return (
        <BridgeParamsContext.Provider value={bridgeParams}>
            <BridgeParamsDispatchContext.Provider value={bridgeParamsDispatch}>
                {children}
            </BridgeParamsDispatchContext.Provider>
        </BridgeParamsContext.Provider>
    );
};
