import { CondensedAsset } from '../../../types/api/assets.js';
import {
    Asset,
    AssetMinAmount,
    AssetReserveAmounts,
    Network,
} from '../../../types/api/networks.js';

const networks: Network[] = [
    {
        id: 137,
        name: 'Polygon',
    },
    {
        id: 25,
        name: 'Cronos',
    },
    {
        id: 295,
        name: 'Hedera',
    },
    {
        id: 42161,
        name: 'Arbitrum',
    },
    {
        id: 56,
        name: 'BNB',
    },
    {
        id: 1,
        name: 'Ethereum',
    },
    {
        id: 10,
        name: 'Optimism',
    },
    {
        id: 250,
        name: 'Fantom',
    },
    {
        id: 43114,
        name: 'Avalanche',
    },
];

export const networksNetworkIdAssets: Record<string, CondensedAsset> = {
    '0x0000000000085d4780B73119b644AE5ecd22b376': {
        id: '0x0000000000085d4780B73119b644AE5ecd22b376',
        name: 'TrueUSD',
        symbol: 'TUSD',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1304788',
            },
        },
        icon: 'https://cdn.hashport.network/TUSD.svg',
    },
    '0x037A54AaB062628C9Bbae1FDB1583c195585fe41': {
        id: '0x037A54AaB062628C9Bbae1FDB1583c195585fe41',
        name: 'LCX',
        symbol: 'LCX',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1304772',
            },
        },
        icon: 'https://cdn.hashport.network/LCX.svg',
    },
    '0x13ceaf35d3C48Bc63a26361852eE6D229c503369': {
        id: '0x13ceaf35d3C48Bc63a26361852eE6D229c503369',
        name: 'HeadStarter',
        symbol: 'HST[eth]',
        isNative: false,
        decimals: 8,
        icon: 'https://cdn.hashport.network/HST.svg',
    },
    '0x14ab470682Bc045336B1df6262d538cB6c35eA2A': {
        id: '0x14ab470682Bc045336B1df6262d538cB6c35eA2A',
        name: 'HBAR[eth]',
        symbol: 'HBAR[eth]',
        isNative: false,
        decimals: 8,
        icon: 'https://cdn.hashport.network/HBAR.svg',
    },
    '0x16484d73Ac08d2355F466d448D2b79D2039F6EBB': {
        id: '0x16484d73Ac08d2355F466d448D2b79D2039F6EBB',
        name: 'Knoxstertoken',
        symbol: 'FKX',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1463373',
            },
        },
        icon: 'https://cdn.hashport.network/FKX.svg',
    },
    '0x16d0b8Ac8022E54947e0DC7D8A5B5A79e2B54f0b': {
        id: '0x16d0b8Ac8022E54947e0DC7D8A5B5A79e2B54f0b',
        name: 'GRELF',
        symbol: 'GRELF[eth]',
        isNative: false,
        decimals: 8,
        icon: 'https://cdn.hashport.network/GRELF.svg',
    },
    '0x1EB71D3E7d28b9667fB5abAE6184E54AA7302caE': {
        id: '0x1EB71D3E7d28b9667fB5abAE6184E54AA7302caE',
        name: 'OM NFT',
        symbol: 'OM[eth]',
        isNative: false,
        icon: 'https://cdn.hashport.network/OM.svg',
    },
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': {
        id: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        name: 'Wrapped BTC',
        symbol: 'WBTC',
        isNative: true,
        decimals: 8,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1055483',
            },
        },
        icon: 'https://cdn.hashport.network/WBTC.svg',
    },
    '0x226f7b842E0F0120b7E194D05432b3fd14773a9D': {
        id: '0x226f7b842E0F0120b7E194D05432b3fd14773a9D',
        name: 'UNION Protocol Governance Token',
        symbol: 'UNN',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1345954',
            },
        },
        icon: 'https://cdn.hashport.network/UNN.svg',
    },
    '0x23CCe5Bc29d30CB69eAA4F6cd58b4B912C520546': {
        id: '0x23CCe5Bc29d30CB69eAA4F6cd58b4B912C520546',
        name: 'Calaxy Tokens',
        symbol: 'CLXY[eth]',
        isNative: false,
        decimals: 6,
        icon: 'https://cdn.hashport.network/CLXY.svg',
    },
    '0x27d74c114d7F137F9f1a4Cf8eA6d335884cAFa26': {
        id: '0x27d74c114d7F137F9f1a4Cf8eA6d335884cAFa26',
        name: 'Hot DeFi Summer',
        symbol: 'HDS[eth]',
        isNative: false,
        icon: 'https://cdn.hashport.network/HDS.svg',
    },
    '0x2F3AFd7373F6dD960Afd083FB2F0AC2303285ef7': {
        id: '0x2F3AFd7373F6dD960Afd083FB2F0AC2303285ef7',
        name: 'Tune.FM',
        symbol: 'JAM[eth]',
        isNative: false,
        decimals: 8,
        icon: 'https://cdn.hashport.network/JAM.svg',
    },
    '0x30A08a04F765aEEC3eb139872e021D2620259204': {
        id: '0x30A08a04F765aEEC3eb139872e021D2620259204',
        name: 'Meerkat Gang',
        symbol: 'MEERK[eth]',
        isNative: false,
        icon: 'https://cdn.hashport.network/MEERK.svg',
    },
    '0x30D20208d987713f46DFD34EF128Bb16C404D10f': {
        id: '0x30D20208d987713f46DFD34EF128Bb16C404D10f',
        name: 'Stader',
        symbol: 'SD',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1463375',
            },
        },
        icon: 'https://cdn.hashport.network/SD.svg',
    },
    '0x3593D125a4f7849a1B059E64F4517A86Dd60c95d': {
        id: '0x3593D125a4f7849a1B059E64F4517A86Dd60c95d',
        name: 'MANTRA DAO',
        symbol: 'OM',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1080694',
            },
        },
        icon: 'https://cdn.hashport.network/OM.svg',
    },
    '0x3b930B1248E902367ff36860d256c87244016cCc': {
        id: '0x3b930B1248E902367ff36860d256c87244016cCc',
        name: 'REV3AL',
        symbol: 'REV3L[eth]',
        isNative: false,
        decimals: 9,
        icon: 'https://cdn.hashport.network/REV3L.svg',
    },
    '0x4a220E6096B25EADb88358cb44068A3248254675': {
        id: '0x4a220E6096B25EADb88358cb44068A3248254675',
        name: 'Quant',
        symbol: 'QNT',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1304757',
            },
        },
        icon: 'https://cdn.hashport.network/QNT.svg',
    },
    '0x4d224452801ACEd8B2F0aebE155379bb5D594381': {
        id: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
        name: 'ApeCoin',
        symbol: 'APE',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1304748',
            },
        },
        icon: 'https://cdn.hashport.network/APE.svg',
    },
    '0x514910771AF9Ca656af840dff83E8264EcF986CA': {
        id: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        name: 'ChainLink Token',
        symbol: 'LINK',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1055495',
            },
        },
        icon: 'https://cdn.hashport.network/LINK.svg',
    },
    '0x58b9cEb6b7856C539C4Cb97FBa2D7a2C478D07d6': {
        id: '0x58b9cEb6b7856C539C4Cb97FBa2D7a2C478D07d6',
        name: 'Leemon Club',
        symbol: 'LEEMON[eth]',
        isNative: false,
        icon: 'https://cdn.hashport.network/LEEMON.svg',
    },
    '0x6B175474E89094C44Da98b954EedeAC495271d0F': {
        id: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        name: 'Dai Stablecoin',
        symbol: 'DAI',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1055477',
            },
        },
        icon: 'https://cdn.hashport.network/DAI.svg',
    },
    '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9': {
        id: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        name: 'Aave Token',
        symbol: 'AAVE',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1055498',
            },
        },
        icon: 'https://cdn.hashport.network/AAVE.svg',
    },
    '0x8d591dE7eF24181E794f6b69724f6e8d06e61065': {
        id: '0x8d591dE7eF24181E794f6b69724f6e8d06e61065',
        name: 'DoodleVerse',
        symbol: 'DV[eth]',
        isNative: false,
        icon: 'https://cdn.hashport.network/DV.svg',
    },
    '0x9598f5102D2801931C8dD411995f0de30825dd0a': {
        id: '0x9598f5102D2801931C8dD411995f0de30825dd0a',
        name: 'HGraph Punks',
        symbol: 'HGP[eth]',
        isNative: false,
        icon: 'https://cdn.hashport.network/HGP.svg',
    },
    '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE': {
        id: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
        name: 'SHIBA INU',
        symbol: 'SHIB',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1304735',
            },
        },
        icon: 'https://cdn.hashport.network/SHIB.svg',
    },
    '0x95acB37f86E342af41e06aA00D736b249C429edf': {
        id: '0x95acB37f86E342af41e06aA00D736b249C429edf',
        name: 'Hot DeFi Summer',
        symbol: 'HDS[eth]',
        isNative: false,
        icon: 'https://cdn.hashport.network/HDS.svg',
    },
    '0x9fD01a0465694E5197b482E0873344C0F815456d': {
        id: '0x9fD01a0465694E5197b482E0873344C0F815456d',
        name: 'FabriqHashportOG',
        symbol: 'FHOG',
        isNative: false,
        icon: 'https://cdn.hashport.network/FHOG.svg',
    },
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': {
        id: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        name: 'USD Coin',
        symbol: 'USDC',
        isNative: true,
        decimals: 6,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1055459',
            },
        },
        icon: 'https://cdn.hashport.network/USDC.svg',
    },
    '0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b': {
        id: '0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b',
        name: 'Axie Infinity Shard',
        symbol: 'AXS',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1304767',
            },
        },
        icon: 'https://cdn.hashport.network/AXS.svg',
    },
    '0xBd09BE64774042053f084dF5ac9f394c290C2558': {
        id: '0xBd09BE64774042053f084dF5ac9f394c290C2558',
        name: 'SaucerSwap',
        symbol: 'SAUCE[eth]',
        isNative: false,
        decimals: 6,
        icon: 'https://cdn.hashport.network/SAUCE.svg',
    },
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': {
        id: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        name: 'Wrapped Ether',
        symbol: 'WETH',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.541564',
            },
        },
        icon: 'https://cdn.hashport.network/WETH.svg',
    },
    '0xC05B52eC09fB2A5cA5a1E952a77BC0eC30BAcaB1': {
        id: '0xC05B52eC09fB2A5cA5a1E952a77BC0eC30BAcaB1',
        name: 'Moon Shells',
        symbol: 'MNSHLS[eth]',
        isNative: false,
        icon: 'https://cdn.hashport.network/MNSHLS.svg',
    },
    '0xD533a949740bb3306d119CC777fa900bA034cd52': {
        id: '0xD533a949740bb3306d119CC777fa900bA034cd52',
        name: 'Curve DAO Token',
        symbol: 'CRV',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1304781',
            },
        },
        icon: 'https://cdn.hashport.network/CRV.svg',
    },
    '0xDef809f5556E7eFeeA7D1C103F9a1d53786DD2Eb': {
        id: '0xDef809f5556E7eFeeA7D1C103F9a1d53786DD2Eb',
        name: 'Lil Monkis',
        symbol: 'LILMONKI[eth]',
        isNative: false,
        icon: 'https://cdn.hashport.network/LILMONKI.svg',
    },
    '0xE8204322BbdB5e223332D5c4eBb39cB91A3B8F90': {
        id: '0xE8204322BbdB5e223332D5c4eBb39cB91A3B8F90',
        name: 'Lazy Superheroes - Gen 2',
        symbol: 'Lazy Superheroes - Gen 2[eth]',
        isNative: false,
        icon: 'https://cdn.hashport.network/Lazy+Superheroes+-+Gen+2.svg',
    },
    '0xF0d88a4B58ebdDE23FB3Cffd2ded66b9d135A36a': {
        id: '0xF0d88a4B58ebdDE23FB3Cffd2ded66b9d135A36a',
        name: 'Cosmo Monkis',
        symbol: 'CM[eth]',
        isNative: false,
        icon: 'https://cdn.hashport.network/CM.svg',
    },
    '0xF660461A84EB95690124977075CF92c80088934f': {
        id: '0xF660461A84EB95690124977075CF92c80088934f',
        name: 'Hashmingos',
        symbol: 'MNGO[eth]',
        isNative: false,
        icon: 'https://cdn.hashport.network/MNGO.svg',
    },
    '0xa6312d2cE2724B68F7C426a0D6eDdaBdAdBddE48': {
        id: '0xa6312d2cE2724B68F7C426a0D6eDdaBdAdBddE48',
        name: 'HeliSwap',
        symbol: 'HELI[eth]',
        isNative: false,
        decimals: 8,
        icon: 'https://cdn.hashport.network/HELI.svg',
    },
    '0xac3211a5025414Af2866FF09c23FC18bc97e79b1': {
        id: '0xac3211a5025414Af2866FF09c23FC18bc97e79b1',
        name: 'DOVU',
        symbol: 'DOV',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.624505',
            },
        },
        icon: 'https://cdn.hashport.network/DOV.svg',
    },
    '0xb24cd494faE4C180A89975F1328Eab2a7D5d8f11': {
        id: '0xb24cd494faE4C180A89975F1328Eab2a7D5d8f11',
        name: 'Developer DAO',
        symbol: 'CODE',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1304795',
            },
        },
        icon: 'https://cdn.hashport.network/CODE.svg',
    },
    '0xbCB430D7c39Eb75f801fAc32d77A400326ee4a7d': {
        id: '0xbCB430D7c39Eb75f801fAc32d77A400326ee4a7d',
        name: 'Dead Pixels Ghost Club',
        symbol: 'DPGC[eth]',
        isNative: false,
        icon: 'https://cdn.hashport.network/DPGC.svg',
    },
    '0xbc8Fa68CEdA02eb00e9139E589f2913c5D0573F3': {
        id: '0xbc8Fa68CEdA02eb00e9139E589f2913c5D0573F3',
        name: 'Hash Horses',
        symbol: 'HashHorses[eth]',
        isNative: false,
        icon: 'https://cdn.hashport.network/HashHorses.svg',
    },
    '0xc00e94Cb662C3520282E6f5717214004A7f26888': {
        id: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        name: 'Compound',
        symbol: 'COMP',
        isNative: true,
        decimals: 18,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1304729',
            },
        },
        icon: 'https://cdn.hashport.network/COMP.svg',
    },
    '0xdAC17F958D2ee523a2206206994597C13D831ec7': {
        id: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        name: 'Tether USD',
        symbol: 'USDT',
        isNative: true,
        decimals: 6,
        bridgeableNetworks: {
            '295': {
                network: {
                    id: 295,
                    name: 'Hedera',
                },
                wrappedAsset: '0.0.1055472',
            },
        },
        icon: 'https://cdn.hashport.network/USDT.svg',
    },
};

// HBAR
const networksNetworkIdAssetsAssetIdNative: Asset = {
    id: 'HBAR',
    name: 'HBAR',
    symbol: 'HBAR',
    decimals: 8,
    isNative: true,
    type: 'ft',
    minAmount: '65359477124',
    feePercentage: {
        amount: 500,
        maxPercentage: 100000,
    },
    reserveAmount: '36985092501912',
    bridgeableNetworks: {
        '1': {
            network: {
                id: 1,
                name: 'Ethereum',
            },
            wrappedAsset: '0x14ab470682Bc045336B1df6262d538cB6c35eA2A',
        },
        '56': {
            network: {
                id: 56,
                name: 'BNB',
            },
            wrappedAsset: '0x6DE8738696D4cfd407830151c716A00d74877eeB',
        },
        '137': {
            network: {
                id: 137,
                name: 'Polygon',
            },
            wrappedAsset: '0x1646C835d70F76D9030DF6BaAeec8f65c250353d',
        },
        '43114': {
            network: {
                id: 43114,
                name: 'Avalanche',
            },
            wrappedAsset: '0xCDe4aBef67e3E9463e6e58e293021a0Be8D0BEc6',
        },
    },
    icon: 'https://cdn.hashport.network/HBAR.svg',
};

// 0x14ab470682Bc045336B1df6262d538cB6c35eA2A
const networksNetworkIdAssetsAssetId: Asset = {
    id: '0x14ab470682Bc045336B1df6262d538cB6c35eA2A',
    name: 'HBAR[eth]',
    symbol: 'HBAR[eth]',
    decimals: 8,
    isNative: false,
    type: 'ft',
    minAmount: '65359477124',
    feePercentage: {
        amount: 500,
        maxPercentage: 100000,
    },
    reserveAmount: '406734551483',
    icon: 'https://cdn.hashport.network/HBAR.svg',
};

//HBAR
const networksNetworkIdAssetsAssetIdAmountsNative: AssetReserveAmounts = {
    id: 'HBAR',
    networkId: '295',
    networkName: 'Hedera',
    name: 'HBAR',
    symbol: 'HBAR',
    decimals: 8,
    type: 'ft',
    reserveAmount: '36985092501912',
    bridgeableNetworks: {
        '1': {
            network: {
                id: 1,
                name: 'Ethereum',
            },
            wrappedAsset: {
                id: '0x14ab470682Bc045336B1df6262d538cB6c35eA2A',
                networkId: '1',
                networkName: 'Ethereum',
                name: 'HBAR[eth]',
                symbol: 'HBAR[eth]',
                decimals: 8,
                type: 'ft',
                reserveAmount: '406734551483',
            },
        },
        '56': {
            network: {
                id: 56,
                name: 'BNB',
            },
            wrappedAsset: {
                id: '0x6DE8738696D4cfd407830151c716A00d74877eeB',
                networkId: '56',
                networkName: 'BNB',
                name: 'HBAR[bnb]',
                symbol: 'HBAR[bnb]',
                decimals: 8,
                type: 'ft',
                reserveAmount: '408320679650',
            },
        },
        '137': {
            network: {
                id: 137,
                name: 'Polygon',
            },
            wrappedAsset: {
                id: '0x1646C835d70F76D9030DF6BaAeec8f65c250353d',
                networkId: '137',
                networkName: 'Polygon',
                name: 'HBAR[0x]',
                symbol: 'HBAR[0x]',
                decimals: 8,
                type: 'ft',
                reserveAmount: '35502497185347',
            },
        },
        '43114': {
            network: {
                id: 43114,
                name: 'Avalanche',
            },
            wrappedAsset: {
                id: '0xCDe4aBef67e3E9463e6e58e293021a0Be8D0BEc6',
                networkId: '43114',
                networkName: 'Avalanche',
                name: 'HBAR[ava]',
                symbol: 'HBAR[ava]',
                decimals: 8,
                type: 'ft',
                reserveAmount: '90813492063',
            },
        },
    },
};

// 0x14ab470682Bc045336B1df6262d538cB6c35eA2A
const networksNetworkIdAssetsAssetIdAmounts: AssetReserveAmounts = {
    id: '0x14ab470682Bc045336B1df6262d538cB6c35eA2A',
    networkId: '1',
    networkName: 'Ethereum',
    name: 'HBAR[eth]',
    symbol: 'HBAR[eth]',
    decimals: 8,
    type: 'ft',
    reserveAmount: '406734551483',
};

const networksNetworkIdAssetsAssetIdMinAmount: AssetMinAmount = {
    minAmount: '65359477124',
};
