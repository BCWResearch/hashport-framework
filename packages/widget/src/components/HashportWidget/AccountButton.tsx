import { Button } from 'components/styled/Button';
import { styled } from '@mui/material/styles';
import { ButtonProps } from '@mui/material/Button';
import Avatar from 'boring-avatars';

export const StyledButton = styled(Button)(
    ({ theme: { palette, breakpoints, spacing }, variant }) => ({
        fontFamily: ['Inter', '-apple-system', 'Segoe UI', 'Helvetica', 'sans-serif', 'monospace'],
        color: 'white',
        backgroundColor: variant === 'contained' ? palette.primary.dark : 'initial',
        '&:hover': {
            backgroundColor: palette.primary.main,
        },
        [breakpoints.down(400)]: {
            padding: spacing(0.5, 0.75),
            flexWrap: 'wrap-reverse',
            gap: spacing(1),
            overflowWrap: 'anywhere',
            '& .MuiButton-startIcon': { marginRight: 0 },
        },
    }),
);

export const AccountButton = ({ account, ...buttonProps }: ButtonProps & { account?: string }) => {
    return (
        <StyledButton
            {...buttonProps}
            startIcon={account ? <Avatar size={15} name={account} /> : undefined}
            variant={account ? 'contained' : 'outlined'}
        />
    );
};
