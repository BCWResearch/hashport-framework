import { useProcessingTransaction, useProcessingTransactionDispatch } from '@hashport/react-client';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRef } from 'react';
import { Row } from 'components/styled/Row';

export const TryAgainButton = () => {
    const { executeTransaction, confirmCompletion } = useProcessingTransactionDispatch();
    const { error, id } = useProcessingTransaction();
    const errorMessageRef = useRef('');
    if (error) {
        errorMessageRef.current =
            typeof error === 'string'
                ? error
                : error instanceof Error
                ? error.message
                : 'Something went wrong';
    }

    const handleTryAgain = () => {
        console.log('trying again!');
        if (id) executeTransaction(id);
    };

    const handleCancel = () => {
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
                    color="error"
                    size="small"
                    variant="outlined"
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
            </Row>
        </Stack>
    );
};
