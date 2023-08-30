import { Transaction } from '@hashgraph/sdk';
import { HederaSigner } from 'types/signers';
import type { HashConnect, HashConnectTypes } from 'hashconnect';

export const createHashPackSigner = (
    hashconnect: HashConnect,
    pairingData: HashConnectTypes.SavedPairingData,
    // TODO: if accountIds array is unreliable, pass in directly
    // accountId: string,
): HederaSigner => {
    const accountId = pairingData.accountIds[0];
    const { network, topic } = pairingData;
    const provider = hashconnect.getProvider(network, topic, accountId);
    const signer = hashconnect.getSigner(provider);

    const executeTransaction = async (tx: Transaction) => {
        tx.freezeWithSigner(signer);
        const response = await tx.executeWithSigner(signer);
        if (response === undefined) throw 'Rejected HashPack Transaction';
        return {
            transactionHash: response.transactionHash.toString(),
            transactionId: response.transactionId,
        };
    };

    return {
        accountId,
        async associateToken(tx) {
            return await executeTransaction(tx);
        },
        async transfer(tx) {
            return await executeTransaction(tx);
        },
        async transferApprovedNft(tx) {
            return await executeTransaction(tx);
        },
        async approveNftAllowance(tx) {
            return await executeTransaction(tx);
        },
    };
};
