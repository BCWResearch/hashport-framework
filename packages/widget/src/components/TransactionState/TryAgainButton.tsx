import {
    useHashportClient,
    useProcessingTransaction,
    useProcessingTransactionDispatch,
} from '@hashport/react-client';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRef } from 'react';
import { Row } from 'components/styled/Row';
import { TransactionExecutionError, UserRejectedRequestError } from 'viem';

const toCSV = (input: object) => {
    const headers = Object.keys(input).join(',');
    const values = Object.values(input)
        .map(v => `"${JSON.stringify(v, null, 2).replace(/"/g, '')}"`)
        .join(',');
    const csvData = new Blob([[headers, values].join('\n')], { type: 'text/csv' });
    return URL.createObjectURL(csvData);
};

const getErrorMessage = (e: unknown) => {
    if (typeof e === 'string') return e;
    else if (e instanceof Error) {
        return e instanceof UserRejectedRequestError || e instanceof TransactionExecutionError
            ? 'Please try again and accept the prompt in your wallet.'
            : e.message;
    } else {
        return 'Something went wrong';
    }
};

export const TryAgainButton = () => {
    const hashportClient = useHashportClient();
    const { executeTransaction, confirmCompletion } = useProcessingTransactionDispatch();
    const { error, id, currentTransaction } = useProcessingTransaction();
    const currentTransactionRef = useRef(currentTransaction);
    const errorMessageRef = useRef('');

    if (currentTransaction) {
        currentTransactionRef.current = currentTransaction;
    }

    if (error) {
        errorMessageRef.current = getErrorMessage(error);
    }

    const handleTryAgain = () => {
        if (id) executeTransaction(id);
    };

    const handleCancel = () => {
        if (id) hashportClient.transactionStore.deleteTransaction(id);
        confirmCompletion();
    };

    return (
        <Stack spacing={1}>
            <Typography textAlign="center" color="white" variant="body1">
                {errorMessageRef.current}
            </Typography>
            <Row gap={2}>
                <Button fullWidth color="error" onClick={handleTryAgain}>
                    Try Again
                </Button>
                <Button
                    fullWidth
                    download={`hashport-${Date.now()}.csv`}
                    href={toCSV(currentTransactionRef.current?.state ?? {})}
                    color="error"
                    size="small"
                    variant="outlined"
                    onClick={handleCancel}
                >
                    Download Receipt & Cancel
                </Button>
            </Row>
        </Stack>
    );
};
