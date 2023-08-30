/// <reference types="vite/client"/>

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_EVM_PRIVATE_KEY: string;
    readonly VITE_EVM_RPC_URL: string;
    readonly VITE_EVM_CHAIN_ID: string;
    readonly VITE_HEDERA_ACCOUNT_ID: string;
    readonly VITE_HEDERA_PRIVATE_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
