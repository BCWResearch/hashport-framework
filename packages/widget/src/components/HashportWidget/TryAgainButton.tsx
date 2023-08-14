import MuiButton, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const Button = styled(MuiButton)(({ theme: { spacing, palette } }) => ({}));

export const TryAgainButton = (props: ButtonProps) => {
    return (
        <Button {...props} fullWidth color="error">
            Try Again
        </Button>
    );
};
