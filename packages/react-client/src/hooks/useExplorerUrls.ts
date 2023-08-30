import { useQuery } from '@tanstack/react-query';
import { useHashportApiClient } from './useHashportApiClient';

export const useExplorerUrls = () => {
    const hashportApiClient = useHashportApiClient();
    return useQuery({
        queryKey: ['explorers'],
        queryFn: async () => {
            const explorers = await hashportApiClient.explorers();
            return explorers;
        },
    });
};
