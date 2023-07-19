import { TransactionReceipt } from 'viem';

export const FETCH_TEST_URL = 'https://jsonplaceholder.typicode.com/todos/1';
export const BRIDGE_PAYOUT_CONFIRMATION = 'BRIDGE_PAYOUT_CONFIRMATION';
export const ROUTER_CONTRACT = '0x367e59b559283C8506207d75B0c5D8C66c4Cd4B7';
export const SUCCESSFUL_LOG_INDEX = 0;
export const HBAR = 'HBAR';
export const HBAR_ETH = '0x14ab470682Bc045336B1df6262d538cB6c35eA2A';
export const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
export const USDC_HTS = '0.0.1055459';
export const USDT = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
export const USDT_HTS = '0.0.1055472';
export const SAUCE = '0.0.731861';
export const SAUCE_ETH = '0xBd09BE64774042053f084dF5ac9f394c290C2558';
export const HOTDEFISUMMERNFT = '0.0.1023381';
export const HOTDEFISUMMERNFT_ETH = '0x95acB37f86E342af41e06aA00D736b249C429edf';

export const getSuccessfulEvmRxMock = (hash: string) =>
    ({
        transactionHash: hash,
        logs: [{ logIndex: SUCCESSFUL_LOG_INDEX, address: ROUTER_CONTRACT }],
    } as unknown as TransactionReceipt);
