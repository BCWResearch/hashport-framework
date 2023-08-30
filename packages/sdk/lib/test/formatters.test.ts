import { describe, test, expect } from 'vitest';
import { formatTransactionId } from '../utils/formatters';

describe('Formatters', () => {
    test('should format transaction id', () => {
        expect(formatTransactionId('0.0.123@0123456789.123456789')).toEqual(
            '0.0.123-0123456789-123456789',
        );
        expect(formatTransactionId('0.0.123@0123456789.1')).toEqual('0.0.123-0123456789-000000001');
        expect(formatTransactionId('0.0.123-0123456789.1')).toEqual('0.0.123-0123456789-000000001');
        expect(formatTransactionId('0.0.123-0123456789-1')).toEqual('0.0.123-0123456789-000000001');
        expect(() => formatTransactionId('invalid')).toThrowError('Invalid hedera transactionId');
    });
});
