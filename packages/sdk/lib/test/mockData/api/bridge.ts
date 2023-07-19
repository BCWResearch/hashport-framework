import { BridgeParams, BridgeStep, BridgeValidation } from '../../../types/api/bridge.js';
import {
    HBAR,
    HBAR_ETH,
    HOTDEFISUMMERNFT,
    HOTDEFISUMMERNFT_ETH,
    USDC,
    USDT,
    USDC_HTS,
    USDT_HTS,
} from '../../mocks/constants.js';
import { mockEvmAccount, mockHederaAccount } from '../../mocks/mockSigners.js';

export const INSUFFICIENT_BALANCE_PARAMS: BridgeParams = {
    sourceNetworkId: '295',
    sourceAssetId: HBAR,
    targetNetworkId: '1',
    amount: (Number(mockHederaAccount.balances[HBAR]) + 1).toString(),
    recipient: mockEvmAccount.address,
};

export const WRONG_RECIPIENT_PARAMS: BridgeParams = {
    sourceNetworkId: '295',
    sourceAssetId: HBAR,
    targetNetworkId: '1',
    amount: mockHederaAccount.balances[HBAR].toString(),
    recipient: '0x5555555555555555555555555555555555555555',
};

export const WRONG_NFT_OWNER_PARAMS: BridgeParams = {
    sourceNetworkId: '295',
    sourceAssetId: '0.0.1023381',
    targetNetworkId: '1',
    tokenId: '2',
    recipient: mockEvmAccount.address,
};

export const bridgeParamsMock = {
    mint: {
        sourceNetworkId: '295',
        sourceAssetId: 'HBAR',
        targetNetworkId: '1',
        amount: '100000000000',
        recipient: mockEvmAccount.address,
    },
    burn: {
        sourceNetworkId: '1',
        sourceAssetId: '0x14ab470682Bc045336B1df6262d538cB6c35eA2A',
        targetNetworkId: '295',
        amount: '100000000000',
        recipient: mockHederaAccount.address,
    },
    lock: {
        sourceNetworkId: '1',
        sourceAssetId: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        targetNetworkId: '295',
        amount: '50000000',
        recipient: mockHederaAccount.address,
    },
    lockAssociated: {
        sourceNetworkId: '1',
        sourceAssetId: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        targetNetworkId: '295',
        amount: '50000000',
        recipient: mockHederaAccount.address,
    },
    unlock: {
        sourceNetworkId: '295',
        sourceAssetId: '0.0.1055472',
        targetNetworkId: '1',
        amount: '50000000',
        recipient: mockEvmAccount.address,
    },
    mintERC721: {
        sourceNetworkId: '295',
        sourceAssetId: '0.0.1023381',
        targetNetworkId: '1',
        tokenId: '1',
        recipient: mockEvmAccount.address,
    },
    burnERC721: {
        sourceNetworkId: '1',
        sourceAssetId: '0x95acB37f86E342af41e06aA00D736b249C429edf',
        targetNetworkId: '295',
        tokenId: '1',
        recipient: mockHederaAccount.address,
    },
} as const;

// sourceNetworkId: 295
// sourceAssetId: HBAR
// targetNetworkId: 1
// amount: 100000000000
// recipient: 0x0000000000000000000000000000000000000000
const bridgeHbarToHbarEth: BridgeStep[] = [
    {
        type: 'Hedera',
        amount: '100000000000',
        target: '0.0.540219',
        memo: '1-0x0000000000000000000000000000000000000000',
    },
    {
        type: 'poll',
        target: 'https://nonval.mainnet.hashport.network/api/v1/transfers/{transferId}',
        polling: 15,
    },
    {
        type: 'evm',
        abi: '[{"inputs":[{"internalType":"uint256","name":"_sourceChain","type":"uint256"},{"internalType":"bytes","name":"_transactionId","type":"bytes"},{"internalType":"address","name":"_wrappedToken","type":"address"},{"internalType":"address","name":"_receiver","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"bytes[]","name":"_signatures","type":"bytes[]"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
    },
];

// sourceNetworkId: 1
// sourceAssetId: 0x14ab470682Bc045336B1df6262d538cB6c35eA2A
// targetNetworkId: 295
// amount: 100000000000
// recipient: 0.0.1
const bridgeHbarEthToHbar: BridgeStep[] = [
    {
        type: 'evm',
        amount: '100000000000',
        target: '0x367e59b559283C8506207d75B0c5D8C66c4Cd4B7',
        abi: '[{"inputs":[{"internalType":"uint256","name":"_targetChain","type":"uint256"},{"internalType":"address","name":"_wrappedToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"bytes","name":"_receiver","type":"bytes"},{"internalType":"uint256","name":"_deadline","type":"uint256"},{"internalType":"uint8","name":"_v","type":"uint8"},{"internalType":"bytes32","name":"_r","type":"bytes32"},{"internalType":"bytes32","name":"_s","type":"bytes32"}],"name":"burnWithPermit","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
        networkId: 1,
        receiver: '0.0.1',
        targetChain: 295,
        wrappedToken: '0x14ab470682Bc045336B1df6262d538cB6c35eA2A',
    },
    {
        type: 'poll',
        target: 'https://nonval.mainnet.hashport.network/api/v1/events/{transactionId}/tx',
        polling: 15,
    },
];

// sourceNetworkId: 1
// sourceAssetId: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
// targetNetworkId: 295
// amount: 50000000
// recipient: 0.0.1
const bridgeUSDCToUSDChts: BridgeStep[] = [
    {
        type: 'Hedera',
        tokenId: '0.0.1055459',
        target: 'AccountBalanceQuery',
    },
    {
        type: 'evm',
        amount: '50000000',
        target: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        abi: '[{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]',
        networkId: 1,
        spender: '0x367e59b559283C8506207d75B0c5D8C66c4Cd4B7',
    },
    {
        type: 'evm',
        amount: '50000000',
        target: '0x367e59b559283C8506207d75B0c5D8C66c4Cd4B7',
        abi: '[{"inputs":[{"internalType":"uint256","name":"_targetChain","type":"uint256"},{"internalType":"address","name":"_nativeToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"bytes","name":"_receiver","type":"bytes"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
        networkId: 1,
    },
    {
        type: 'poll',
        target: 'https://nonval.mainnet.hashport.network/api/v1/events/{transactionId}/tx',
        polling: 15,
    },
];

// sourceNetworkId: 295
// sourceAssetId: 0.0.1055459
// targetNetworkId: 1
// amount: 50000000
// recipient: 0x0000000000000000000000000000000000000000
const bridgeUSDChtsToUSDC: BridgeStep[] = [
    {
        type: 'Hedera',
        amount: '50000000',
        target: '0.0.540219',
        memo: '1-0x0000000000000000000000000000000000000000',
    },
    {
        type: 'poll',
        target: 'https://nonval.mainnet.hashport.network/api/v1/transfers/{transferId}',
        polling: 15,
    },
    {
        type: 'evm',
        abi: '[{"inputs":[{"internalType":"uint256","name":"_sourceChain","type":"uint256"},{"internalType":"bytes","name":"_transactionId","type":"bytes"},{"internalType":"address","name":"_nativeToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_receiver","type":"address"},{"internalType":"bytes[]","name":"_signatures","type":"bytes[]"}],"name":"unlock","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
    },
];

// sourceNetworkId: 295
// sourceAssetId: 0.0.1055472
// targetNetworkId: 1
// amount: 50000000
// recipient: 0x0000000000000000000000000000000000000000
const bridgeUSDThtsToUSDT: BridgeStep[] = [
    {
        type: 'Hedera',
        amount: '50000000',
        target: '0.0.540219',
        memo: '1-0x0000000000000000000000000000000000000000',
    },
    {
        type: 'poll',
        target: 'https://nonval.mainnet.hashport.network/api/v1/transfers/{transferId}',
        polling: 15,
    },
    {
        type: 'evm',
        abi: '[{"inputs":[{"internalType":"uint256","name":"_sourceChain","type":"uint256"},{"internalType":"bytes","name":"_transactionId","type":"bytes"},{"internalType":"address","name":"_nativeToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_receiver","type":"address"},{"internalType":"bytes[]","name":"_signatures","type":"bytes[]"}],"name":"unlock","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
    },
];

// sourceNetworkId: 1
// sourceAssetId: 0xdAC17F958D2ee523a2206206994597C13D831ec7
// targetNetworkId: 295
// amount: 50000000
// recipient: 0.0.1
const bridgeUSDTtoUSDThts: BridgeStep[] = [
    {
        type: 'Hedera',
        tokenId: '0.0.1055472',
        target: 'AccountBalanceQuery',
    },
    {
        type: 'evm',
        amount: '50000000',
        target: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        abi: '[{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]',
        networkId: 1,
        spender: '0x367e59b559283C8506207d75B0c5D8C66c4Cd4B7',
    },
    {
        type: 'evm',
        amount: '50000000',
        target: '0x367e59b559283C8506207d75B0c5D8C66c4Cd4B7',
        abi: '[{"inputs":[{"internalType":"uint256","name":"_targetChain","type":"uint256"},{"internalType":"address","name":"_nativeToken","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"bytes","name":"_receiver","type":"bytes"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
        networkId: 1,
    },
    {
        type: 'poll',
        target: 'https://nonval.mainnet.hashport.network/api/v1/events/{transactionId}/tx',
        polling: 15,
    },
];

// sourceNetworkId: 295
// sourceAssetId: 0.0.1023381
// targetNetworkId: 1
// tokenId: 1
// recipient: 0x0000000000000000000000000000000000000000
const bridgeHDSToHDSeth: BridgeStep[] = [
    {
        type: 'Hedera',
        tokenId: '0.0.1023381',
        target: 'CryptoApproveAllowance',
        spender: '0.0.540286',
        serialNumber: '1',
    },
    {
        type: 'Hedera',
        amount: '32786885245',
        target: '0.0.540219',
        memo: '1-0x0000000000000000000000000000000000000000-1@0.0.1023381',
    },
    {
        type: 'poll',
        target: 'https://nonval.mainnet.hashport.network/api/v1/transfers/{transferId}',
        polling: 15,
    },
    {
        type: 'evm',
        abi: '[{"inputs":[{"internalType":"uint256","name":"_sourceChain","type":"uint256"},{"internalType":"bytes","name":"_transactionId","type":"bytes"},{"internalType":"address","name":"_wrappedToken","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"string","name":"_metadata","type":"string"},{"internalType":"address","name":"_receiver","type":"address"},{"internalType":"bytes[]","name":"_signatures","type":"bytes[]"}],"name":"mintERC721","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
    },
];

// sourceNetworkId: 1
// sourceAssetId: 0x95acB37f86E342af41e06aA00D736b249C429edf
// targetNetworkId: 295
// tokenId: 1
// recipient: 0.0.1
const bridgeHDSethToHDS: BridgeStep[] = [
    {
        type: 'evm',
        target: '0x367e59b559283C8506207d75B0c5D8C66c4Cd4B7',
        abi: '[{"inputs":[{"internalType":"address","name":"_erc721","type":"address"}],"name":"erc721Payment","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]',
        networkId: 1,
        serialNumber: '1',
    },
    {
        type: 'evm',
        target: '0x367e59b559283C8506207d75B0c5D8C66c4Cd4B7',
        abi: '[{"inputs":[{"internalType":"address","name":"_erc721","type":"address"}],"name":"erc721Fee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]',
        networkId: 1,
        serialNumber: '1',
    },
    {
        type: 'evm',
        abi: '[{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]',
        networkId: 1,
        spender: '0x367e59b559283C8506207d75B0c5D8C66c4Cd4B7',
    },
    {
        type: 'evm',
        target: '0x95acB37f86E342af41e06aA00D736b249C429edf',
        abi: '[{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]',
        networkId: 1,
        spender: '0x367e59b559283C8506207d75B0c5D8C66c4Cd4B7',
        serialNumber: '1',
    },
    {
        type: 'evm',
        target: '0x367e59b559283C8506207d75B0c5D8C66c4Cd4B7',
        abi: '[{"inputs":[{"internalType":"uint256","name":"_targetChain","type":"uint256"},{"internalType":"address","name":"_wrappedToken","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"address","name":"_paymentToken","type":"address"},{"internalType":"uint256","name":"_fee","type":"uint256"},{"internalType":"bytes","name":"_receiver","type":"bytes"}],"name":"burnERC721","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
        networkId: 1,
        serialNumber: '1',
    },
    {
        type: 'poll',
        target: 'https://nonval.mainnet.hashport.network/api/v1/events/{transactionId}/tx',
        polling: 15,
    },
    {
        type: 'Hedera',
        tokenId: '0.0.1023381',
        target: '0.0.540219',
        receiver: '0.0.1',
        serialNumber: '1',
    },
];

// sourceNetworkId: 295
// sourceAssetId: HBAR
// targetNetworkId: 1
// amount: 100000000000
// recipient: 0x0000000000000000000000000000000000000000
export const bridgeValidateValid: BridgeValidation = {
    valid: true,
};

// sourceNetworkId: 295
// sourceAssetId: HBAR
// targetNetworkId: 1
// amount: 1
// recipient: 0x0000000000000000000000000000000000000000
const bridgeValidateInvalid1: BridgeValidation = {
    message: 'the requested amount to bridge is under the allowed minimum amount for the asset',
    statusCode: 400,
};

// sourceNetworkId: 295
// sourceAssetId: HBAR
// targetNetworkId: 1
// amount: 100000000000
// recipient: sdfsdf
const bridgeValidateInvalid2: BridgeValidation = {
    message: 'recipient must be a valid Evm Address',
    statusCode: 400,
};

// sourceNetworkId: 999
// sourceAssetId: HBAR
// targetNetworkId: 1
// amount: 100000000000
// recipient: 0x0000000000000000000000000000000000000000
const bridgeValidateInvalid3: BridgeValidation = {
    message: 'source network is not supported',
    statusCode: 400,
};

export const bridgeSteps: Record<string, BridgeStep[]> = {
    [HBAR]: bridgeHbarToHbarEth,
    [HBAR_ETH]: bridgeHbarEthToHbar,
    [USDC]: bridgeUSDCToUSDChts,
    [USDC_HTS]: bridgeUSDChtsToUSDC,
    [USDT]: bridgeUSDTtoUSDThts,
    [USDT_HTS]: bridgeUSDThtsToUSDT,
    [HOTDEFISUMMERNFT]: bridgeHDSToHDSeth,
    [HOTDEFISUMMERNFT_ETH]: bridgeHDSethToHDS,
};
