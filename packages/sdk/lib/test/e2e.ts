import { HederaSdkSigner } from '../signers/hederaSdkSigner.js';
import { HashportClient } from '../clients/hashportClient/index.js';
import { createLocalEvmSigner } from '../signers/localEvmSigner.js';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { createCacheStorage } from './mocks/cacheStorage.js';
import fetch from 'cross-fetch';
import dotenv from 'dotenv';
import { BridgeParams } from '../types/api/bridge.js';

dotenv.config();

if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}

const evmPk = process.env.EVM_PRIVATE_KEY;
const evmAccountFromPk = privateKeyToAccount(`0x${evmPk}`);
const evmAccount = evmAccountFromPk.address;
const localEvmSigner = createLocalEvmSigner(sepolia, process.env.EVM_RPC_URL, evmPk);

const hederaPk = process.env.HEDERA_PRIVATE_KEY;
const hederaAccountId = process.env.HEDERA_ACCOUNT_ID;
const hederaSigner = new HederaSdkSigner(hederaAccountId, hederaPk, 'testnet');

const client = new HashportClient({
    evmSigner: localEvmSigner,
    hederaSigner,
    mode: 'testnet',
    persistOptions: { storage: createCacheStorage() },
});

const unsubscribe = client.subscribe(state => {
    const currentTxData = Array.from(state.queue.values())[0];
    const stepType = currentTxData?.steps[0]?.type?.toUpperCase();
    const asset = currentTxData?.params?.sourceAssetId;
    const sourceChain = currentTxData?.params?.sourceNetworkId;
    const targetChain = currentTxData?.params?.targetNetworkId;
    if (!stepType || !asset || !sourceChain || !targetChain) return;
    console.log(`Executing ${stepType} step for ${asset} (${sourceChain}) -> (${targetChain})`);
});

const METHODS = ['mint', 'burn', 'lock', 'unlock', 'mintERC721', 'burnERC721'] as const;

type HashportMethods = (typeof METHODS)[number];

const params: Record<HashportMethods, BridgeParams> = {
    mint: {
        sourceNetworkId: process.env.HEDERA_CHAIN_ID,
        sourceAssetId: process.env.NATIVE_HEDERA_ASSET,
        targetNetworkId: process.env.EVM_CHAIN_ID,
        amount: process.env.NATIVE_HEDERA_PORT_AMOUNT,
        recipient: evmAccount,
    },
    burn: {
        sourceNetworkId: process.env.EVM_CHAIN_ID,
        sourceAssetId: process.env.WRAPPED_EVM_ASSET,
        targetNetworkId: process.env.HEDERA_CHAIN_ID,
        amount: process.env.NATIVE_HEDERA_PORT_AMOUNT,
        recipient: hederaAccountId,
    },
    lock: {
        sourceNetworkId: process.env.EVM_CHAIN_ID,
        sourceAssetId: process.env.NATIVE_EVM_ASSET,
        targetNetworkId: process.env.HEDERA_CHAIN_ID,
        amount: process.env.NATIVE_EVM_PORT_AMOUNT,
        recipient: hederaAccountId,
    },
    unlock: {
        sourceNetworkId: process.env.HEDERA_CHAIN_ID,
        sourceAssetId: process.env.WRAPPED_HEDERA_ASSET,
        targetNetworkId: process.env.EVM_CHAIN_ID,
        amount: process.env.NATIVE_EVM_PORT_AMOUNT,
        recipient: evmAccount,
    },
    mintERC721: {
        sourceNetworkId: process.env.HEDERA_CHAIN_ID,
        sourceAssetId: process.env.NATIVE_HEDERA_NFT,
        targetNetworkId: process.env.EVM_CHAIN_ID,
        tokenId: process.env.NFT_TOKEN_ID,
        recipient: evmAccount,
    },
    burnERC721: {
        sourceNetworkId: process.env.EVM_CHAIN_ID,
        sourceAssetId: process.env.WRAPPED_EVM_NFT,
        targetNetworkId: process.env.HEDERA_CHAIN_ID,
        tokenId: process.env.NFT_TOKEN_ID,
        recipient: hederaAccountId,
    },
};

const main = async () => {
    const methodOverrides = process.argv
        .slice(2)
        .filter((arg): arg is HashportMethods => !!METHODS.find(m => m === arg));
    const methodsQueue = methodOverrides.length > 0 ? methodOverrides : METHODS;
    const confirmationIds: [HashportMethods, string][] = [];
    for (const [i, method] of methodsQueue.entries()) {
        try {
            console.log(`=== ${method.toUpperCase()} tx (${i + 1} of ${methodsQueue.length}) ===`);
            const id = await client.queueTransaction(params[method]);
            const receipt = await client.execute(id);
            if (receipt.confirmationTransactionHashOrId) {
                confirmationIds.push([method, receipt.confirmationTransactionHashOrId]);
            }
        } catch (error) {
            console.error(`${method.toUpperCase()} Transaction Failed!`, error);
        }
    }
    unsubscribe();
    if (confirmationIds.length !== methodsQueue.length) {
        const failedMethods = methodsQueue.filter(
            m => !confirmationIds.find(([method]) => method === m),
        );
        console.error('Failed to confirm the following method(s):\n', failedMethods.join(', '));
        process.exit(1);
    }
    const successfulTransactions = confirmationIds.map(([m, id]) => `${m}: ${id}`).join('\n');
    console.log(`Completed all transactions successfully!\n${successfulTransactions}`);
    process.exit(0);
};

main();
