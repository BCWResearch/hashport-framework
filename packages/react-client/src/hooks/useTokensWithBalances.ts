import { useHashportClient } from './useHashportClient';
import { useTokenList } from './useTokenList';
import { useQuery } from '@tanstack/react-query';
import { balanceOfAbi } from 'constants/abi';
import { useMemo } from 'react';
import { AssetInfoWithBalance } from 'types/tokenList';
import { isHex } from 'viem';
import { useContractReads } from 'wagmi';

export const useTokensWithBalances = (
    props: Parameters<typeof useTokenList>[0],
):
    | { isLoading: true; isError: false; tokens: undefined }
    | { isLoading: false; isError: true; tokens: undefined | AssetInfoWithBalance[] }
    | { isLoading: false; isError: false; tokens: AssetInfoWithBalance[] } => {
    const { evmSigner, hederaSigner, mirrorNodeClient } = useHashportClient();
    const hederaId = hederaSigner.accountId;
    const evmAddress = evmSigner.getAddress();
    const chainId = evmSigner.getChainId();

    const { data: tokens, isError, isLoading } = useTokenList(props);
    const tokenList = useMemo(() => tokens && Array.from(tokens?.fungible.values()), [tokens]);
    const evmTokens = tokenList?.filter(({ id, chainId: chain }) => chain === chainId && isHex(id));
    const { data: evmBalances } = useContractReads({
        enabled: !!tokenList,
        allowFailure: true,
        contracts: tokenList
            ?.filter(({ id, chainId: chain }) => chain === chainId && isHex(id))
            .map(({ id }) => ({
                address: id as `0x${string}`,
                abi: balanceOfAbi,
                functionName: 'balanceOf',
                args: [evmAddress],
            })),
    });
    const evmBalanceMap = new Map(
        (evmTokens ?? []).map(({ id }, i) => [id, evmBalances?.[i].result as bigint | undefined]),
    );

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

    const results: AssetInfoWithBalance[] | undefined = tokenList?.map(token => {
        const { id } = token;
        if (isHex(id)) {
            return { ...token, balance: evmBalanceMap?.get(id) };
        } else {
            const balance = BigInt(hederaBalances?.get(token.id) ?? 0);
            return { ...token, balance };
        }
    });

    if (isLoading) {
        return { isLoading, isError, tokens: undefined };
    } else if (isError || !results) {
        return { isLoading, isError: true, tokens: undefined };
    } else {
        return { isLoading, isError, tokens: results };
    }
};
