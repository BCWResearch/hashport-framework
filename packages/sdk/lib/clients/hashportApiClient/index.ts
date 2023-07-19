import { CondensedAsset, NetworkAssets } from '../../types/api/assets';
import { BridgeParams, BridgeStep, BridgeValidation } from '../../types/api/bridge';
import { NonFungibleTokenFee } from '../../types/api/fees';
import {
    NetworkReserveAmounts,
    Network,
    AssetReserveAmounts,
    AssetMinAmount,
    NetworkMinAmounts,
} from '../../types/api/networks';
import { PaginatedTransfers, TransferParams } from '../../types/api/transfers';
import { Fetcher } from '../../utils/fetch';

export class HashportApiClient {
    private baseUrl: string;
    private configUrl: string;

    constructor(mode: 'mainnet' | 'testnet' = 'mainnet') {
        this.baseUrl =
            mode === 'mainnet'
                ? 'https://mainnet.api.hashport.network/api/v1'
                : 'https://testnet.api.hashport.network/api/v1';
        this.configUrl =
            mode === 'mainnet'
                ? 'https://mainnet.validator.hashport.network/api/v1'
                : 'https://testnet.validator.hashport.network/api/v1';
    }
    /**
     * Returns an array of objects representing assets on each supported network.
     * Assets are a map of the token's EVM address or Hedera ID to the token details.
     */
    assets() {
        return new Fetcher<NetworkAssets[]>(this.baseUrl + '/assets');
    }
    /**
     * Returns reserve amounts for supported assets. If no parameters are
     * provided, it will return an object where the keys are the chain ids of
     * each supported network mapped to token objects. These token objects are
     * maps of the token's EVM address or Hedera ID mapped to the token's
     * reserve amounts and details.
     *
     * You can also provide the network chain id and EVM address / Hedera ID as
     * parameters. This will only return token reserve amounts and details
     * related to one token. */
    assetAmounts(): Fetcher<NetworkReserveAmounts>;
    assetAmounts(networkId: number, assetId: string): Fetcher<AssetReserveAmounts>;
    assetAmounts(
        networkId?: number,
        assetId?: string,
    ): Fetcher<NetworkReserveAmounts> | Fetcher<AssetReserveAmounts> {
        if (networkId === undefined && assetId === undefined) {
            return new Fetcher<NetworkReserveAmounts>(this.baseUrl + '/assets/amounts');
        } else {
            return new Fetcher<AssetReserveAmounts>(
                this.baseUrl + `/networks/${networkId}/assets/${assetId}/amounts`,
            );
        }
    }
    /**
     * Validates a bridging operation, returning a error if any of the
     * parameters have been input incorrectly.
     */
    validateBridgeParams(params: BridgeParams): Fetcher<BridgeValidation> {
        return new Fetcher<BridgeValidation>(this.baseUrl + '/bridge/validate', { params });
    }
    /**
     * Returns an array of steps to follow in order to execute a porting
     * transaction.
     *
     * Steps can be of 3 types: `Hedera`, `polling`, or `evm`.
     * `Hedera` steps will include parameters to pass to a particulate transaction
     * query, `polling` steps include a polling interval in seconds, and `evm`
     * steps will provide an abi for making a contract call.
     *  */
    bridge(params: BridgeParams): Fetcher<BridgeStep[]> {
        return new Fetcher<BridgeStep[], BridgeParams>(this.baseUrl + '/bridge', { params });
    }
    /**
     * Returns fee amounts pertaining to NFT porting operations. Return value
     * is a mapping of a network's chain id to the supported NFTs of that
     * network. Each NFT object is also a map where the key represents the
     * collection id, and the value is the fee data.
     */
    nftFees(): Fetcher<NonFungibleTokenFee> {
        return new Fetcher<NonFungibleTokenFee>(this.baseUrl + '/fees/nft');
    }
    /**
     * Returns supported network names and chain ids.
     * */
    networks(): Fetcher<Network[]> {
        return new Fetcher<Network[]>(this.baseUrl + '/networks');
    }
    /**
     * Returns all supported assets for a given network. Return value is a
     * mapping of the token's EVM address or Hedera ID to its info. If
     * `bridgeableNetworks` is present in the token info payload, it represents
     * a mapping of bridgeable network chain ids to a `network` object and the
     * `wrappedAsset`'s address/ID.
     *
     * You can optionally pass in an id to get information related to a specific
     * token. If the asset is not supported, an error will be thrown.
     */
    networkAssets(networkChainId: number): Fetcher<Record<string, CondensedAsset>>;
    networkAssets(networkChainId: number, assetId: string): Fetcher<CondensedAsset>;
    networkAssets(
        networkChainId: number,
        assetId?: string,
    ): Fetcher<CondensedAsset> | Fetcher<Record<string, CondensedAsset>> {
        if (assetId === undefined) {
            return new Fetcher<Record<string, CondensedAsset>>(
                this.baseUrl + `/networks/${networkChainId}/assets/`,
            );
        }
        return new Fetcher<CondensedAsset>(
            this.baseUrl + `/networks/${networkChainId}/assets/${assetId}`,
        );
    }
    /**
     * Returns minimum amounts required to complete a porting transaction. If
     * no parameters are provided, it will return an object where the keys
     * represent the network's chain id and the values are a 1 to 1 pairing of
     * the token's EVM address or Hedera ID to the amount. The amounts are
     * presented as strings representing the smallest denomination of the
     * token, according to its decimals.
     */
    minAmounts(): Fetcher<NetworkMinAmounts>;
    minAmounts(networkId: number, assetId: string): Fetcher<NetworkMinAmounts>;
    minAmounts(networkId?: number, assetId?: string) {
        if (networkId === undefined && assetId === undefined) {
            return new Fetcher<NetworkMinAmounts>(this.configUrl + '/min-amounts');
        } else {
            return new Fetcher<AssetMinAmount>(
                this.baseUrl + `/networks/${networkId}/assets/${assetId}/min-amount`,
            );
        }
    }
    /**
     * Returns the total count of transfers that have occured on the bridge
     * along with an array of transfer information. The return value is
     * paginated and each payload is limited to 50 items. You can also filter
     * results by originator, timestamp (must be in RFC3339Nano format), token
     * id, and transaction id.
     */
    transfers(params: TransferParams = { page: 1, pageSize: 50 }): Fetcher<PaginatedTransfers> {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (!value) continue;
            searchParams.set(key, value.toString());
        }
        return new Fetcher<PaginatedTransfers>(this.baseUrl + '/transfers', { params });
    }
}
