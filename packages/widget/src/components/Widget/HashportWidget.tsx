import { AmountInput } from '../Inputs/AmountInput';
import { ReceivedAmount } from '../Inputs/ReceivedAmount';
import { ConfirmationSlider } from './ConfirmationSlider';
import Stack from '@mui/material/Stack';
import { HashportClientProviderWithRainbowKit } from '@hashport/react-client';
import { ComponentProps } from 'react';
import { BlockConfirmations } from '../TransactionState/BlockConfirmations';
import { PersistedTxCheck } from './PersistedTxCheck';
import { HashportProviders } from './HashportProviders';

const HashportWidget = (
    props: Omit<ComponentProps<typeof HashportClientProviderWithRainbowKit>, 'hederaSigner'>,
) => {
    return (
        <HashportProviders {...props}>
            <Stack spacing={2}>
                <PersistedTxCheck>
                    <div>
                        <AmountInput />
                        <ReceivedAmount />
                    </div>
                    <ConfirmationSlider />
                    <BlockConfirmations />
                </PersistedTxCheck>
            </Stack>
        </HashportProviders>
    );
};

export default HashportWidget;
