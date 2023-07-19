import {
    TransferTransaction,
    TokenAssociateTransaction,
    Hbar,
    HbarUnit,
    NftId,
    AccountAllowanceApproveTransaction,
} from '@hashgraph/sdk';
import Long from 'long';
import { FeeTransfer } from '../../../types/api/bridge';

export class HederaTxFactory {
    accountId: string;
    constructor(accountId: string) {
        this.accountId = accountId;
    }
    createTransfer(
        recipient: string,
        amount: string,
        memo: string,
        tokenId: `${number}.${number}.${number}` | 'HBAR',
    ) {
        const amountAsLong = Long.fromString(amount);
        const adjustment = amountAsLong.neg();
        const hederaTx = new TransferTransaction().setTransactionMemo(memo);
        return tokenId === 'HBAR'
            ? hederaTx
                  .addHbarTransfer(this.accountId, Hbar.from(adjustment, HbarUnit.Tinybar))
                  .addHbarTransfer(recipient, Hbar.from(amountAsLong, HbarUnit.Tinybar))
            : hederaTx
                  .addTokenTransfer(tokenId, this.accountId, adjustment)
                  .addTokenTransfer(tokenId, recipient, amountAsLong);
    }
    createAssociation(tokenIds: string[]) {
        return new TokenAssociateTransaction().setAccountId(this.accountId).setTokenIds(tokenIds);
    }
    createNftTransfer(tokenId: string, serialNumber: string, sender: string) {
        const nftId = NftId.fromString(`${tokenId}@${serialNumber}`);
        return new TransferTransaction().addApprovedNftTransfer(nftId, sender, this.accountId);
    }
    createNftApproval(spender: string, tokenId: string, serialNumber: string) {
        const nftId = NftId.fromString(`${tokenId}@${serialNumber}`);
        return new AccountAllowanceApproveTransaction().approveTokenNftAllowance(
            nftId,
            this.accountId,
            spender,
        );
    }
    createNftFeeTransfer(
        recipient: string,
        amount: string,
        memo: string,
        feeTransfers: FeeTransfer[],
    ) {
        const tx = this.createTransfer(recipient, amount, memo, 'HBAR');
        for (const fee of feeTransfers) {
            const amount = Long.fromString(fee.amount);
            const adjustment = amount.neg();
            if (fee.tokenId === 'HBAR') {
                tx.addHbarTransfer(recipient, amount).addHbarTransfer(this.accountId, adjustment);
            } else {
                tx.addTokenTransfer(fee.tokenId, recipient, amount).addTokenTransfer(
                    fee.tokenId,
                    this.accountId,
                    adjustment,
                );
            }
        }
        return tx;
    }
}
