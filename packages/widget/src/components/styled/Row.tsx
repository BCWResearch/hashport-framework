import { type StackProps } from '@mui/material';
import Stack from '@mui/material/Stack';

export const Row = ({ children, ...props }: StackProps) => {
    return (
        <Stack {...props} direction="row">
            {children}
        </Stack>
    );
};
