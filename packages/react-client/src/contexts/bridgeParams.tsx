import type { BridgeParams } from '@hashport/sdk';
import { ReactNode, createContext, useMemo, useReducer } from 'react';
import { BridgeParamsAction, BridgeParamsDispatch } from 'types';

const DEFAULT_BRIDGE_PARAMS = {
    recipient: '',
    sourceAssetId: '',
    sourceNetworkId: '',
    targetNetworkId: '',
    amount: '',
};
export const BridgeParamsContext = createContext<BridgeParams>(DEFAULT_BRIDGE_PARAMS);

export const BridgeParamsDispatchContext = createContext<BridgeParamsDispatch | null>(null);

const bridgeParamsReducer: React.Reducer<BridgeParams, BridgeParamsAction> = (
    state,
    { type, payload },
) => {
    switch (type) {
        // TODO: Add specific functions for different params
        // amount (ft)
        // tokenId (nft)
        // recipient
        case 'selectToken': {
            const { id, chainId, bridgeableAssets } = payload;
            const { sourceAssetId, sourceNetworkId } = state;
            const isSourceAsset =
                Boolean(!sourceAssetId && !sourceNetworkId) ||
                !bridgeableAssets.find(
                    ({ assetId, chainId }) =>
                        chainId === +sourceNetworkId && sourceAssetId === assetId.split('-')[0],
                );
            if (isSourceAsset) {
                return {
                    ...state,
                    sourceAssetId: id,
                    sourceNetworkId: chainId.toString(),
                    targetNetworkId: '',
                };
            } else {
                return {
                    ...state,
                    targetNetworkId: chainId.toString(),
                };
            }
        }
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
            selectToken(token) {
                dispatch({ type: 'selectToken', payload: token });
            },
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
