import type {
    TokenAssociateTransaction,
    TransferTransaction,
    AccountAllowanceApproveTransaction,
    TransactionId,
} from '@hashgraph/sdk';

type HederaTxResponse = { transactionHash: string; transactionId: TransactionId };

export type HederaSigner = {
    accountId: string;
    associateToken(tx: TokenAssociateTransaction): Promise<HederaTxResponse>;
    transfer(tx: TransferTransaction): Promise<HederaTxResponse>;
    transferApprovedNft(tx: TransferTransaction): Promise<HederaTxResponse>;
    approveNftAllowance(tx: AccountAllowanceApproveTransaction): Promise<HederaTxResponse>;
};
