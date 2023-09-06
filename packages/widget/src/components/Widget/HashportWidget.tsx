import { AmountInput } from '../Inputs/AmountInput';
import { ThemeProvider } from 'theme';
import { Container } from 'components/styled/Container';
import { ReceivedAmount } from '../Inputs/ReceivedAmount';
import { ConfirmationSlider } from './ConfirmationSlider';
import Stack from '@mui/material/Stack';
import {
    HashportClientProviderWithRainbowKit,
    ProcessingTransactionProvider,
    useHashConnect,
    createHashPackSigner,
} from '@hashport/react-client';
import { ComponentProps } from 'react';
import { renderWidgetHeader } from '../Header/WidgetHeader';
import { BlockConfirmations } from '../TransactionState/BlockConfirmations';
import { DisconnectedAccountsFallback } from './DisconnectedAccountsFallback';
import { PersistedTxCheck } from './PersistedTxCheck';

const HashportWidget = (
    props: Omit<ComponentProps<typeof HashportClientProviderWithRainbowKit>, 'hederaSigner'>,
) => {
    const { hashConnect, pairingData } = useHashConnect();
    return (
        <ThemeProvider>
            <Container>
                <HashportClientProviderWithRainbowKit
                    {...props}
                    hederaSigner={
                        hashConnect && pairingData && createHashPackSigner(hashConnect, pairingData)
                    }
                    renderConnectButton={renderWidgetHeader(hashConnect)}
                    disconnectedAccountsFallback={<DisconnectedAccountsFallback />}
                >
                    <ProcessingTransactionProvider>
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
                    </ProcessingTransactionProvider>
                </HashportClientProviderWithRainbowKit>
            </Container>
        </ThemeProvider>
    );
};

export default HashportWidget;
