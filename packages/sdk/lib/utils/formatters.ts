import { AccountId } from '@hashgraph/sdk';
import type { TransactionId } from '@hashgraph/sdk';
import { AbiFunction } from 'abitype';
import { AbiItem, TransactionReceipt, isHex, toBytes, toHex } from 'viem';
import { HashportError } from './error';

export function formatTransactionId(id: TransactionId) {
    if (!id.validStart) throw 'No valid start for hedera transaction id';
    return `${id.accountId}-${id.validStart.seconds}-${id.validStart.nanos
        .toString()
        .padStart(9, '0')}`;
}

export function formatUrl(url: string, pollingId: string) {
    return url.replace('{transferId}', pollingId).replace('{transactionId}', pollingId);
}

export const formatPollingId = (
    { transactionHash, logs }: TransactionReceipt,
    targetAddress: `0x${string}`,
) => {
    const log = logs.find(({ address }) => address.toLowerCase() === targetAddress.toLowerCase());
    if (log?.logIndex === undefined) {
        throw new HashportError(
            `Cannot find log index for ${transactionHash}`,
            'PORTING_EXECUTION',
        );
    }
    return `${transactionHash}-${log.logIndex}`;
};

export function hederaAccountToBytes(hederaAccountAddress: string): `0x${string}` {
    const accountBytes = AccountId.fromString(hederaAccountAddress).toBytes();
    const toBytes = toHex(accountBytes);
    return toBytes as `0x${string}`;
}

export function transactionIdToBytes(txId: string) {
    const hexValue = toHex(toBytes(txId));
    return hexValue;
}

export function formatBridgeSignatures(signatures: Array<string>): Array<`0x${string}`> {
    return signatures.map<`0x${string}`>(signature =>
        isHex(signature) ? signature : `0x${signature}`,
    );
}

export function splitSignature(signature: `0x${string}`) {
    const result = {
        r: '0x',
        s: '0x',
        _vs: '0x',
        recoveryParam: 0,
        v: 0,
        yParityAndS: '0x',
        compact: '0x',
    };

    const bytes: Uint8Array = toBytes(signature);

    // Get the r, s and v
    if (bytes.length === 64) {
        // EIP-2098; pull the v from the top bit of s and clear it
        result.v = 27 + (bytes[32] >> 7);
        bytes[32] &= 0x7f;

        result.r = toHex(bytes.slice(0, 32));
        result.s = toHex(bytes.slice(32, 64));
    } else if (bytes.length === 65) {
        result.r = toHex(bytes.slice(0, 32));
        result.s = toHex(bytes.slice(32, 64));
        result.v = bytes[64];
    } else {
        console.error('invalid signature string', 'signature', signature);
    }

    // Allow a recid to be used as the v
    if (result.v < 27) {
        if (result.v === 0 || result.v === 1) {
            result.v += 27;
        } else {
            console.error('signature invalid v byte', 'signature', signature);
        }
    }

    // Compute recoveryParam from v
    result.recoveryParam = 1 - (result.v % 2);

    // Compute _vs from recoveryParam and s
    if (result.recoveryParam) {
        bytes[32] |= 0x80;
    }
    result._vs = toHex(bytes.slice(32, 64));

    result.yParityAndS = result._vs;
    result.compact = result.r + result.yParityAndS.substring(2);

    return result;
}

export function parsePartialFunctionAbi(abi: string): [AbiFunction] {
    const parsedAbi = JSON.parse(abi)[0] as AbiItem;
    if (parsedAbi.type !== 'function') {
        throw `Invalid ABI: Expected Abi Function, received ${abi}`;
    }
    return [parsedAbi];
}
