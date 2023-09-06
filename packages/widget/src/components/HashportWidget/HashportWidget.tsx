import { AmountInput } from './AmountInput';
import { ThemeProvider } from 'theme';
import { Container } from 'components/styled/Container';
import { ReceivedAmount } from './ReceivedAmount';
import { ConfirmationSlider } from './ConfirmationSlider';
import { formatUnits } from 'viem';
import Stack from '@mui/material/Stack';
import {
    HashportClientProviderWithRainbowKit,
    ProcessingTransactionProvider,
    useBridgeParamsDispatch,
    useHashConnect,
    useHashportClient,
    useHashportTransactionQueue,
    useProcessingTransactionDispatch,
    useTokenList,
} from '@hashport/react-client';
import { ComponentProps, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { HashportTransactionData, createHashPackSigner } from '@hashport/sdk';
import { Row } from 'components/styled/Row';
import { Button } from 'components/styled/Button';
import { TokenIcon } from 'components/TokenSelectionModal/TokenIcon';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { renderWidgetHeader } from './WidgetHeader';
import { BlockConfirmations } from './BlockConfirmations';
import { DisconnectedAccountsFallback } from './DisconnectedAccountsFallback';

const CheckForPersistedTransaction = ({ children }: { children: React.ReactNode }) => {
    const hashportClient = useHashportClient();
    const { executeTransaction } = useProcessingTransactionDispatch();
    const { setAmount } = useBridgeParamsDispatch();
    const { data: tokens, isError, isLoading } = useTokenList();
    const transactionQueue = useHashportTransactionQueue();
    const [persistedTx, setPersistedTx] = useState<[string, HashportTransactionData]>();

    const handleCancel = () => {
        if (!persistedTx) return;
        hashportClient.transactionStore.deleteTransaction(persistedTx[0]);
        setPersistedTx(undefined);
    };

    const handleResume = (amountParams: Parameters<typeof setAmount>[0]) => async () => {
        if (!persistedTx) return;
        setAmount(amountParams);
        executeTransaction(persistedTx[0]);
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
        const { params } = persistedTx[1];
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
                    <Button
                        onClick={handleResume({
                            amount: formattedAmount,
                            sourceAssetDecimals: sourceAsset?.decimals,
                            targetAssetDecimals: targetAsset?.decimals,
                        })}
                        sx={{ flexGrow: 1 }}
                    >
                        Continue
                    </Button>
                    <Button variant="outlined" onClick={handleCancel} sx={{ flexGrow: 1 }}>
                        Cancel
                    </Button>
                </Row>
            </Stack>
        );
    } else {
        return children;
    }
};

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
                            <CheckForPersistedTransaction>
                                <div>
                                    <AmountInput />
                                    <ReceivedAmount />
                                </div>
                                <ConfirmationSlider />
                                <BlockConfirmations />
                            </CheckForPersistedTransaction>
                        </Stack>
                    </ProcessingTransactionProvider>
                </HashportClientProviderWithRainbowKit>
            </Container>
        </ThemeProvider>
    );
};

export default HashportWidget;
