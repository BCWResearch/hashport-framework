import { formatUnits } from 'viem';
import Stack from '@mui/material/Stack';
import {
    useBridgeParamsDispatch,
    useHashportClient,
    useHashportTransactionQueue,
    useProcessingTransaction,
    useProcessingTransactionDispatch,
    useSelectedTokens,
    useTokenList,
} from '@hashport/react-client';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { HashportTransactionData } from '@hashport/sdk';
import { Row } from 'components/styled/Row';
import { Button } from 'components/styled/Button';
import { TokenIcon } from 'components/TokenSelectionModal/TokenIcon';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

export const PersistedTxCheck = ({ children }: { children: React.ReactNode }) => {
    const hashportClient = useHashportClient();
    const { executeTransaction } = useProcessingTransactionDispatch();
    const { sourceAsset, targetAsset } = useSelectedTokens();
    const { status } = useProcessingTransaction();
    const { setBridgeParams, resetBridgeParams } = useBridgeParamsDispatch();
    const { isError, isLoading, data: tokens } = useTokenList();
    const transactionQueue = useHashportTransactionQueue();
    const [persistedTx, setPersistedTx] = useState<[string, HashportTransactionData]>();

    const amount = BigInt(persistedTx?.[1].params.amount ?? 0);
    const { decimals } = sourceAsset ?? { decimals: 0 };
    const formattedAmount = decimals && amount ? formatUnits(amount, decimals) : '';

    const handleCancel = () => {
        if (!persistedTx) return;
        hashportClient.transactionStore.deleteTransaction(persistedTx[0]);
        resetBridgeParams();
        setPersistedTx(undefined);
    };

    const handleResume = () => {
        if (!persistedTx) return;
        executeTransaction(persistedTx[0]);
        setPersistedTx(undefined);
    };

    useEffect(() => {
        if (transactionQueue.size > 0 && status === 'idle' && tokens) {
            const id = transactionQueue.keys().next().value;
            const transaction = transactionQueue.get(id);
            if (typeof id !== 'string' || !transaction) return;
            const { sourceAssetId, sourceNetworkId } = transaction.params;
            const amount = BigInt(transaction.params.amount ?? 0);
            const decimals = tokens.fungible.get(`${sourceAssetId}-${+sourceNetworkId}`)?.decimals;
            const formattedAmount = decimals && amount ? formatUnits(amount, decimals) : '';
            setBridgeParams({ ...transaction.params, amount: formattedAmount, tokenId: undefined });
            setPersistedTx([id, transaction]);
        }
    }, [transactionQueue, status, tokens, setBridgeParams]);

    if (persistedTx) {
        if (isError || isLoading) return 'Loading...';
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
