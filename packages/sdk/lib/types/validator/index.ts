export type ValidatorPollResponse =
    | FungibleValidatorPollResponse
    | NonfungibleValidatorPollResponse;

type FungibleValidatorPollResponse = {
    isNft: false;
    recipient: string;
    routerAddress: `0x${string}`;
    amount: string;
    sourceChainId: number;
    targetChainId: number;
    sourceAsset: string;
    nativeAsset: string;
    wrappedAsset: string;
    targetAsset: string;
    signatures: Array<string>;
    majority: boolean;
};
type NonfungibleValidatorPollResponse = {
    isNft: true;
    recipient: string;
    routerAddress: `0x${string}`;
    sourceChainId: number;
    targetChainId: number;
    sourceAsset: string;
    nativeAsset: string;
    wrappedAsset: string;
    targetAsset: string;
    tokenId: string;
    metadata: string;
    signatures: Array<string>;
    majority: boolean;
};
