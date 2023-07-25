import { AssetInfo } from 'types';

export type SelectTokenPayload = Pick<AssetInfo, 'id' | 'chainId' | 'bridgeableAssets'>;

export type BridgeParamsAction =
    | {
          type: 'resetBridgeParams';
          payload?: never;
      }
    | { type: 'selectToken'; payload: SelectTokenPayload }
    | { type: 'setAmount'; payload: { amount: string; decimals: number } }
    | { type: 'setTokenId'; payload: { tokenId: string } }
    | { type: 'setRecipient'; payload: { recipient: string } };

export type BridgeParamsDispatch = {
    [Action in BridgeParamsAction as Action['type']]: (payload: Action['payload']) => void;
};
