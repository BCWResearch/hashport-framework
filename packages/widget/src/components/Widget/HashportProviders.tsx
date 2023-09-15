import {
    HashportClientProviderWithRainbowKit,
    ProcessingTransactionProvider,
    createHashPackSigner,
    useHashConnect,
} from '@hashport/react-client';
import { renderWidgetHeader } from 'components/Header/WidgetHeader';
import { Container } from 'components/styled/Container';
import { ThemeProvider } from 'theme';
import { DisconnectedAccountsFallback } from './DisconnectedAccountsFallback';
import { ComponentProps } from 'react';

type HashportProvidersProps = Omit<
    ComponentProps<typeof HashportClientProviderWithRainbowKit>,
    'hederaSigner'
>;

export const HashportProviders = ({ children, mode, ...props }: HashportProvidersProps) => {
    const { hashConnect, pairingData } = useHashConnect({ mode, debug: mode === 'testnet' });
    return (
        <ThemeProvider>
            <Container>
                <HashportClientProviderWithRainbowKit
                    {...props}
                    mode={mode}
                    hederaSigner={
                        hashConnect && pairingData && createHashPackSigner(hashConnect, pairingData)
                    }
                    renderConnectButton={renderWidgetHeader(hashConnect)}
                    disconnectedAccountsFallback={<DisconnectedAccountsFallback />}
                >
                    <ProcessingTransactionProvider>{children}</ProcessingTransactionProvider>
                </HashportClientProviderWithRainbowKit>
            </Container>
        </ThemeProvider>
    );
};
