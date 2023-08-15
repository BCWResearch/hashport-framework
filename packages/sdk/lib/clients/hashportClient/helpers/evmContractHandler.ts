import { AbiFunction } from 'abitype';
import { EvmBridgeStep } from '../../../types/api/bridge';
import { erc20ABI, erc721ABI } from '../../../constants/abi';
import { burnPermitTypes as types } from '../../../constants/permitTypes';
import { MAX_UINT_256 } from '../../../constants/units';
import { HashportTransactionState, HashportTransactionData } from '../../../types/state';
import { HashportError } from '../../../utils/error';
import { getBlockConfirmations } from '../../../constants/blockConfirmations';
import {
    formatBridgeSignatures,
    hederaAccountToBytes,
    parsePartialFunctionAbi,
    splitSignature,
    transactionIdToBytes,
} from '../../../utils/formatters';
import { assertHexString } from '../../../utils/assert';
import { BurnSignature, EvmSigner } from '../../../types/signers/evmSigner';

const METHODS = [
    'approve',
    'mint',
    'burn',
    'burnWithPermit',
    'lock',
    'unlock',
    'erc721Payment',
    'erc721Fee',
    'burnERC721',
    'mintERC721',
] as const;

type ContractMethod = (typeof METHODS)[number];

type ContractInteractionResult =
    | {
          confirmations: number;
          result: Required<Pick<HashportTransactionState, 'evmTransactionHash'>> &
              HashportTransactionState;
      }
    | { confirmations?: undefined; result: HashportTransactionState };

type _EvmContractHandler = Record<ContractMethod, () => Promise<ContractInteractionResult>>;

/**
 * Handles submitting EVM contract calls to the hashport router contract. A new instance must be
 * created for each step received from the API.
 */
export class EvmContractHandler implements _EvmContractHandler {
    signer: EvmSigner;
    step: EvmBridgeStep;
    transactionData: HashportTransactionData;
    abi: [AbiFunction];
    functionName: ContractMethod;

    constructor(signer: EvmSigner, step: EvmBridgeStep, transactionData: HashportTransactionData) {
        this.signer = signer;
        this.step = step;
        this.transactionData = transactionData;
        this.abi = parsePartialFunctionAbi(step.abi);
        const validFunctionName = METHODS.find(method => method === this.abi[0].name);
        if (!validFunctionName) {
            throw new HashportError(`Invalid function name: ${this.abi[0].name}`, 'INVALID_STATE');
        }
        this.functionName = validFunctionName;
    }

    /**
     * @private
     * Formats arguments required for submitting "burn" or "lock" transactions to the router
     * contract. For fungible transactions only.
     */
    private prepareBurnOrLockArgs() {
        const { params } = this.transactionData;
        if (!params.amount) {
            throw new HashportError('Failed to get amount for burn/lock', 'INVALID_PARAMS');
        }
        const hederaChain = BigInt(params.targetNetworkId);
        const tokenId = params.sourceAssetId;
        const amountInWei = BigInt(params.amount);
        const hederaAccountBytes = hederaAccountToBytes(params.recipient);
        return [hederaChain, tokenId, amountInWei, hederaAccountBytes];
    }

    /**
     * @private
     * Signs typed data in accordance with {@link https://eips.ethereum.org/EIPS/eip-712 EIP712} for
     * the "burnWithPermit" method.
     * @param {string} spender The router contract address
     * @param {BigInt} value The token amount to bridge, formatted in wei
     * @param {BigInt} deadline One hour past the timestamp of the current block.
     */
    private async prepareBurnSignature(
        spender: `0x${string}`,
        value: bigint,
        deadline: bigint,
    ): Promise<BurnSignature> {
        const owner = this.signer.getAddress();
        const sourceAssetId = assertHexString(this.step.wrappedToken);
        const sourceAssetContract = this.signer.getContract(erc20ABI, sourceAssetId);
        const [name, nonce] = await sourceAssetContract.read<[string, bigint]>([
            { functionName: 'name' },
            { functionName: 'nonces', args: [owner] },
        ]);
        const domain = {
            name,
            version: '1',
            chainId: this.signer.getChainId(),
            verifyingContract: sourceAssetId,
        } as const;
        const message = { owner, spender, value, nonce, deadline } as const;
        return { domain, types, message, primaryType: 'Permit' };
    }

    /**
     * @private
     * Approves an ERC20 token to the router contract. For fungible tokens, this step must be
     * completed before submitting "lock", "burn", or "burnWithPermit" transactions. For nonfungible
     * tokens, it must be completed before "burnERC721" transactions. If the token has already been
     * approved for the current amount or more, the function will return the amount without
     * performing a contract write method.
     * @param {BigInt} amount The amount to approve to the router contract.
     * @param targetAddress The address of the spender. In this case, the router contract.
     */
    private async approveERC20(
        amount: bigint,
        targetAddress: `0x${string}`,
    ): Promise<ContractInteractionResult> {
        let hash: `0x${string}`;
        if (this.transactionData.state.erc20ApprovalTransactionHash) {
            hash = this.transactionData.state.erc20ApprovalTransactionHash;
        } else {
            const owner = this.signer.getAddress();
            const spender = assertHexString(this.step.spender);
            const targetContract = this.signer.getContract(erc20ABI, targetAddress);
            const [allowance] = await targetContract.read<[bigint]>([
                { functionName: 'allowance', args: [owner, spender] },
            ]);
            if (allowance >= amount) {
                return { result: { evmApprovalAmount: allowance.toString() } };
            }
            let approvedAmount = MAX_UINT_256;
            hash = await targetContract
                .write({
                    functionName: 'approve',
                    args: [spender, approvedAmount],
                })
                .catch(() => {
                    approvedAmount = amount;
                    return targetContract.write({
                        functionName: 'approve',
                        args: [spender, approvedAmount],
                    });
                });
        }

        const receipt = await this.signer.waitForTransaction(hash);
        return { result: { erc20ApprovalTransactionHash: receipt.transactionHash } };
    }

    /**
     * @private
     * Approves a wrapped ERC721 representation of a native Hedera NFT to the router contract
     * address for burning. Must be completed before the "burnERC721" step in order to port the NFT
     * back to Hedera.
     * @param {string} erc721Address The address of the wrapped ERC721 representation.
     * @param {BigInt} nftSerial The tokenId of the ERC721 to burn (in Hedera terms, the serial number).
     * @param {string} spender The address of the spender. In this case, the router contract.
     */
    private async approveERC721(
        erc721Address: `0x${string}`,
        nftSerial: bigint,
        spender: `0x${string}`,
    ): Promise<ContractInteractionResult> {
        let hash: `0x${string}`;
        if (this.transactionData.state.erc721ApprovalTransactionHash) {
            hash = this.transactionData.state.erc721ApprovalTransactionHash;
        } else {
            const erc721Contract = this.signer.getContract(erc721ABI, erc721Address);
            hash = await erc721Contract.write({
                functionName: 'approve',
                args: [spender, nftSerial],
            });
        }

        const receipt = await this.signer.waitForTransaction(hash);
        return { result: { erc721ApprovalTransactionHash: receipt.transactionHash } };
    }

    /**
     * Handles token approvals to the router contract for both ERC20 and ERC721 tokens.
     */
    async approve(): Promise<ContractInteractionResult> {
        if (this.step.amount && this.step.target) {
            const amount = BigInt(this.step.amount);
            const targetAddress = assertHexString(this.step.target);
            return await this.approveERC20(amount, targetAddress);
        } else if (this.step.target && this.step.spender && this.step.serialNumber) {
            const erc721Address = assertHexString(this.step.target);
            const nftSerial = BigInt(this.step.serialNumber);
            const routerAddress = assertHexString(this.step.spender);
            return await this.approveERC721(erc721Address, nftSerial, routerAddress);
        } else if (
            this.transactionData.state.nftFeeAmount &&
            this.transactionData.state.nftPaymentToken
        ) {
            const amount = BigInt(this.transactionData.state.nftFeeAmount);
            const targetAddress = assertHexString(this.transactionData.state.nftPaymentToken);
            return await this.approveERC20(amount, targetAddress);
        } else {
            throw new HashportError('Missing state for approval step', 'INVALID_STATE');
        }
    }

    /**
     * Handles minting wrapped ERC20 representations of native Hedera tokens after the Hedera
     * deposit transaction has been made. Requires majority and signatures from the validators.
     */
    async mint(): Promise<ContractInteractionResult> {
        const {
            state: {
                validatorPollResult,
                hederaDepositTransactionId,
                confirmationTransactionHashOrId,
            },
        } = this.transactionData;

        let hash: `0x${string}`;
        if (confirmationTransactionHashOrId) {
            hash = assertHexString(confirmationTransactionHashOrId);
        } else {
            if (!validatorPollResult || typeof validatorPollResult === 'string') {
                throw new HashportError('Missing validator data for mint', 'INVALID_STATE');
            }
            if (validatorPollResult.isNft) {
                throw new HashportError(
                    'Validator response is for nonfungible transaction',
                    'INVALID_STATE',
                );
            }
            if (!hederaDepositTransactionId) {
                throw new HashportError(
                    'Missing deposit transaction found for mint',
                    'INVALID_STATE',
                );
            }
            const { sourceChainId, wrappedAsset, amount, recipient, signatures, routerAddress } =
                validatorPollResult;
            const routerContract = this.signer.getContract(this.abi, routerAddress);
            hash = await routerContract.write({
                functionName: 'mint',
                args: [
                    BigInt(sourceChainId),
                    transactionIdToBytes(hederaDepositTransactionId),
                    wrappedAsset,
                    recipient,
                    BigInt(amount),
                    formatBridgeSignatures(signatures),
                ],
            });
        }

        const receipt = await this.signer.waitForTransaction(hash);
        return { result: { confirmationTransactionHashOrId: receipt.transactionHash } };
    }

    /**
     * Handles unlocking native EVM assets after the wrapped Hedera representations have been
     * returned to the bridge. Requires majority and signatures from the validators.
     */
    async unlock(): Promise<ContractInteractionResult> {
        const {
            state: {
                validatorPollResult,
                hederaDepositTransactionId,
                confirmationTransactionHashOrId,
            },
        } = this.transactionData;

        let hash: `0x${string}`;
        if (confirmationTransactionHashOrId) {
            hash = assertHexString(confirmationTransactionHashOrId);
        } else {
            if (!validatorPollResult || typeof validatorPollResult === 'string') {
                throw new HashportError('Missing validator data for unlock', 'INVALID_STATE');
            }
            if (validatorPollResult.isNft) {
                throw new HashportError(
                    'Validator response is for nonfungible transaction',
                    'INVALID_STATE',
                );
            }
            if (!hederaDepositTransactionId) {
                throw new HashportError('Missing deposit transaction for unlock', 'INVALID_STATE');
            }
            const { sourceChainId, nativeAsset, amount, recipient, signatures, routerAddress } =
                validatorPollResult;
            const routerContractAddress = assertHexString(routerAddress);
            const routerContract = this.signer.getContract(this.abi, routerContractAddress);
            hash = await routerContract.write({
                functionName: 'unlock',
                args: [
                    BigInt(sourceChainId),
                    transactionIdToBytes(hederaDepositTransactionId),
                    nativeAsset,
                    BigInt(amount),
                    recipient,
                    formatBridgeSignatures(signatures),
                ],
            });
        }

        const receipt = await this.signer.waitForTransaction(hash);
        return { result: { confirmationTransactionHashOrId: receipt.transactionHash } };
    }

    /**
     * Handles burning wrapped ERC20 representations of native Hedera assets. Requires signed typed
     * data. Validators will wait a designated number of block confirmations before sending native
     * assets to the user. Note: In the case of a Hedera asset other than HBAR, the target Hedera
     * asset MUST be associated to the receiving Hedera account. Failure to do so will result in a
     * stuck transaction.
     */
    async burnWithPermit(): Promise<ContractInteractionResult> {
        const {
            state: { evmTransactionHash },
        } = this.transactionData;

        let hash: `0x${string}`;
        if (evmTransactionHash) {
            hash = evmTransactionHash;
        } else {
            if (!this.step.amount) {
                throw new HashportError('Missing amount for signature', 'INVALID_STATE');
            }
            const spender = assertHexString(this.step.target);
            const { timestamp } = await this.signer.getBlock();
            const deadline = timestamp + BigInt(60 * 60);
            const value = BigInt(this.step.amount);
            const signatureData = await this.prepareBurnSignature(spender, value, deadline);
            const signature = await this.signer.signTypedData(signatureData);
            const hederaChain = BigInt(this.transactionData.params.targetNetworkId);
            const tokenId = this.transactionData.params.sourceAssetId;
            const hederaAccountBytes = hederaAccountToBytes(this.transactionData.params.recipient);
            const { v, r, s } = splitSignature(signature);
            const routerContract = this.signer.getContract(this.abi, spender);
            hash = await routerContract.write({
                functionName: 'burnWithPermit',
                args: [hederaChain, tokenId, value, hederaAccountBytes, deadline, v, r, s],
            });
        }

        return {
            result: { evmTransactionHash: hash },
            confirmations: await getBlockConfirmations(this.signer.getChainId()),
        };
    }

    /**
     * Handles burning wrapped ERC20 representations of native Hedera assets. Requires tokens to be
     * approved to the router contract. Validators will wait a designated number of block
     * confirmations before sending native assets to the user. Note: In the case of a Hedera asset
     * other than HBAR, the target Hedera asset MUST be associated to the receiving Hedera account.
     * Failure to do so will result in a stuck transaction.
     */
    async burn(): Promise<ContractInteractionResult> {
        const {
            state: { evmTransactionHash },
        } = this.transactionData;

        let hash: `0x${string}`;
        if (evmTransactionHash) {
            hash = evmTransactionHash;
        } else {
            const args = this.prepareBurnOrLockArgs();
            const routerContractAddress = assertHexString(this.step.target);
            const routerContract = this.signer.getContract(this.abi, routerContractAddress);
            hash = await routerContract.write({ functionName: 'burn', args });
        }

        return {
            result: { evmTransactionHash: hash },
            confirmations: await getBlockConfirmations(this.signer.getChainId()),
        };
    }

    /**
     * Handles locking native EVM tokens in the router contract. Requires tokens to be approved to
     * the router contract. Validators will wait a designated number of block confirmations before
     * sending native assets to the user. Note: The target Hedera asset MUST be associated to the
     * receiving Hedera account. Failure to do so will result in a stuck transaction.
     */
    async lock(): Promise<ContractInteractionResult> {
        const {
            state: { evmTransactionHash },
        } = this.transactionData;

        let hash: `0x${string}`;
        if (evmTransactionHash) {
            hash = evmTransactionHash;
        } else {
            const args = this.prepareBurnOrLockArgs();
            const routerContractAddress = assertHexString(this.step.target);
            const routerContract = this.signer.getContract(this.abi, routerContractAddress);
            hash = await routerContract.write({ functionName: 'lock', args });
        }

        return {
            result: { evmTransactionHash: hash },
            confirmations: await getBlockConfirmations(this.signer.getChainId()),
        };
    }

    /**
     * Handles minting wrapped ERC721 representations of native Hedera NFTs. Requires majority and
     * signatures from the validators.
     */
    async mintERC721(): Promise<ContractInteractionResult> {
        const {
            state: {
                validatorPollResult,
                hederaDepositTransactionId,
                confirmationTransactionHashOrId,
            },
        } = this.transactionData;

        let hash: `0x${string}`;
        if (confirmationTransactionHashOrId) {
            hash = assertHexString(confirmationTransactionHashOrId);
        } else {
            if (!validatorPollResult || typeof validatorPollResult === 'string') {
                throw new HashportError('Missing validator data for mintERC721', 'INVALID_STATE');
            }
            if (!validatorPollResult.isNft) {
                throw new HashportError(
                    'Validator response is for fungible transaction',
                    'INVALID_STATE',
                );
            }
            if (!hederaDepositTransactionId) {
                throw new HashportError(
                    'Missing deposit transaction found for mintERC721',
                    'INVALID_STATE',
                );
            }
            const {
                sourceChainId,
                wrappedAsset,
                tokenId,
                metadata,
                recipient,
                signatures,
                routerAddress,
            } = validatorPollResult;
            const routerContract = this.signer.getContract(this.abi, routerAddress);
            hash = await routerContract.write({
                functionName: 'mintERC721',
                args: [
                    BigInt(sourceChainId),
                    transactionIdToBytes(hederaDepositTransactionId),
                    wrappedAsset,
                    BigInt(tokenId),
                    metadata,
                    recipient,
                    formatBridgeSignatures(signatures),
                ],
            });
        }

        const receipt = await this.signer.waitForTransaction(hash);
        return { result: { confirmationTransactionHashOrId: receipt.transactionHash } };
    }

    /**
     * Handles burning wrapped ERC721 representations of native Hedera NFTs. Requires both the ERC20
     * payment token and ERC721 in question to be approved to the router contract. Validators will
     * wait a designated number of block confirmations before sending the Hedera native NFT to the
     * user. Note: The target Hedera NFT MUST be associated to the receiving Hedera account.
     * Failure to do so will result in a stuck transaction.
     */
    async burnERC721(): Promise<ContractInteractionResult> {
        const {
            state: { evmTransactionHash, nftPaymentToken, nftFeeAmount },
            params,
        } = this.transactionData;

        let hash: `0x${string}`;
        if (evmTransactionHash) {
            hash = evmTransactionHash;
        } else {
            if (!params.tokenId) {
                throw new HashportError('Missing serial for burnERC721', 'INVALID_PARAMS');
            }
            if (!nftFeeAmount) {
                throw new HashportError('Missing ERC20 fee amount for burnERC721', 'INVALID_STATE');
            }
            const hederaChain = BigInt(params.targetNetworkId);
            const nftSerial = BigInt(params.tokenId);
            const routerContractAddress = assertHexString(this.step.target);
            const paymentToken = assertHexString(nftPaymentToken);
            const paymentAmount = BigInt(nftFeeAmount);
            const routerContract = this.signer.getContract(this.abi, routerContractAddress);
            hash = await routerContract.write({
                functionName: 'burnERC721',
                args: [
                    hederaChain,
                    assertHexString(params.sourceAssetId),
                    nftSerial,
                    paymentToken,
                    paymentAmount,
                    hederaAccountToBytes(params.recipient),
                ],
            });
        }

        return {
            result: { evmTransactionHash: hash },
            confirmations: await getBlockConfirmations(this.signer.getChainId()),
        };
    }

    /**
     * Performs a contract read to get the address of ERC20 payment token for porting the wrapped
     * ERC721 representation of a Hedera NFT back to Hedera.
     */
    async erc721Payment(): Promise<ContractInteractionResult> {
        const wrappedERC721Address = assertHexString(this.transactionData.params.sourceAssetId);
        const routerContractAddress = assertHexString(this.step.target);
        const routerContract = this.signer.getContract(this.abi, routerContractAddress);
        const [nftPaymentToken] = await routerContract.read<[`0x${string}`]>([
            { functionName: 'erc721Payment', args: [wrappedERC721Address] },
        ]);
        return { result: { nftPaymentToken } };
    }

    /**
     * Performs a contract read to get the amount of payment token required to complete porting a
     * wrapped ERC721 representation of a Hedera NFT back to Hedera.
     */
    async erc721Fee(): Promise<ContractInteractionResult> {
        const wrappedERC721Address = assertHexString(this.transactionData.params.sourceAssetId);
        const routerContractAddress = assertHexString(this.step.target);
        const routerContract = this.signer.getContract(this.abi, routerContractAddress);
        const [nftFeeAmount] = await routerContract.read<[bigint]>([
            { functionName: 'erc721Fee', args: [wrappedERC721Address] },
        ]);
        return { result: { nftFeeAmount: nftFeeAmount.toString() } };
    }

    /**
     * Executes the contract call for the current EVM step.
     */
    async execute() {
        return await this[this.functionName]();
    }
}
