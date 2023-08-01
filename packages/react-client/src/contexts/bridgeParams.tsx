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
            const validInputRegex = new RegExp(
                `^(?:0{1}?|[1-9]+)?(?:\\.\\d{0,${decimals}}|[1-9]\\d*)?$`,
                'gm',
            );
            // TODO: set state that indicates input error if invalid decimals, etc
            if (!amount.match(validInputRegex)) return state;
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
            return {
                ...state,
                recipient: payload,
            };
        }
        case 'setSourceAsset': {
            const { id, chainId, bridgeableAssets } = payload;
            return {
                ...state,
                sourceAssetId: id,
                sourceNetworkId: chainId.toString(),
                targetNetworkId:
                    bridgeableAssets.length === 1 ? bridgeableAssets[0].chainId.toString() : '',
            };
        }
        case 'setTargetAsset': {
            const { chainId } = payload;
            return {
                ...state,
                targetNetworkId: chainId.toString(),
            };
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
            setSourceAsset(payload) {
                dispatch({ type: 'setSourceAsset', payload });
            },
            setTargetAsset(payload) {
                dispatch({ type: 'setTargetAsset', payload });
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
