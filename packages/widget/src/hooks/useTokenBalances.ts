import { useHashportClient, useTokenList } from '@hashport/react-client';
import { useQuery } from '@tanstack/react-query';

export const useTokenBalances = () => {
    const hashportClient = useHashportClient();
    const hederaId = hashportClient.hederaSigner.accountId;

    const { data: tokens } = useTokenList();
    // TODO: get balances of all evm tokens: filter out tokens, then useQueries?
    // const {} = useQuery({
    //     queryKey: ['evm-balances', hashportClient.evmSigner.getAddress()],
    //     queryFn: async () => {
    //         const balances = await hashportClient.evmSigner.getContract;
    //     },
    // });
    const { data: hederaBalances } = useQuery({
        queryKey: ['mirror-node-balances', hederaId],
        queryFn: async () => {
            return await hashportClient.mirrorNodeClient.getBalances({ 'account.id': hederaId });
        },
    });
};
