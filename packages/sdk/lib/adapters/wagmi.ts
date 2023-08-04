import { PublicClient, WalletClient } from 'wagmi';
import { Arguments, EvmSigner } from '../types/signers';

export const createWagmiSigner = (
    publicClient: PublicClient,
    walletClient: WalletClient,
): EvmSigner => {
    return {
        getAddress() {
            return walletClient.account.address;
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
                        account: walletClient.account,
                        address: contractAddress,
                        abi,
                        functionName,
                        args,
                    });
                    return await walletClient.writeContract(request);
                },
            };
        },
        async waitForTransaction(hash, confirmations) {
            return await publicClient.waitForTransactionReceipt({ hash, confirmations });
        },
        async getBlock() {
            return await publicClient.getBlock();
        },
        getChainId() {
            return publicClient.chain.id;
        },
        signTypedData(data) {
            return walletClient.signTypedData(data);
        },
    };
};
