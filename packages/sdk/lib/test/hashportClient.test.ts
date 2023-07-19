import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as AsyncUtils from '../utils/async.js';
import { HashportClient } from '../clients/hashportClient/index.js';
import {
    MOCK_HASHES,
    NFT_DEPOSIT_TX_RESPONSE,
    mockEvmSigner,
    mockHederaSigner,
} from './mocks/mockSigners.js';
import {
    INSUFFICIENT_BALANCE_PARAMS,
    WRONG_NFT_OWNER_PARAMS,
    WRONG_RECIPIENT_PARAMS,
    bridgeParamsMock,
} from './mockData/api/bridge.js';
import { createCacheStorage } from './mocks/cacheStorage.js';
import { BRIDGE_PAYOUT_CONFIRMATION } from './mocks/constants.js';
import { formatTransactionId } from '../utils/formatters.js';

vi.mock('../lib/utils/async', async importOriginal => {
    const asyncUtilsModule = await importOriginal<typeof AsyncUtils>();
    return {
        ...asyncUtilsModule,
        sleep: async (ms: number) => ms,
    };
});

beforeEach<{ client: HashportClient }>(ctx => {
    ctx.client = new HashportClient({
        evmSigner: mockEvmSigner,
        hederaSigner: mockHederaSigner,
        persistOptions: { storage: createCacheStorage() },
    });
});

describe('Hashport Client', () => {
    test<{ client: HashportClient }>('should throw with insufficient balance', async ({
        client,
    }) => {
        await expect(client.queueTransaction(INSUFFICIENT_BALANCE_PARAMS)).rejects.toThrowError(
            'Insufficient',
        );
    });
    test<{ client: HashportClient }>('should throw if recipient does not match', async ({
        client,
    }) => {
        const id = await client.queueTransaction(WRONG_RECIPIENT_PARAMS);
        await expect(client.execute(id)).rejects.toThrowError('Recipient does not match');
    });
    test<{ client: HashportClient }>('should throw if not owner of nft', async ({ client }) => {
        await expect(client.queueTransaction(WRONG_NFT_OWNER_PARAMS)).rejects.toThrowError(
            'does not own',
        );
    });
    test<{ client: HashportClient }>('should execute mint', async ({ client }) => {
        const id = await client.queueTransaction(bridgeParamsMock.mint);
        const confirmation = await client.execute(id);
        expect(confirmation.confirmationTransactionHashOrId).toBe(MOCK_HASHES.mint);
        expect(confirmation.validatorPollResult).toBeTypeOf('object');
        expect(confirmation.validatorPollingId).toBeTypeOf('string');
    });
    test<{ client: HashportClient }>('should execute burn', async ({ client }) => {
        const id = await client.queueTransaction(bridgeParamsMock.burn);
        const confirmation = await client.execute(id);
        expect(confirmation.confirmationTransactionHashOrId).toBe(BRIDGE_PAYOUT_CONFIRMATION);
        expect(confirmation.validatorPollingId).not.toBe(undefined);
        expect(confirmation.evmTransactionHash).toBe(MOCK_HASHES.burnWithPermit);
    });
    test<{ client: HashportClient }>('should execute lock, approve, and associate', async ({
        client,
    }) => {
        const id = await client.queueTransaction(bridgeParamsMock.lock);
        const confirmation = await client.execute(id);
        expect(confirmation.confirmationTransactionHashOrId).toBe(BRIDGE_PAYOUT_CONFIRMATION);
        expect(confirmation.erc20ApprovalTransactionHash).toBe(MOCK_HASHES.approve);
        expect(confirmation.tokenAssociationStatus).not.toBe('ALREADY_ASSOCIATED');
        expect(confirmation.evmTransactionHash).toBe(MOCK_HASHES.lock);
    });
    test<{
        client: HashportClient;
    }>('should execute lock with previously approved token', async ({ client }) => {
        const id = await client.queueTransaction(bridgeParamsMock.lockAssociated);
        const confirmation = await client.execute(id);
        expect(confirmation.tokenAssociationStatus).toBe('ALREADY_ASSOCIATED');
    });
    test<{ client: HashportClient }>('should execute unlock', async ({ client }) => {
        const id = await client.queueTransaction(bridgeParamsMock.unlock);
        const confirmation = await client.execute(id);
        expect(confirmation.confirmationTransactionHashOrId).toBe(MOCK_HASHES.unlock);
        expect(confirmation.validatorPollResult).toBeTypeOf('object');
        expect(confirmation.validatorPollingId).toBeTypeOf('string');
    });
    test<{ client: HashportClient }>('should execute mintERC721', async ({ client }) => {
        const id = await client.queueTransaction(bridgeParamsMock.mintERC721);
        const confirmation = await client.execute(id);
        expect(confirmation.confirmationTransactionHashOrId).toBeTypeOf('string');
        expect(confirmation.nftApprovalTransactionId).toBeTypeOf('string');
        expect(confirmation.hederaDepositTransactionId).toBe(
            formatTransactionId(NFT_DEPOSIT_TX_RESPONSE.transactionId),
        );
        expect(confirmation.nftApprovalTransactionId).toBeTypeOf('string');
        expect(confirmation.validatorPollingId).toBe(
            formatTransactionId(NFT_DEPOSIT_TX_RESPONSE.transactionId),
        );
    });
    test<{ client: HashportClient }>('should execute burnERC721', async ({ client }) => {
        const id = await client.queueTransaction(bridgeParamsMock.burnERC721);
        const confirmation = await client.execute(id);
        expect(confirmation.confirmationTransactionHashOrId).toBeTypeOf('string');
        expect(confirmation.erc721ApprovalTransactionHash).toBe(MOCK_HASHES.approve);
        expect(confirmation.erc20ApprovalTransactionHash).toBe(MOCK_HASHES.approve);
        expect(confirmation.nftFeeAmount).toBeDefined();
        expect(confirmation.nftPaymentToken).toBeDefined();
        expect(confirmation.evmTransactionHash).toBe(MOCK_HASHES.burnERC721);
    });
    test<{ client: HashportClient }>('should not submit more than one deposit', async ({
        client,
    }) => {
        const subscriptionSpy = vi.fn();
        const id = await client.queueTransaction(bridgeParamsMock.mint);
        const unsubscribe = client.subscribe(state => {
            subscriptionSpy(state.queue.get(id)?.state.hederaDepositTransactionId);
        });
        const confirmation = await client.execute(id);
        expect(subscriptionSpy).toHaveBeenLastCalledWith(undefined);
        expect(
            subscriptionSpy.mock.calls.every(
                depositTxId =>
                    !depositTxId || confirmation.hederaDepositTransactionId === depositTxId,
            ),
        );
        unsubscribe();
    });
});
