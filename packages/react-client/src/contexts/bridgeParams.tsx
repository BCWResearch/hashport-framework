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
        case 'setAmount': {
            const { amount, decimals } = payload;
            const { tokenId: _, ...prevState } = state;
            // TODO: validate amount according to decimals
            return {
                ...prevState,
                amount,
            };
        }
        case 'setTokenId': {
            const { tokenId } = payload;
            const { amount: _, ...prevState } = state;
            return {
                ...prevState,
                tokenId,
            };
        }
        case 'setRecipient': {
            const { recipient } = payload;
            return {
                ...state,
                recipient,
            };
        }
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
        case 'resetBridgeParams': {
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
            resetBridgeParams() {
                dispatch({ type: 'resetBridgeParams' });
            },
            selectToken(payload) {
                dispatch({ type: 'selectToken', payload });
            },
            setAmount(payload) {
                dispatch({ type: 'setAmount', payload });
            },
            setRecipient(payload) {
                dispatch({ type: 'setRecipient', payload });
            },
            setTokenId(payload) {
                dispatch({ type: 'setTokenId', payload });
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
