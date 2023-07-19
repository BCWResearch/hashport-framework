import { Abi, Block, TransactionReceipt } from 'viem';
import { burnPermitTypes } from '../../constants/permitTypes';

export type Arguments = string | number | boolean | bigint | `0x${string}`[];

export type ContractInstance = {
    read<T extends ArrayLike<Arguments> = never>(
        methods: { functionName: string; args?: Arguments[] }[],
    ): Promise<T>;
    write(method: { functionName: string; args?: Arguments[] }): Promise<`0x${string}`>;
};

export type BurnSignature = {
    domain: {
        name: string;
        version: '1';
        chainId: number;
        verifyingContract: `0x${string}`;
    };
    types: typeof burnPermitTypes;
    message: {
        owner: `0x${string}`;
        spender: `0x${string}`;
        value: bigint;
        nonce: bigint;
        deadline: bigint;
    };
    primaryType: 'Permit';
};

export type EvmSigner = {
    getAddress(): `0x${string}`;
    getContract(abi: Abi, contractAddress: `0x${string}`): ContractInstance;
    waitForTransaction(hash: `0x${string}`, confirmations?: number): Promise<TransactionReceipt>;
    getBlock(): Promise<Block>;
    getChainId(): number;
    signTypedData(data: BurnSignature): Promise<`0x${string}`>;
};
