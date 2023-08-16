import { useBridgeParams } from '@hashport/react-client';
import { Input } from 'components/styled/Input';
import { TargetAssetSelect } from './TargetAssetSelect';
import { parseEther, formatEther } from 'viem';
import { useInProgressHashportId } from 'hooks/inProgressHashportId';

export const ReceivedAmount = () => {
    const { amount } = useBridgeParams();
    const [inProgressId] = useInProgressHashportId();

    const parsed = amount ? parseEther(amount) : undefined;
    const adjustedBn = parsed && (parsed / 1000n) * 995n;
    const adjustedAmount = adjustedBn && formatEther(adjustedBn);

    return (
        <Input
            readOnly
            disabled
            value={adjustedAmount || ''}
            placeholder="0.00000000"
            endAdornment={<TargetAssetSelect disabled={!!inProgressId} />}
        />
    );
};
