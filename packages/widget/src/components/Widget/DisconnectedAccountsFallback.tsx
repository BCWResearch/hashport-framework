import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Input } from 'components/styled/Input';

export const DisconnectedAccountsFallback = () => {
    return (
        <Stack gap={2}>
            <Input
                disabled
                placeholder="0.00000000"
                sx={({ spacing }) => ({ minHeight: `calc(${spacing(9)} + 4px)` })}
            />
            <Input
                disabled
                placeholder="0.00000000"
                sx={({ spacing }) => ({ minHeight: `calc(${spacing(9)} + 4px)` })}
            />
            <Alert
                sx={({ spacing }) => ({ height: spacing(5.25), alignItems: 'center' })}
                severity="info"
                variant="outlined"
            >
                Please connect both Hedera and EVM accounts to start bridging.
            </Alert>
        </Stack>
    );
};
