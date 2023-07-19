export type CustomFee = {
  fee: string;
  paymentToken: string;
};

export type NonFungibleTokenFee = {
  customFees: CustomFee[] | null;
  fee: string;
  isNative: boolean;
  paymentToken: string;
};

// 1st key = nft's chain id
// 2nd key = nft's token id / address
export type NftFees = Record<string, Record<string, NonFungibleTokenFee>>;
