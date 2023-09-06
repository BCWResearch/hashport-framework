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
        case 'setBridgeParams': {
            return payload;
        }
        case 'setAmount': {
            const { amount, sourceAssetDecimals, targetAssetDecimals } = payload;
            const { tokenId: _, ...prevState } = state;
            // Allows for leading 0s. viem's parseUnit will trim them later
            // Decimals default to 6 if tokens are not selected
            const decimals = Math.min(sourceAssetDecimals ?? 6, targetAssetDecimals ?? 6);
            const validInputRegex = new RegExp(
                `^(?:[0-9]+)?(?:\\.\\d{0,${decimals || 6}}|\\d*)?$`,
                'gm',
            );
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
            if (!payload) {
                return {
                    ...state,
                    sourceAssetId: '',
                    sourceNetworkId: '',
                    targetNetworkId: '',
                };
            }
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
            const chainId = payload?.chainId.toString() ?? '';
            return {
                ...state,
                targetNetworkId: chainId,
            };
        }
        case 'resetBridgeParams': {
            return DEFAULT_BRIDGE_PARAMS;
        }
    }
};

export const BridgeParamsProvider = ({ children }: { children: ReactNode }) => {
    const [bridgeParams, dispatch] = useReducer(bridgeParamsReducer, DEFAULT_BRIDGE_PARAMS);

    const bridgeParamsDispatch = useMemo<BridgeParamsDispatch>(
        () => ({
            resetBridgeParams: () => dispatch({ type: 'resetBridgeParams' }),
            setSourceAsset: payload => dispatch({ type: 'setSourceAsset', payload }),
            setTargetAsset: payload => dispatch({ type: 'setTargetAsset', payload }),
            setAmount: payload => dispatch({ type: 'setAmount', payload }),
            setRecipient: payload => dispatch({ type: 'setRecipient', payload }),
            setTokenId: payload => dispatch({ type: 'setTokenId', payload }),
            setBridgeParams: payload => dispatch({ type: 'setBridgeParams', payload }),
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
