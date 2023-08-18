import { getBlockConfirmations } from '@hashport/sdk';
import { useQuery } from '@tanstack/react-query';

export const useBlockConfirmations = (chainId: number) => {
    return useQuery({
        queryKey: ['blockConfirmations', chainId],
        queryFn: async () => await getBlockConfirmations(chainId),
    });
};
