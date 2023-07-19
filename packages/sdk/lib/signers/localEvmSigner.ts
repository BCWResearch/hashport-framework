import { Chain, createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { Arguments, BurnSignature, EvmSigner } from '../types/signers/evmSigner';

export function createLocalEvmSigner(chain: Chain, rpcUrl: string, privateKey: string): EvmSigner {
    const publicClient = createPublicClient({
        chain,
        transport: http(rpcUrl),
    });
    const evmAccountFromPk = privateKeyToAccount(`0x${privateKey}`);
    const walletClient = createWalletClient({
        account: evmAccountFromPk,
        chain,
        transport: http(rpcUrl),
    });

    return {
        getAddress(): `0x${string}` {
            return walletClient.account.address;
        },
        getChainId() {
            return publicClient.chain.id;
        },
        getContract(abi, contractAddress) {
            return {
                async read<T extends ArrayLike<Arguments>>(
                    methods: { functionName: string; args?: Arguments[] }[],
                ) {
                    return (
                        await publicClient.multicall({
                            contracts: methods.map(({ functionName, args }) => ({
                                abi,
                                address: contractAddress,
                                args,
                                functionName,
                            })),
                        })
                    ).map(({ result }) => result) as unknown as T;
                },
                async write({ functionName, args }) {
                    const { request } = await publicClient.simulateContract({
                        account: evmAccountFromPk,
                        address: contractAddress,
                        abi,
                        functionName,
                        args,
                    });
                    return await walletClient.writeContract(request);
                },
            };
        },
        async waitForTransaction(hash: `0x${string}`, confirmations?: number) {
            return await publicClient.waitForTransactionReceipt({ hash, confirmations });
        },
        async getBlock() {
            return await publicClient.getBlock();
        },
        async signTypedData(data: BurnSignature) {
            return await walletClient.signTypedData(data);
        },
    };
}
