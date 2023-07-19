import type { TokenType } from '@hashgraph/sdk';

export type BalancesResult = {
    timestamp: string | null;
    balances: {
        account: string;
        balance: number;
        tokens: Array<{ token_id: string; balance: number }>;
    }[];
    links: Links;
};
export type BalanceInfo = {
    balance: number;
    timestamp: string;
    tokens: Array<{ token_id: string; balance: number }>;
};

export type KeyInfo = {
    _type: string;
    key: string;
};

export type AccountInfo = {
    balance?: BalanceInfo;
    account?: string;
    expiry_timestamp?: string | null;
    auto_renew_period?: number;
    key: KeyInfo;
    deleted: boolean;
};

export type TransactionsResponse = {
    transactions: TransactionsEntity[];
    links: Links;
};
export type TransactionsEntity = {
    bytes: string | null;
    charged_tx_fee: number;
    consensus_timestamp: string;
    entity_id: string | null;
    max_fee: string;
    memo_base64: string;
    name: TransactionTypes;
    node: string | null;
    nonce: number;
    parent_consensus_timestamp: string | null;
    result: string;
    scheduled: boolean;
    transaction_hash: string;
    transaction_id: string;
    transfers: TransfersEntity[];
    valid_duration_seconds: string;
    valid_start_timestamp: string;
};

export enum TransactionTypes {
    CONSENSUSCREATETOPIC = `CONSENSUSCREATETOPIC`,
    CONSENSUSDELETETOPIC = `CONSENSUSDELETETOPIC`,
    CONSENSUSSUBMITMESSAGE = `CONSENSUSSUBMITMESSAGE`,
    CONSENSUSUPDATETOPIC = `CONSENSUSUPDATETOPIC`,
    CONTRACTCALL = `CONTRACTCALL`,
    CONTRACTCREATEINSTANCE = `CONTRACTCREATEINSTANCE`,
    CONTRACTDELETEINSTANCE = `CONTRACTDELETEINSTANCE`,
    CONTRACTUPDATEINSTANCE = `CONTRACTUPDATEINSTANCE`,
    CRYPTOADDLIVEHASH = `CRYPTOADDLIVEHASH`,
    CRYPTOAPPROVEALLOWANCE = `CRYPTOAPPROVEALLOWANCE`,
    CRYPTOCREATEACCOUNT = `CRYPTOCREATEACCOUNT`,
    CRYPTODELETE = `CRYPTODELETE`,
    CRYPTODELETEALLOWANCE = `CRYPTODELETEALLOWANCE`,
    CRYPTODELETELIVEHASH = `CRYPTODELETELIVEHASH`,
    CRYPTOTRANSFER = `CRYPTOTRANSFER`,
    CRYPTOUPDATEACCOUNT = `CRYPTOUPDATEACCOUNT`,
    ETHEREUMTRANSACTION = `ETHEREUMTRANSACTION`,
    FILEAPPEND = `FILEAPPEND`,
    FILECREATE = `FILECREATE`,
    FILEDELETE = `FILEDELETE`,
    FILEUPDATE = `FILEUPDATE`,
    FREEZE = `FREEZE`,
    NODESTAKEUPDATE = `NODESTAKEUPDATE`,
    SCHEDULECREATE = `SCHEDULECREATE`,
    SCHEDULEDELETE = `SCHEDULEDELETE`,
    SCHEDULESIGN = `SCHEDULESIGN`,
    SYSTEMDELETE = `SYSTEMDELETE`,
    SYSTEMUNDELETE = `SYSTEMUNDELETE`,
    TOKENASSOCIATE = `TOKENASSOCIATE`,
    TOKENBURN = `TOKENBURN`,
    TOKENCREATION = `TOKENCREATION`,
    TOKENDELETION = `TOKENDELETION`,
    TOKENDISSOCIATE = `TOKENDISSOCIATE`,
    TOKENFEESCHEDULEUPDATE = `TOKENFEESCHEDULEUPDATE`,
    TOKENFREEZE = `TOKENFREEZE`,
    TOKENGRANTKYC = `TOKENGRANTKYC`,
    TOKENMINT = `TOKENMINT`,
    TOKENPAUSE = `TOKENPAUSE`,
    TOKENREVOKEKYC = `TOKENREVOKEKYC`,
    TOKENUNFREEZE = `TOKENUNFREEZE`,
    TOKENUNPAUSE = `TOKENUNPAUSE`,
    TOKENUPDATE = `TOKENUPDATE`,
    TOKENWIPE = `TOKENWIPE`,
    UNCHECKEDSUBMIT = `UNCHECKEDSUBMIT`,
    UNKNOWN = `UNKNOWN`,
    UTILPRNG = `UTILPRNG`,
}

export type TransfersEntity = {
    account: string;
    amount: number;
    is_approval: boolean;
};

export type Links = {
    next: null | string;
};

export type MirrorNodeToken = {
    token_id: string;
    symbol: string;
    admin_key: KeyInfo;
    type: TokenType;
};
export type MirrorNodeNft = {
    account_id: string;
    created_timestamp: string;
    deleted: boolean;
    metadata: string;
    modified_timestamp: string;
    serial_number: number;
    token_id: string;
};

export type MirrorNodeAccountNfts = {
    nfts: MirrorNodeNft[];
    links: Links;
};

export type NftMetadata = {
    name: string;
    creator?: string;
    creatorDID?: string;
    description: string;
    image: string;
    attributes?: unknown[];
    external_url?: string;
};

export type TokenInfoResponse = {
    admin_key: {
        _type: string;
        key: string;
    };
    auto_renew_account: string;
    auto_renew_period: number;
    created_timestamp: string;
    custom_fees?: {
        created_timestamp: string;
        fixed_fees: unknown[];
        fractional_fees: unknown[];
    };
    decimals: string;
    expiry_timestamp: null | unknown;
    fee_schedule_key: null | unknown;
    freeze_default: boolean;
    freeze_key: null | unknown;
    initial_supply: string;
    kyc_key: null | unknown;
    modified_timestamp: string;
    name: string;
    supply_key: {
        _type: string;
        key: string;
    };
    symbol: string;
    token_id: string;
    total_supply: string;
    treasury_account_id: string;
    type: string;
    wipe_key: null | unknown;
    pause_key: null | unknown;
    pause_status: string;
};

export type AccountsInfoResponse = {
    accounts: AccountsEntity[];
    links: {
        next?: null;
    };
};

export type TokensInfoResponse = {
    tokens: MirrorNodeToken[];
    links: Links;
};
export type AccountsEntity = {
    account: string;
    auto_renew_period: number;
    balance: BalanceInfo;
    deleted: boolean;
    expiry_timestamp?: null;
    key: {
        _type: string;
        key: string;
    };
    max_automatic_token_associations?: null;
    memo: string;
    receiver_sig_required?: null;
};

export type AccountsQueryParams = {
    ['account.balance']: string;
    ['account.id']: string;
    ['account.publickey']: string;
    balance: boolean;
    limit: number;
    order: 'asc' | 'desc';
};

export type BalancesQueryParams = {
    ['account.balance']: string;
    ['account.id']: string;
    ['account.publickey']: string;
    timestamp: string;
    limit: number;
};

export type TransactionsQueryParams = {
    transactionType: TransactionTypes;
    ['account.id']: string;
    timestamp: string;
    result: 'fail' | 'success';
    type: 'credit' | 'debit';
    limit: number;
    order: 'asc' | 'desc';
};

export type TokensQueryParams = {
    publickey: string;
    ['token.id']: string;
    ['account.id']: string;
    type: 'ALL' | 'FUNGIBLE_COMMON' | 'NON_FUNGIBLE_UNIQUE';
    limit: number;
    order: 'asc' | 'desc';
};

export type TokenRelationshipResponse = {
    tokens: TokenRelationship[];
    links: Links;
};

export type TokenRelationship = {
    automatic_association: boolean;
    balance: number;
    created_timestamp: number;
    freeze_status: 'NOT_APPLICABLE' | 'FROZEN' | 'UNFROZEN';
    kyc_status: 'NOT_APPLICABLE' | 'GRANTED' | 'REVOKED';
    token_id: string;
};

export type Nfts = {
    nfts: Nft[];
    links: Links;
};

export type Nft = {
    account_id: string;
    created_timestamp: string;
    delegating_spender: string | null;
    deleted: boolean;
    metadata: string;
    modified_timestamp: string;
    serial_number: number;
    spender: string | null;
    token_id: string;
};

export type AccountNftsQueryParams = {
    accountId: string;
    ['token.id']?: string;
    serialnumber?: number;
    ['spender.id']?: string;
    limit?: number;
    order?: 'asc' | 'desc';
};
