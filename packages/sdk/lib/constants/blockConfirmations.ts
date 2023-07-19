export const blockConfirmations: Record<number, number> = {
    // TESTNET
    11155111: 6, // Ethereum
    420: 100, // Optimism
    97: 7, // Binance
    80001: 150, // Polygon
    43113: 7, // Avalanche
    421613: 100, // Arbitrum
    4002: 5, // Fantom
    338: 5, // Cronos
    1287: 5, // Moonbase
    1313161555: 5, // Aurora
    // MAINNET
    1: 6, // Ethereum
    10: 100, // Optimism
    56: 7, // Binance
    137: 150, // Polygon
    43114: 7, // Avalanche
    42161: 100, // Arbitrum
    250: 5, // Fantom
    25: 5, // Cronos
    1284: 5, // Moonbase
    1313161554: 5, // Aurora
} as const;

export const getBlockConfirmations = (chainId: number) => {
    const DEFAULT = 5;
    return blockConfirmations[chainId] ?? DEFAULT;
};