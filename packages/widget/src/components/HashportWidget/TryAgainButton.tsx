import { useProcessingTransaction, useProcessingTransactionDispatch } from '@hashport/react-client';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useRef } from 'react';

const Button = styled(MuiButton)(({ theme: { spacing, palette } }) => ({}));

export const TryAgainButton = (props: ButtonProps) => {
    // TODO: add error message and click handler. Then remove props.
    const { executeTransaction, confirmCompletion } = useProcessingTransactionDispatch();
    const { error, id } = useProcessingTransaction();
    const message = error instanceof Error ? error.message : '';
    const errorMessageRef = useRef(message);
    if (message) errorMessageRef.current = message;

    return (
        <Stack spacing={1}>
            <Typography textAlign="center" color="white" variant="body1">Test</Typography>
            <Button {...props} fullWidth color="error">
                Try Again
            </Button>
        </Stack>
    );
};
