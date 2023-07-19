declare namespace NodeJS {
    interface ProcessEnv {
        HEDERA_PRIVATE_KEY: string;
        HEDERA_ACCOUNT_ID: string;
        HEDERA_CHAIN_ID: string;
        NATIVE_HEDERA_ASSET: string;
        WRAPPED_HEDERA_ASSET: string;
        NATIVE_HEDERA_NFT: string;
        EVM_PRIVATE_KEY: string;
        EVM_RPC_URL: string;
        EVM_CHAIN_ID: string;
        NATIVE_EVM_ASSET: string;
        WRAPPED_EVM_ASSET: string;
        WRAPPED_EVM_NFT: string;
        NATIVE_HEDERA_PORT_AMOUNT: string;
        NATIVE_EVM_PORT_AMOUNT: string;
        NFT_TOKEN_ID: string;
    }
}
