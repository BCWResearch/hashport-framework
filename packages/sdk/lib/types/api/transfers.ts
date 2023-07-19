export type TransferParams = {
    page: number;
    pageSize: number;
    ['filter.originator']?: string;
    ['filter.timestamp']?: string;
    ['filter.tokenId']?: string;
    ['filter.transactionId']?: string;
};

export type PaginatedTransfers = {
    items: Transfer[];
    totalCount: number;
};

export type Transfer = {
    amount: string;
    isNft: boolean;
    nativeAsset: string;
    nativeChainId: number;
    originator: string;
    receiver: string;
    sourceAsset: string;
    sourceChainId: number;
    status: string;
    targetAsset: string;
    targetChainId: number;
    timestamp: string;
    transactionId: string;
    fee?: string;
    metadata?: string;
    serialNum?: number;
};
