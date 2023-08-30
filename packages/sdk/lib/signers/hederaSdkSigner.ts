import {
    Client,
    Transaction,
    TokenAssociateTransaction,
    TransferTransaction,
    AccountAllowanceApproveTransaction,
} from '@hashgraph/sdk';
import { HederaSigner } from 'types/signers/hederaSigner';

export class HederaSdkSigner implements HederaSigner {
    accountId: string;
    client: Client;
    constructor(
        operatorAccountId: string,
        privateKey: string,
        mode: 'mainnet' | 'testnet' = 'mainnet',
    ) {
        this.accountId = operatorAccountId;
        this.client = Client[mode === 'mainnet' ? 'forMainnet' : 'forTestnet']().setOperator(
            operatorAccountId,
            privateKey,
        );
    }
    private async executeTransaction(tx: Transaction) {
        tx.freezeWith(this.client);
        const response = await tx.execute(this.client);
        await response.getReceipt(this.client);
        return {
            transactionHash: response.transactionHash.toString(),
            transactionId: response.transactionId,
        } as const;
    }
    async associateToken(tx: TokenAssociateTransaction) {
        return await this.executeTransaction(tx);
    }
    async transfer(tx: TransferTransaction) {
        return await this.executeTransaction(tx);
    }
    async transferApprovedNft(tx: TransferTransaction) {
        return await this.executeTransaction(tx);
    }
    async approveNftAllowance(tx: AccountAllowanceApproveTransaction) {
        return await this.executeTransaction(tx);
    }
}
