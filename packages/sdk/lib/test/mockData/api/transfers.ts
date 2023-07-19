import { PaginatedTransfers } from '../../../types/api/transfers.js';

const transfers: PaginatedTransfers = {
    items: [
        {
            transactionId: '0.0.2103573-1682648081-677085891',
            sourceChainId: 295,
            targetChainId: 43114,
            nativeChainId: 43114,
            sourceAsset: '0.0.1157020',
            targetAsset: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
            nativeAsset: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
            receiver: '0xFD2E71600c1764cD0FA69C4B4b4cb33E28439BC9',
            amount: '19763899200000000000',
            isNft: false,
            originator: '0.0.2103573',
            timestamp: '2023-04-28T02:15:00.7553565Z',
            status: 'COMPLETED',
        },
        {
            transactionId: '0.0.1107000-1682646351-537329747',
            sourceChainId: 295,
            targetChainId: 1,
            nativeChainId: 1,
            sourceAsset: '0.0.624505',
            targetAsset: '0xac3211a5025414Af2866FF09c23FC18bc97e79b1',
            nativeAsset: '0xac3211a5025414Af2866FF09c23FC18bc97e79b1',
            receiver: '0x155C51BB292211285D999c7B3cA7aB4e62b041c3',
            amount: '200000000000000000000000',
            isNft: false,
            originator: '0.0.1107000',
            timestamp: '2023-04-28T01:46:07.079558659Z',
            status: 'COMPLETED',
        },
        {
            transactionId: '0.0.1721009-1682646100-029034181',
            sourceChainId: 295,
            targetChainId: 43114,
            nativeChainId: 43114,
            sourceAsset: '0.0.1157020',
            targetAsset: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
            nativeAsset: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
            receiver: '0xdC5530A67D4C0CACc180349D6A8D1AfE0CC6Db3f',
            amount: '28978497720000000000',
            isNft: false,
            originator: '0.0.1721009',
            timestamp: '2023-04-28T01:42:02.369134361Z',
            status: 'COMPLETED',
        },
    ],
    totalCount: 7813,
};

const transfersEmpty: PaginatedTransfers = {
    items: [],
    totalCount: 7813,
};
