export type BridgeParams = FungibleBridgeParams | NonfungibleBridgeParams;

type FungibleBridgeParams = BridgeParamsBase & {
    amount: string;
    tokenId?: never;
};

type NonfungibleBridgeParams = BridgeParamsBase & {
    tokenId: string;
    amount?: never;
};

type BridgeParamsBase = {
    sourceNetworkId: string;
    sourceAssetId: string;
    targetNetworkId: string;
    recipient: string;
};

export type FeeTransfer = {
    amount: string;
    tokenId: string;
};

export type StepType = 'evm' | 'Hedera' | 'poll';

export type BridgeStep = EvmBridgeStep | HederaBridgeStep | PollBridgeStep;

export type EvmBridgeStep = {
    type: 'evm';
    abi: string;
    amount?: string;
    target?: string;
    receiver?: string;
    targetChain?: number;
    wrappedToken?: string;
    networkId?: number;
    spender?: string;
    serialNumber?: string;
    tokenId?: never;
};

export type HederaBridgeStep = { type: 'Hedera' } & (
    | CryptoAllowanceStep
    | NftFeeTransfersStep
    | HederaTransfer
    | ApprovedNftAllowanceStep
    | TokenAssociationStep
);

export type CryptoAllowanceStep = {
    tokenId: string;
    target: string;
    spender: string;
    serialNumber: string;
    amount?: never;
    memo?: never;
    feeTransfers?: never;
    receiver?: never;
};

export type NftFeeTransfersStep = {
    amount: string;
    target: string;
    memo: string;
    feeTransfers: FeeTransfer[];
    tokenId?: never;
    spender?: never;
    serialNumber?: never;
    receiver?: never;
};

export type HederaTransfer = {
    amount: string;
    target: string;
    memo: string;
    tokenId?: never;
    spender?: never;
    serialNumber?: never;
    feeTransfers?: never;
    receiver?: never;
};

export type ApprovedNftAllowanceStep = {
    tokenId: string;
    target: string;
    receiver: string;
    serialNumber: string;
    amount?: never;
    spender?: never;
    memo?: never;
    feeTransfers?: never;
};

export type TokenAssociationStep = {
    tokenId: string;
    target: 'AccountBalanceQuery';
    amount?: never;
    spender?: never;
    serialNumber?: never;
    memo?: never;
    feeTransfers?: never;
    receiver?: never;
};

export type PollBridgeStep = {
    type: 'poll';
    target: string;
    polling: number;
};

export type BridgeValidation =
    | { valid: true; message?: never; statusCode?: never }
    | { message: string; statusCode: number; valid?: never };
