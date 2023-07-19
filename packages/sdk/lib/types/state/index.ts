import { BridgeParams, BridgeStep } from '../api/bridge';
import { ValidatorPollResponse } from '../validator';

export type HashportTransactionState = Partial<{
    hederaDepositTransactionId: string;
    evmTransactionHash: `0x${string}`;
    erc20ApprovalTransactionHash: `0x${string}`;
    erc721ApprovalTransactionHash: `0x${string}`;
    evmApprovalAmount: string;
    confirmationTransactionHashOrId: string;
    validatorPollResult: string | ValidatorPollResponse;
    validatorPollingId: string;
    tokenAssociationStatus: string;
    nftPaymentToken: `0x${string}`;
    nftFeeAmount: string;
    nftApprovalTransactionId: string;
}>;

export type HashportTransactionData = {
    params: BridgeParams;
    state: HashportTransactionState;
    steps: BridgeStep[];
};
