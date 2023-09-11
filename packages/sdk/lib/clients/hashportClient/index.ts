import type { TransferTransaction } from '@hashgraph/sdk';
import { isHex } from 'viem';
import { EvmContractHandler } from './helpers/evmContractHandler.js';
import { createHashportStore } from './helpers/hashportTransactionStore.js';
import { HederaTxFactory } from './helpers/hederaTxFactory.js';
import { HashportApiClient } from 'clients/hashportApiClient/index.js';
import { MirrorNodeClient } from 'clients/mirrorNodeClient/index.js';
import { erc20ABI, erc721ABI } from 'constants/abi.js';
import { HashportTransactionData, HashportTransactionState } from 'types/state';
import { BridgeParams, EvmBridgeStep, HederaBridgeStep, PollBridgeStep } from 'types/api/bridge';
import { HashportClientConfig } from 'types/clients';
import { EvmSigner } from 'types/signers/evmSigner';
import { HederaSigner } from 'types/signers/hederaSigner';
import { ValidatorPollResponse } from 'types/validator';
import { assertHederaTokenId, assertHexString } from 'utils/assert.js';
import { sleep } from 'utils/async.js';
import { HashportError } from 'utils/error.js';
import { Fetcher } from 'utils/fetch.js';
import { formatPollingId, formatTransactionId, formatUrl } from 'utils/formatters.js';
import { Logger } from 'utils/logger.js';

/**
 * Initializes a client for validating and executing bridging operations on hashport.
 */
export class HashportClient {
    protected logger: Logger;
    apiClient: HashportApiClient;
    mirrorNodeClient: MirrorNodeClient;
    mode: 'mainnet' | 'testnet';
    evmSigner: EvmSigner;
    hederaSigner: HederaSigner;
    transactionStore: ReturnType<ReturnType<typeof createHashportStore>['getState']>;
    subscribe: ReturnType<typeof createHashportStore>['subscribe'];

    constructor({
        evmSigner,
        hederaSigner,
        mode = 'mainnet',
        customMirrorNodeCredentials,
        customMirrorNodeUrl,
        debug = false,
        persistOptions,
    }: HashportClientConfig) {
        this.evmSigner = evmSigner;
        this.hederaSigner = hederaSigner;
        this.mode = mode;
        this.apiClient = new HashportApiClient(mode);
        const store = createHashportStore(persistOptions);
        this.transactionStore = store.getState();
        this.subscribe = store.subscribe;
        this.mirrorNodeClient = new MirrorNodeClient(
            mode,
            customMirrorNodeUrl,
            customMirrorNodeCredentials,
        );
        this.logger = new Logger(debug);
    }

    /**
     * @private
     * Checks that the user has sufficient fungible token balance for the transaction.
     */
    private async checkFungibleBalances(sourceAsset: string, amount: bigint) {
        let isSufficientBalance: boolean;
        if (isHex(sourceAsset)) {
            const sourceAssetContract = this.evmSigner.getContract(erc20ABI, sourceAsset);
            const [balance] = await sourceAssetContract.read<[bigint]>([
                { functionName: 'balanceOf', args: [this.evmSigner.getAddress()] },
            ]);
            isSufficientBalance = balance >= amount;
        } else {
            const hederaAsset = assertHederaTokenId(sourceAsset);
            const { balances } = await this.mirrorNodeClient.getBalances({
                ['account.id']: this.hederaSigner.accountId,
            });
            const balance =
                hederaAsset === 'HBAR'
                    ? balances[0].balance
                    : balances[0].tokens.find(({ token_id }) => token_id === sourceAsset)?.balance;
            isSufficientBalance = !!balance && balance >= amount;
        }
        if (!isSufficientBalance) {
            throw new HashportError(`Insufficient ${sourceAsset} balance`, 'PORTING_EXECUTION');
        }
    }

    /**
     * @private
     * Checks the ownership of the given NFT serial.
     */
    private async checkNftOwnership(sourceAsset: string, tokenIdOrSerial: string) {
        if (isHex(sourceAsset)) {
            const sourceAssetContract = this.evmSigner.getContract(erc721ABI, sourceAsset);
            const [owner] = await sourceAssetContract.read<[`0x${string}`]>([
                {
                    functionName: 'ownerOf',
                    args: [BigInt(tokenIdOrSerial)],
                },
            ]);
            const evmAccount = this.evmSigner.getAddress();
            const isOwner = owner.toLowerCase() === evmAccount.toLowerCase();
            if (!isOwner) {
                throw new HashportError(
                    `${evmAccount} does not own ${sourceAsset} #${tokenIdOrSerial}`,
                    'PORTING_EXECUTION',
                );
            }
        } else {
            const nftInfo = await this.mirrorNodeClient.getNftInfoBySerial(
                sourceAsset,
                tokenIdOrSerial,
            );
            const hederaAccount = this.hederaSigner.accountId;
            const isOwner = nftInfo.account_id === hederaAccount;
            if (!isOwner) {
                throw new HashportError(
                    `${hederaAccount} does not own ${sourceAsset} #${tokenIdOrSerial}`,
                    'PORTING_EXECUTION',
                );
            }
        }
    }

    /**
     * @private
     * Verifies that the user has the proper fungible balance or NFT serial ownership.
     */
    private async verifyBalances(params: BridgeParams) {
        if (params.amount) {
            // Fungible Transactions
            await this.checkFungibleBalances(params.sourceAssetId, BigInt(params.amount));
        } else if (params.tokenId) {
            // Nonfungible Transactions
            await this.checkNftOwnership(params.sourceAssetId, params.tokenId);
        }
    }

    /**
     * Validates and queues a hashport bridging transaction.
     */
    async queueTransaction(params: BridgeParams): Promise<string> {
        const isValid = await this.apiClient.validateBridgeParams(params);
        if (!isValid.valid) {
            throw new HashportError(isValid.message, 'INVALID_PARAMS');
        }
        await this.verifyBalances(params);
        const steps = await this.apiClient.bridge(params);
        const transactionStateId = this.transactionStore.queueTransaction(params, steps);
        return transactionStateId;
    }

    /**
     * Executes all the necessary contract calls for a given hashport transaction.
     * @param {string} id The internal id of the hashport transaction
     * @returns {Promise<Object>} The final state of the completed transactions. Useful for
     * building a confirmation receipt.
     */
    async execute(id: string): Promise<HashportTransactionData['state']> {
        const { steps, params } = this.transactionStore.getTransactionData(id);
        if (
            params.recipient.toLowerCase() !== this.evmSigner.getAddress().toLowerCase() &&
            params.recipient !== this.hederaSigner.accountId
        ) {
            throw new HashportError(
                'Recipient does not match any connected account',
                'INVALID_PARAMS',
            );
        }
        const requiresBalanceCheck = steps.some(
            step =>
                'amount' in step ||
                // Represents burnERC721
                (step.type === 'evm' && params.tokenId && !isHex(params.recipient)),
        );
        if (requiresBalanceCheck) {
            await this.verifyBalances(params);
        }
        for (const step of steps) {
            let result: HashportTransactionState;
            switch (step.type) {
                case 'evm': {
                    result = await this.handleEvmStep(step, id);
                    break;
                }
                case 'Hedera': {
                    result = await this.handleHederaStep(step, id);
                    break;
                }
                case 'poll': {
                    result = await this.handlePollStep(step, id);
                    break;
                }
                default: {
                    throw new HashportError('Invalid step', 'INVALID_STATE');
                }
            }
            this.transactionStore.updateTransactionState(id, result, true);
        }
        const { state } = this.transactionStore.getTransactionData(id);
        if (!state.confirmationTransactionHashOrId) {
            throw new HashportError('Missing confirmation hash/id', 'INVALID_STATE');
        }
        const receiptCopy = { ...state };
        this.transactionStore.deleteTransaction(id);
        return receiptCopy;
    }

    /**
     * Executes all the hashport transaction that are in the queue. Returns completed state from
     * each transaction.
     */
    async executeAll() {
        if (this.transactionStore.queue.size === 0) {
            throw new HashportError('No transactions have been queued.', 'INVALID_STATE');
        }
        const completedTransactions: HashportTransactionData['state'][] = [];
        for (const [id] of this.transactionStore.queue) {
            try {
                const confirmation = await this.execute(id);
                completedTransactions.push(confirmation);
            } catch (error) {
                this.logger.error(error);
            }
        }
        return completedTransactions;
    }

    /**
     * @private
     * Checks token association for a given Hedera token. If the token is not associated,
     * the token will be associated automatically. Returns null if the token is already associated,
     * or the transaction id of the successful association transaction.
     */
    private async handleTokenAssociation(id: string, tokenId: string) {
        if (tokenId === 'HBAR') return null;
        const hederaTokenId = assertHederaTokenId(tokenId);
        const hederaTxFactory = new HederaTxFactory(this.hederaSigner.accountId);
        const isAssociated = await this.mirrorNodeClient.checkTokenAssociation(
            this.hederaSigner.accountId,
            hederaTokenId,
        );
        if (!isAssociated) {
            this.transactionStore.updateTransactionState(id, {
                tokenAssociationStatus: 'ASSOCIATING',
            });
            const associateTx = hederaTxFactory.createAssociation([hederaTokenId]);
            const associateRx = await this.hederaSigner.associateToken(associateTx);
            // Confirm association with exponential backoff
            for (let i = 0; i < 5; i++) {
                try {
                    const transactionsResult = await this.mirrorNodeClient.getTransactions({
                        transactionId: formatTransactionId(associateRx.transactionId),
                    });
                    const successfulTx = transactionsResult?.transactions?.find(
                        ({ name, result }) => name === 'TOKENASSOCIATE' && result === 'SUCCESS',
                    );
                    if (successfulTx) {
                        return successfulTx.transaction_id;
                    }
                } catch (error) {
                    this.logger.error(error);
                }
                await sleep(2 ** i * 1000);
            }
            throw new HashportError('Failed to confirm token association', 'PORTING_EXECUTION');
        }
        return null;
    }

    /**
     * @private
     * Executes steps related to the Hedera network: token association and checks, deposit
     * transactions, NFT approvals, and NFT transfers.
     */
    private async handleHederaStep(
        step: HederaBridgeStep,
        id: string,
    ): Promise<HashportTransactionState> {
        const hederaTxFactory = new HederaTxFactory(this.hederaSigner.accountId);
        if (step.tokenId && step.target === 'AccountBalanceQuery') {
            const associationResult = await this.handleTokenAssociation(id, step.tokenId);
            return { tokenAssociationStatus: associationResult || 'ALREADY_ASSOCIATED' };
        } else if (step.amount) {
            const transactionData = this.transactionStore.getTransactionData(id);
            if (!transactionData) {
                throw new HashportError(`Missing porting state: ${id}`, 'INVALID_STATE');
            }
            const { state, params } = transactionData;
            if (state?.hederaDepositTransactionId && state?.validatorPollingId) {
                const { hederaDepositTransactionId, validatorPollingId } = state;
                return { hederaDepositTransactionId, validatorPollingId };
            }
            let transferTx: TransferTransaction;
            if (params.tokenId) {
                // NFT Deposit Transaction
                transferTx = hederaTxFactory.createNftFeeTransfer(
                    step.target,
                    step.amount,
                    step.memo,
                    step.feeTransfers || [],
                );
            } else {
                // FT Deposit Transaction
                const { sourceAssetId } = params;
                if (isHex(sourceAssetId))
                    throw new HashportError(
                        `Invalid source asset for hedera transaction: ${sourceAssetId}`,
                        'INVALID_STATE',
                    );
                transferTx = hederaTxFactory.createTransfer(
                    step.target,
                    step.amount,
                    step.memo,
                    assertHederaTokenId(sourceAssetId),
                );
            }
            const transferResult = await this.hederaSigner.transfer(transferTx);
            const txId = formatTransactionId(transferResult.transactionId);
            return {
                hederaDepositTransactionId: txId,
                validatorPollingId: txId,
            };
        } else if (
            step.spender &&
            step.tokenId &&
            step.serialNumber &&
            step.target === 'CryptoApproveAllowance'
        ) {
            const approveNft = hederaTxFactory.createNftApproval(
                step.spender,
                step.tokenId,
                step.serialNumber,
            );
            const transferResult = await this.hederaSigner.approveNftAllowance(approveNft);
            const txId = formatTransactionId(transferResult.transactionId);
            return {
                nftApprovalTransactionId: txId,
            };
        } else if (step.tokenId && step.target && step.receiver && step.serialNumber) {
            const nftTransfer = hederaTxFactory.createNftTransfer(
                step.tokenId,
                step.serialNumber,
                step.target,
            );
            const transferResult = await this.hederaSigner.transferApprovedNft(nftTransfer);
            return {
                confirmationTransactionHashOrId: transferResult.transactionId.toString(),
            };
        } else {
            throw new HashportError('Invalid Hedera step', 'INVALID_STATE');
        }
    }

    /**
     * @private
     * Executes contract methods on the router contract.
     */
    private async handleEvmStep(
        step: EvmBridgeStep,
        id: string,
    ): Promise<HashportTransactionState> {
        const transactionData = this.transactionStore.getTransactionData(id);
        const {
            params: { sourceAssetId, sourceNetworkId, targetNetworkId },
        } = transactionData;
        // Check for Hedera token association
        if (isHex(sourceAssetId)) {
            const sourceAsset = await this.apiClient.networkAssets(
                parseInt(sourceNetworkId),
                sourceAssetId,
            );
            const targetAsset = sourceAsset?.bridgeableNetworks?.[targetNetworkId]?.wrappedAsset;
            if (targetAsset) await this.handleTokenAssociation(id, targetAsset);
        }
        const contractHandler = new EvmContractHandler(this.evmSigner, step, transactionData);
        const { result, confirmations } = await contractHandler.execute();
        if (confirmations !== undefined) {
            const { evmTransactionHash } = result;
            this.transactionStore.updateTransactionState(id, { evmTransactionHash });
            const receipt = await this.evmSigner.waitForTransaction(
                evmTransactionHash,
                confirmations,
            );
            const routerContractAddress = assertHexString(step.target);
            const pollingId = formatPollingId(receipt, routerContractAddress);
            return {
                evmTransactionHash: evmTransactionHash,
                validatorPollingId: pollingId,
            };
        } else {
            return { ...result };
        }
    }

    /**
     * @private
     * Queries the validators to either get transaction confirmation or to get the signatures
     * required to complete a bridging operation.
     */
    private async handlePollStep(
        step: PollBridgeStep,
        id: string,
    ): Promise<HashportTransactionState> {
        const { validatorPollingId } = this.transactionStore.getTransactionData(id).state;
        if (!validatorPollingId) throw new HashportError('Missing polling id', 'INVALID_STATE');
        const pollingUrl = formatUrl(step.target, validatorPollingId);
        const POLLING_INTERVAL = step.polling * 1000;
        const THREE_MINUTES = 180000 / POLLING_INTERVAL;
        for (let i = 0; i < THREE_MINUTES; i++) {
            try {
                const validatorResponse = await new Fetcher<ValidatorPollResponse | string>(
                    pollingUrl,
                );
                if (typeof validatorResponse === `string`) {
                    const result = await this.mirrorNodeClient.getTransactions({
                        transactionId: validatorResponse,
                    });
                    const successfulTx = result.transactions.find(
                        ({ name, result }) =>
                            (name === 'CRYPTOTRANSFER' || name === 'CRYPTOAPPROVEALLOWANCE') &&
                            result === 'SUCCESS',
                    );
                    if (successfulTx) {
                        return {
                            confirmationTransactionHashOrId: validatorResponse,
                        };
                    }
                } else if (validatorResponse?.majority) {
                    return { validatorPollResult: validatorResponse };
                }
            } catch (error) {
                this.logger.error(error);
            }
            await sleep(POLLING_INTERVAL);
        }
        throw new HashportError('Polling timeout', 'PORTING_EXECUTION');
    }
}
