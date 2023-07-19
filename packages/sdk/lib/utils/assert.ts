import { isHex } from 'viem';

export function assertHexString(str: string | undefined): `0x${string}` {
    if (!isHex(str)) throw `Invalid address: Expected hex string, received ${str}`;
    return str;
}

export function assertHederaTokenId(str: string): `${number}.${number}.${number}` | 'HBAR' {
    const isHederaTokenId = /^[0-9].[0-9].[0-9]{1,10}$/.test(str) || str === 'HBAR';
    if (!isHederaTokenId) throw `Invalid Hedera asset: ${str}`;
    return str as `${number}.${number}.${number}` | 'HBAR';
}

