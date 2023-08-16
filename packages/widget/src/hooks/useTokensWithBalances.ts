import { AssetInfo, useHashportClient, useTokenList } from '@hashport/react-client';
import { useQueries, useQuery } from '@tanstack/react-query';
import { balanceOfAbi } from 'constants/abi';
import { useMemo } from 'react';
import { isHex } from 'viem';

export type AssetInfoWithBalance = AssetInfo & { balance: undefined | bigint };

export const useTokensWithBalances = (
    props: Parameters<typeof useTokenList>[0],
):
    | { isLoading: true; isError: false; tokens: undefined }
    | { isLoading: false; isError: true; tokens: undefined }
    | { isLoading: false; isError: false; tokens: (AssetInfoWithBalance | undefined)[] } => {
    const { evmSigner, hederaSigner, mirrorNodeClient } = useHashportClient();
    const hederaId = hederaSigner.accountId;
    const evmAddress = evmSigner.getAddress();
    const chainId = evmSigner.getChainId();

    const { data: tokens, isError, isLoading } = useTokenList(props);
    const tokenList = useMemo(() => tokens && Array.from(tokens?.fungible.values()), [tokens]);

    const { data: hederaBalances } = useQuery({
        staleTime: 15000,
        queryKey: ['mirror-node-balances', hederaId],
        queryFn: async () => {
            const { balances } = await mirrorNodeClient.getBalances({
                'account.id': hederaId,
            });
            if (!balances[0]) throw `No balance found for ${hederaId}`;
            const { balance, tokens } = balances[0];
            return new Map<string, number>([
                ['HBAR', balance],
                ...tokens.map(({ token_id, balance }) => [token_id, balance] as const),
            ]);
        },
    });

    const results = useQueries({
        queries: (tokenList ?? []).map(token => ({
            queryKey: [
                'token-balance',
                token.id,
                token.chainId,
                hederaBalances?.get(token.id),
                chainId,
                evmAddress,
            ],
            queryFn: async (): Promise<AssetInfoWithBalance> => {
                if (token.chainId !== 295 && token.chainId !== 296 && token.chainId !== chainId) {
                    return { ...token, balance: undefined };
                }
                try {
                    if (isHex(token.id)) {
                        const contract = evmSigner.getContract(balanceOfAbi, token.id);
                        const [balance] = await contract.read<[bigint]>([
                            {
                                functionName: 'balanceOf',
                                args: [evmAddress],
                            },
                        ]);
                        return { ...token, balance };
                    } else {
                        const balance = BigInt(hederaBalances?.get(token.id) ?? 0);
                        return { ...token, balance };
                    }
                } catch (error) {
                    return { ...token, balance: undefined };
                }
            },
        })),
    });

    if (isLoading) {
        return { isLoading, isError, tokens: undefined };
    } else if (isError) {
        return { isLoading, isError, tokens: undefined };
    } else {
        return { isLoading, isError, tokens: results.map(result => result.data) };
    }
};
