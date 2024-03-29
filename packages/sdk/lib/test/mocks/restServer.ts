import { DefaultBodyType, rest } from 'msw';
import { setupServer } from 'msw/node';
import {
    BalancesResult,
    MirrorNodeNft,
    TokenRelationship,
    TokenRelationshipResponse,
    TransactionTypes,
    TransactionsEntity,
    TransactionsResponse,
} from '../../types/mirrorNode/index.js';
import { ValidatorPollResponse } from '../../types/validator/index.js';
import { BridgeStep, BridgeValidation } from '../../types/api/bridge.js';
import { bridgeSteps, bridgeValidateValid } from '../mockData/api/bridge.js';
import { CondensedAsset, NetworkAssets } from '../../types/api/assets.js';
import { networksNetworkIdAssets } from '../mockData/api/networks.js';
import { BRIDGE_PAYOUT_CONFIRMATION, FETCH_TEST_URL } from './constants.js';
import {
    ASSOCIATION_TX_RESPONSE,
    NFT_DEPOSIT_TX_RESPONSE,
    mockHederaAccount,
} from './mockSigners.js';
import { formatTransactionId } from '../../utils/formatters.js';
import { blockConfirmations } from '../../constants/blockConfirmations.js';

// Full value from mockData is too large for msw to handle
export const assets: NetworkAssets[] = [
    {
        network: {
            id: 1,
            name: 'Ethereum',
        },
        assets: {
            '0x14ab470682Bc045336B1df6262d538cB6c35eA2A': {
                id: '0x14ab470682Bc045336B1df6262d538cB6c35eA2A',
                name: 'HBAR[eth]',
                symbol: 'HBAR[eth]',
                isNative: false,
                decimals: 8,
                icon: 'https://cdn.hashport.network/HBAR.svg',
            },
        },
    },
    {
        network: {
            id: 295,
            name: 'Hedera',
        },
        assets: {
            HBAR: {
                id: 'HBAR',
                name: 'HBAR',
                symbol: 'HBAR',
                isNative: true,
                decimals: 8,
                bridgeableNetworks: {
                    '1': {
                        network: {
                            id: 1,
                            name: 'Ethereum',
                        },
                        wrappedAsset: '0x14ab470682Bc045336B1df6262d538cB6c35eA2A',
                    },
                },
                icon: 'https://cdn.hashport.network/HBAR.svg',
            },
        },
    },
];

const miscHandlers = [
    rest.get(FETCH_TEST_URL, (_, res, ctx) => {
        return res(ctx.status(200), ctx.json('mock_data'));
    }),
    rest.get('https://cdn.hashport.network/blockConfirmations.json', (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(blockConfirmations));
    }),
    rest.get('https://cdn.hashport.network/explorers.json', (_, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                '1': 'https://etherscan.io/',
                '10': 'https://explorer.optimism.io/',
                '25': 'https://cronoscan.com/',
                '56': 'https://bscscan.com/',
                '97': 'https://testnet.bscscan.com/',
                '137': 'https://polygonscan.com/',
                '250': 'https://ftmscan.com/',
                '295': 'https://hashscan.io/mainnet/',
                '296': 'https://hashscan.io/testnet/',
                '338': 'https://testnet.cronoscan.com/',
                '420': 'https://goerli-optimism.etherscan.io/',
                '1284': 'https://moonscan.io/',
                '1287': 'https://moonbase.moonscan.io/',
                '4002': 'https://testnet.ftmscan.com/',
                '42161': 'https://arbiscan.io/',
                '43113': 'https://testnet.snowtrace.io/',
                '43114': 'https://snowtrace.io/',
                '80001': 'https://mumbai.polygonscan.com/',
                '8453': 'https://base.blockscout.com/',
                '84531': 'https://goerli.basescan.org/',
                '421613': 'https://goerli.arbiscan.io/',
                '11155111': 'https://sepolia.etherscan.io/',
                '1313161554': 'https://explorer.aurora.dev/',
                '1313161555': 'https://explorer.testnet.aurora.dev/',
            }),
        );
    }),
];

const mirrorNodeHandlers = [
    rest.get<DefaultBodyType, never, Omit<BalancesResult, 'links'>>(
        'https://mainnet-public.mirrornode.hedera.com/api/v1/balances',
        (_, res, ctx) => {
            const { HBAR, ...tokens } = mockHederaAccount.balances;
            return res(
                ctx.json({
                    timestamp: null,
                    balances: [
                        {
                            account: mockHederaAccount.address,
                            balance: Number(HBAR),
                            tokens: Object.entries(tokens).map(([token_id, amount]) => ({
                                token_id,
                                balance: Number(amount),
                            })),
                        },
                    ],
                }),
            );
        },
    ),
    rest.get<DefaultBodyType, { txId: string }, Omit<TransactionsResponse, 'links'>>(
        'https://mainnet-public.mirrornode.hedera.com/api/v1/transactions/:txId',
        (req, res, ctx) => {
            const { txId } = req.params;
            const associationTxId = formatTransactionId(ASSOCIATION_TX_RESPONSE.transactionId);
            if (associationTxId === txId) {
                return res(
                    ctx.json({
                        transactions: [
                            {
                                name: TransactionTypes.TOKENASSOCIATE,
                                result: 'SUCCESS',
                                transaction_id: associationTxId,
                            },
                        ] as unknown as TransactionsEntity[],
                    }),
                );
            }
            return res(
                ctx.json({
                    transactions: [
                        { name: TransactionTypes.CRYPTOTRANSFER, result: 'SUCCESS' },
                        { name: TransactionTypes.CRYPTOAPPROVEALLOWANCE, result: 'SUCCESS' },
                    ] as unknown as TransactionsEntity[],
                }),
            );
        },
    ),
    rest.get<DefaultBodyType, { tokenId: string; serialNumber: string }, MirrorNodeNft>(
        'https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/:tokenId/nfts/:serialNumber',
        (req, res, ctx) => {
            const { serialNumber, tokenId } = req.params;
            const account_id =
                mockHederaAccount.nfts[tokenId] === BigInt(serialNumber)
                    ? mockHederaAccount.address
                    : '0.0.0';
            return res(ctx.json({ account_id } as MirrorNodeNft));
        },
    ),
    rest.get<DefaultBodyType, { accountId: string }, Omit<TokenRelationshipResponse, 'links'>>(
        'https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/:accountId/tokens',
        (req, res, ctx) => {
            const tokenId = req.url.searchParams.get('token.id') ?? '';
            const { nfts, balances } = mockHederaAccount;
            const accountTokens = { ...nfts, ...balances };
            const tokens = (mockHederaAccount.address === req.params.accountId
                ? Object.entries(accountTokens)
                      .filter(([id]) => id === tokenId)
                      .map(([id, balance]) => ({ token_id: id, balance: Number(balance) }))
                : []) as unknown as TokenRelationship[];
            return res(ctx.json({ tokens }));
        },
    ),
];

const validatorHandlers = [
    rest.get<DefaultBodyType, { transferId: string }, ValidatorPollResponse>(
        'https://nonval.mainnet.hashport.network/api/v1/transfers/:transferId',
        (req, res, ctx) => {
            const { transferId } = req.params;
            const isNft = formatTransactionId(NFT_DEPOSIT_TX_RESPONSE.transactionId) === transferId;
            return res(
                ctx.json({
                    isNft,
                    majority: true,
                    sourceChainId: 1,
                    targetChainId: 295,
                    wrappedAsset: '',
                    amount: '1',
                    routerAddress: '0x',
                    nativeAsset: '',
                    recipient: '',
                    signatures: [],
                    tokenId: '1',
                    metadata: '',
                    sourceAsset: '',
                    targetAsset: '',
                }),
            );
        },
    ),
    rest.get<DefaultBodyType, { pollingId: string }, string>(
        'https://nonval.mainnet.hashport.network/api/v1/events/:pollingId/tx',
        (_, res, ctx) => res(ctx.json(BRIDGE_PAYOUT_CONFIRMATION)),
    ),
];

const hashportApiHandlers = [
    rest.get<DefaultBodyType, never, NetworkAssets[]>(
        'https://mainnet.api.hashport.network/api/v1/assets',
        (_, res, ctx) => {
            return res(ctx.status(200), ctx.json(assets));
        },
    ),
    rest.get<DefaultBodyType, never, BridgeValidation>(
        'https://mainnet.api.hashport.network/api/v1/bridge/validate',
        (_, res, ctx) => res(ctx.json(bridgeValidateValid)),
    ),
    rest.get<DefaultBodyType, never, BridgeStep[]>(
        'https://mainnet.api.hashport.network/api/v1/bridge',
        (req, res, ctx) => {
            const sourceAssetId = req.url.searchParams.get('sourceAssetId');
            if (!sourceAssetId) return res.networkError('Invalid sourceAssetId');
            const steps = bridgeSteps[sourceAssetId];
            if (!steps) return res.networkError(`Mock steps for ${sourceAssetId} asset not found`);
            return res(ctx.json(steps));
        },
    ),
    rest.get<DefaultBodyType, { chainId: string }, Record<string, CondensedAsset>>(
        'https://mainnet.api.hashport.network/api/v1/networks/:chainId/assets/',
        (req, res, ctx) => {
            const { chainId } = req.params;
            if (chainId !== '1') {
                return res.networkError('No mock asset data for networks other than chain id 1');
            }
            return res(ctx.json(networksNetworkIdAssets));
        },
    ),
    rest.get<DefaultBodyType, { chainId: string; assetId: string }, CondensedAsset>(
        'https://mainnet.api.hashport.network/api/v1/networks/:chainId/assets/:assetId',
        (req, res, ctx) => {
            const { assetId, chainId } = req.params;
            if (chainId !== '1') {
                return res.networkError('No mock asset data for networks other than chain id 1');
            }
            const asset = networksNetworkIdAssets[assetId];
            if (!asset) {
                return res.networkError(`No mock data exists for ${assetId}`);
            }
            return res(ctx.json(asset));
        },
    ),
    rest.get(
        'https://mainnet.api.hashport.network/api/v1/networks/:networkId/assets/:assetId/min-amount',
        (_, res, ctx) => {
            return res(ctx.json({ minAmount: '10000000000' }));
        },
    ),
];

export const server = setupServer(
    ...mirrorNodeHandlers,
    ...miscHandlers,
    ...validatorHandlers,
    ...hashportApiHandlers,
);
