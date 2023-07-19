import { Block } from 'viem';
import {
    AccountAllowanceApproveTransaction,
    AccountId,
    Timestamp,
    TokenAssociateTransaction,
    TransactionId,
    TransferTransaction,
} from '@hashgraph/sdk';
import { Arguments, EvmSigner } from '../../types/signers/evmSigner.js';
import { HederaSigner } from '../../types/signers/hederaSigner.js';
import { MAX_UINT_256 } from '../../constants/units.js';
import {
    HBAR,
    HBAR_ETH,
    HOTDEFISUMMERNFT,
    HOTDEFISUMMERNFT_ETH,
    USDC,
    USDT,
    USDT_HTS,
    getSuccessfulEvmRxMock,
} from './constants.js';

/* eslint-disable @typescript-eslint/no-unused-vars*/
export const MOCK_HASHES = {
    approve: '0xAPPROVED',
    mint: '0xMINT',
    unlock: '0xUNLOCK',
    burnWithPermit: '0xBURNWITHPERMIT',
    lock: '0xLOCK',
    mintERC721: '0xMINTERC721',
    burnERC721: '0xBURNERC721',
} as const;

type MockAccount = {
    address: string;
    balances: { [k: string]: bigint };
    nfts: { [k: string]: bigint };
};

export const mockEvmAccount = {
    address: '0x0000000000000000000000000000000000000000',
    balances: {
        [HBAR_ETH]: BigInt('10000000000000'),
        [USDC]: BigInt('50000000'),
        [USDT]: BigInt('50000000'),
    },
    nfts: {
        [HOTDEFISUMMERNFT_ETH]: BigInt(1),
    },
} as const satisfies MockAccount;

export const mockEvmSigner: EvmSigner = {
    getAddress() {
        return mockEvmAccount.address as `0x${string}`;
    },
    async getBlock() {
        return { timestamp: BigInt(0) } as Block;
    },
    getChainId() {
        return 1;
    },
    getContract(abi, contractAddress) {
        return {
            async read<T extends ArrayLike<Arguments> = never>(
                methods: { functionName: string; args?: Arguments[] }[],
            ): Promise<T> {
                const { functionName } = methods[0];
                if (functionName === 'balanceOf') {
                    return [mockEvmAccount.balances[contractAddress] ?? BigInt(0)] as unknown as T;
                } else if (functionName === 'ownerOf') {
                    const [tokenId] = methods[0].args as [bigint];
                    return (tokenId === mockEvmAccount.nfts[HOTDEFISUMMERNFT_ETH]
                        ? [mockEvmAccount.address]
                        : ['0x1111111111111111111111111111111111111111']) as unknown as T;
                } else if (functionName === 'name') {
                    return ['name', BigInt(1)] as unknown as T;
                } else if (functionName === 'allowance') {
                    return (contractAddress === USDC
                        ? [BigInt(0)]
                        : [BigInt(MAX_UINT_256)]) as unknown as T;
                } else if (functionName === 'erc721Payment') {
                    return [USDC] as unknown as T;
                } else if (functionName === 'erc721Fee') {
                    return [BigInt(20000000)] as unknown as T;
                } else {
                    throw 'Invalid EVM contract read method';
                }
            },
            async write(method: {
                functionName: string;
                args?: Arguments[];
            }): Promise<`0x${string}`> {
                const { functionName } = method;
                const hash = MOCK_HASHES[functionName];
                if (!hash) throw 'Invalid write function name';
                return hash;
            },
        };
    },
    async signTypedData(data) {
        return '0x';
    },
    async waitForTransaction(hash, confirmations) {
        return getSuccessfulEvmRxMock(hash);
    },
};

const getMockHederaResponse = (accountId: string) => {
    return {
        transactionHash: '',
        transactionId: TransactionId.generate(accountId),
    };
};

export const mockHederaAccount = {
    address: '0.0.1' as const,
    balances: {
        [HBAR]: BigInt('100000000000'),
        [USDT_HTS]: BigInt('50000000'),
    },
    nfts: {
        [HOTDEFISUMMERNFT]: BigInt(1),
    },
} satisfies MockAccount;

export const NFT_DEPOSIT_TX_RESPONSE = {
    transactionHash: '',
    transactionId: TransactionId.withValidStart(
        AccountId.fromString(mockHederaAccount.address),
        Timestamp.fromDate(new Date(0)),
    ),
};

export const ASSOCIATION_TX_RESPONSE = {
    transactionHash: '',
    transactionId: TransactionId.withValidStart(
        AccountId.fromString(mockHederaAccount.address),
        Timestamp.fromDate(new Date(0, 1)),
    ),
};

export const mockHederaSigner: HederaSigner = {
    accountId: mockHederaAccount.address,
    async associateToken(tx: TokenAssociateTransaction) {
        return ASSOCIATION_TX_RESPONSE;
    },
    async transfer(tx: TransferTransaction) {
        if (!tx.transactionMemo) throw 'Missing transaction memo';
        const isNft = tx.transactionMemo.split('-').length > 2;
        return isNft ? NFT_DEPOSIT_TX_RESPONSE : getMockHederaResponse(mockHederaAccount.address);
    },
    async transferApprovedNft(tx: TransferTransaction) {
        return getMockHederaResponse(mockHederaAccount.address);
    },
    async approveNftAllowance(tx: AccountAllowanceApproveTransaction) {
        return getMockHederaResponse(mockHederaAccount.address);
    },
};
