import { AmountInput } from './AmountInput';
import { ThemeProvider } from 'theme';
import { Container } from 'components/styled/Container';
import { ReceivedAmount } from './ReceivedAmount';
import { ConfirmationSlider } from './ConfirmationSlider';
import { InProgressHashportIdProvider } from 'contexts/inProgressHashportId';
import { formatUnits } from 'viem';
import Stack from '@mui/material/Stack';
import {
    HashportClientProviderWithRainbowKit,
    useHashConnect,
    useHashportClient,
    useHashportTransactionQueue,
    useTokenList,
} from '@hashport/react-client';
import { ComponentProps, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { HashportTransactionData, createHashPackSigner } from '@hashport/sdk';
import { Row } from 'components/styled/Row';
import { Button } from 'components/styled/Button';
import { TokenIcon } from 'components/TokenSelectionModal/TokenIcon';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useInProgressHashportId } from 'hooks/inProgressHashportId';
import { renderWidgetHeader } from './WidgetHeader';
import { Alert } from 'components/styled/Alert';

const CheckForPersistedTransaction = ({ children }: { children: React.ReactNode }) => {
    const hashportClient = useHashportClient();
    const { data: tokens, isError, isLoading } = useTokenList();
    const transactionQueue = useHashportTransactionQueue();
    const setInProgressId = useInProgressHashportId()[1];
    const [persistedTx, setPersistedTx] = useState<[string, HashportTransactionData]>();

    const handleCancel = () => {
        if (!persistedTx) return;
        hashportClient.transactionStore.deleteTransaction(persistedTx[0]);
        setPersistedTx(undefined);
    };

    const handleResume = async () => {
        if (!persistedTx) return;
        hashportClient.execute(persistedTx[0]);
        // TODO: double check unintended side effects
        setInProgressId(persistedTx[0]);
        // TODO: set bridge params with the ones from persistedTx[1]
        setPersistedTx(undefined);
    };

    useEffect(() => {
        if (transactionQueue.size > 0) {
            const id = transactionQueue.keys().next().value;
            const transaction = transactionQueue.get(id);
            if (typeof id !== 'string' || !transaction) return;
            setPersistedTx([id, transaction]);
        }
    }, []);
    // TODO: refactor and add beter styles
    if (persistedTx) {
        if (isError || isLoading) return 'Loading...';
        const [id, { params }] = persistedTx;
        const { sourceAssetId, sourceNetworkId, targetNetworkId, amount } = params;
        const sourceAsset = tokens.fungible.get(`${sourceAssetId}-${+sourceNetworkId}`);
        const formattedAmount =
            sourceAsset?.decimals && amount
                ? formatUnits(BigInt(amount), sourceAsset.decimals)
                : '';
        const targetAssetId = sourceAsset?.bridgeableAssets.find(
            ({ chainId }) => +targetNetworkId === chainId,
        )?.assetId;
        const targetAsset = targetAssetId && tokens.fungible.get(targetAssetId);
        return (
            <Stack justifyContent="center" spacing={1}>
                <Typography align="center" color="white">
                    An unfinished transaction was for {formattedAmount} {sourceAsset?.symbol} was
                    found:
                </Typography>
                {sourceAsset && targetAsset ? (
                    <Row justifyContent="center" alignItems="center">
                        <TokenIcon token={sourceAsset} />
                        <ArrowRightIcon color="action" />
                        <TokenIcon token={targetAsset} />
                    </Row>
                ) : (
                    ''
                )}
                <Typography align="center" color="white">
                    Would you like to resume this transaction?
                </Typography>
                <Row width="100%" spacing={2}>
                    <Button onClick={handleResume} sx={{ flexGrow: 1 }}>
                        Continue
                    </Button>
                    <Button onClick={handleCancel} sx={{ flexGrow: 1 }}>
                        Cancel
                    </Button>
                </Row>
            </Stack>
        );
    } else {
        return children;
    }
};

export const HashportWidget = (
    props: Omit<ComponentProps<typeof HashportClientProviderWithRainbowKit>, 'hederaSigner'>,
) => {
    const { hashConnect, pairingData } = useHashConnect();
    return (
        <ThemeProvider>
            <Container>
                <HashportClientProviderWithRainbowKit
                    {...props}
                    hederaSigner={hashConnect && createHashPackSigner(hashConnect, pairingData)}
                    renderConnectButton={renderWidgetHeader(hashConnect)}
                    disconnectedAccountsFallback={
                        <Alert severity="info" variant="outlined">
                            Please connect both Hedera and EVM accounts to start bridging.
                        </Alert>
                    }
                >
                    <InProgressHashportIdProvider>
                        <Stack spacing={2}>
                            <CheckForPersistedTransaction>
                                <div>
                                    <AmountInput />
                                    <ReceivedAmount />
                                </div>
                                <ConfirmationSlider />
                            </CheckForPersistedTransaction>
                        </Stack>
                    </InProgressHashportIdProvider>
                </HashportClientProviderWithRainbowKit>
            </Container>
        </ThemeProvider>
    );
};
