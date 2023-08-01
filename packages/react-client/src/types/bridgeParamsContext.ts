import { AssetInfo } from 'types';

export type SelectTokenPayload = Pick<
    AssetInfo,
    'id' | 'chainId' | 'bridgeableAssets' | 'decimals'
>;

export type BridgeParamsAction =
    | {
          type: 'resetBridgeParams';
          payload?: never;
      }
    | { type: 'setSourceAsset'; payload: SelectTokenPayload }
    | { type: 'setTargetAsset'; payload: SelectTokenPayload }
    | { type: 'setAmount'; payload: { amount: string; decimals: number } }
    | { type: 'setTokenId'; payload: { tokenId: string } }
    | { type: 'setRecipient'; payload: string };

export type BridgeParamsDispatch = {
    [Action in BridgeParamsAction as Action['type']]: (payload: Action['payload']) => void;
};
