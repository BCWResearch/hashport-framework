import { useBridgeParams, useProcessingTransaction } from '@hashport/react-client';
import { Input } from 'components/styled/Input';
import { TargetAssetSelect } from './TargetAssetSelect';
import { parseEther, formatEther } from 'viem';

export const ReceivedAmount = () => {
    const { amount } = useBridgeParams();
    const { status } = useProcessingTransaction();

    const parsed = amount ? parseEther(amount) : undefined;
    const adjustedBn = parsed && (parsed / 1000n) * 995n;
    const adjustedAmount = adjustedBn && formatEther(adjustedBn);

    return (
        <Input
            readOnly
            disabled
            value={adjustedAmount || ''}
            placeholder="0.00000000"
            endAdornment={<TargetAssetSelect disabled={status !== 'idle'} />}
        />
    );
};
