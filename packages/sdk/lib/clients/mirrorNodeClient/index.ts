import {
    BalancesQueryParams,
    BalancesResult,
    MirrorNodeNft,
    TokenRelationshipResponse,
    TransactionsQueryParams,
    TransactionsResponse,
} from 'types/mirrorNode';
import { Fetcher } from 'utils/fetch.js';

/**
 * A simple wrapper around the Hedera Mirror Node REST API.
 */
export class MirrorNodeClient {
    private headers: Record<string, string>;
    baseUrl: string;
    /**
     * Creates a new fetcher instance for submitting queries to the mirror node. If you are using a
     * dedicated mirror node service like {@link https://www.arkhia.io/ Arkhia}, provide your custom
     * URL, request headers, and API key. View Arkhia's {@link https://docs.arkhia.io/docs/welcome Documentation}
     * for more information. Note that the headers in each request are set to prevent caching. This
     * ensures that the data payloads are up to date.
     * @param mode The network you are querying. Supports 'mainnet' and 'testnet'.
     * @param customMirrorNodeUrl Custom URL for dedicated mirror node services.
     * @param customMirrorNodeCredentials Request header and API key. (Ex. ["x-api-key", "API_KEY"])
     */
    constructor(
        mode: 'mainnet' | 'testnet',
        customMirrorNodeUrl?: string,
        customMirrorNodeCredentials?: [string, string],
    ) {
        this.baseUrl =
            customMirrorNodeUrl ??
            (mode === 'mainnet'
                ? 'https://mainnet-public.mirrornode.hedera.com/api/v1'
                : 'https://testnet.mirrornode.hedera.com/api/v1');
        this.headers = {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: '0',
        };
        if (customMirrorNodeCredentials) {
            const [key, value] = customMirrorNodeCredentials;
            this.headers = {
                ...this.headers,
                [key]: value,
            };
        }
    }
    /**
     * Returns account balances on the Hedera network. Refer to Hedera's
     * {@link https://docs.hedera.com/hedera/sdks-and-apis/rest-api#balances documentation}
     * for more information
     */
    getBalances(params?: Partial<BalancesQueryParams>) {
        const url = `${this.baseUrl}/balances`;
        return new Fetcher<BalancesResult>(url, { params, headers: this.headers });
    }

    /**
     * Returns a list of transactions on the Hedera network. Refer to Hedera's
     * {@link https://docs.hedera.com/hedera/sdks-and-apis/rest-api#api-v1-transactions documentation}
     * for more information
     */
    getTransactions({
        transactionId,
        ...params
    }: Partial<TransactionsQueryParams & { transactionId?: string }>) {
        const url = `${this.baseUrl}/transactions${transactionId ? `/${transactionId}` : ''}`;
        return new Fetcher<TransactionsResponse>(url, {
            params,
            headers: this.headers,
        });
    }

    /**
     * Returns all tokens associated to a given Hedera account. Refer to Hedera's
     * {@link https://docs.hedera.com/hedera/sdks-and-apis/rest-api#api-v1-accounts-idoraliasorevmaddress-tokens documentation}
     * for more information
     */
    getAccountTokens({
        accountId,
        ...params
    }: {
        accountId: string;
        limit?: number;
        order?: 'asc' | 'desc';
        'token.id'?: string;
    }) {
        const url = `${this.baseUrl}/accounts/${accountId}/tokens`;
        return new Fetcher<TokenRelationshipResponse>(url, { params, headers: this.headers });
    }

    /**
     * Returns whether or not a token is associated to a given Hedera account. Because of the
     * {@link https://hedera.com/blog/token-information-returned-by-getaccountinfo-and-getaccountbalance-to-be-deprecated HIP-367 update},
     * there is minimal latency. However, if checking association immediately after submitting a
     * token association transaction, it is recommended to wait around 5 seconds first.
     */
    checkTokenAssociation(accountId: string, tokenId: string) {
        const url = `${this.baseUrl}/accounts/${accountId}/tokens`;
        return new Fetcher<TokenRelationshipResponse, { ['token.id']: string }, boolean>(url, {
            params: { ['token.id']: tokenId },
            headers: this.headers,
            responseTransformer: data => data.tokens.length > 0,
        });
    }

    /**
     * Returns info for a single NFT serial. Refer to the token
     * {@link https://docs.hedera.com/hedera/sdks-and-apis/rest-api#tokens documentation} for more
     * information.
     */
    getNftInfoBySerial(tokenId: string, serialNumber: string) {
        const url = `${this.baseUrl}/tokens/${tokenId}/nfts/${serialNumber}`;
        return new Fetcher<MirrorNodeNft>(url);
    }
}
