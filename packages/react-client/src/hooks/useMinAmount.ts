import { useQuery } from '@tanstack/react-query';
import { useBridgeParams } from './useBridgeParams';
import { useHashportApiClient } from './useHashportApiClient';

export const useMinAmount = () => {
    const hashportApiClient = useHashportApiClient();
    const { sourceAssetId, sourceNetworkId } = useBridgeParams();
    const enabled = Boolean(sourceAssetId && sourceNetworkId);
    return useQuery({
        enabled,
        queryKey: ['min-amount', sourceNetworkId, sourceAssetId],
        queryFn: async () => {
            const { minAmount } = await hashportApiClient.minAmounts(
                +sourceNetworkId,
                sourceAssetId,
            );
            return BigInt(minAmount) + BigInt(minAmount) / 10n;
        },
    });
};
