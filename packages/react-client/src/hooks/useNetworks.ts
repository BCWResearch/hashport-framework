import { useQuery } from '@tanstack/react-query';
import { useHashportApiClient } from './useHashportApiClient';

export const useNetworks = () => {
    const hashportApiClient = useHashportApiClient();
    return useQuery({
        staleTime: Infinity,
        queryKey: ['networks'],
        queryFn: async () => {
            return await hashportApiClient.networks();
        },
    });
};
