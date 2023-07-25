import { BridgeParams } from '@hashport/sdk';
import { AssetInfo } from 'types';

export type SelectTokenPayload = Pick<AssetInfo, 'id' | 'chainId' | 'bridgeableAssets'>;

export type BridgeParamsDispatch = {
    selectToken(token: SelectTokenPayload): void;
    updateBridgeParams(params: Partial<BridgeParams>): void;
    resetBridgeParams(): void;
};

export type BridgeParamsAction =
    | {
          type: 'reset';
          payload?: never;
      }
    | { type: 'update'; payload: Partial<BridgeParams> }
    | { type: 'selectToken'; payload: SelectTokenPayload };
