import type { BridgeParams } from '@hashport/sdk';
import { createContext } from 'react';

// context that defaults to empty params
const bridgeParamsContext = createContext<BridgeParams>({
    recipient: '',
    sourceAssetId: '',
    sourceNetworkId: '',
    targetNetworkId: '',
    amount: '',
});
// action type for what gets passed to the reducer
type Action =
    | {
          type: 'reset';
          payload?: never;
      }
    | { type: 'update'; payload: Partial<BridgeParams> };
// reducer that handles updating the params object (should allow amount or tokenId, but not both)
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

// provider & interface that provides dispatch functions to modify the state
// provider & interface that provides the bridge params state

// (external file) hook that provides bridge params as state
// (external file) hook that provides dispatch functions as state
