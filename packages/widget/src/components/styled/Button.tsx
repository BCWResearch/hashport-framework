import { styled } from '@mui/material/styles';
import MuiButton from '@mui/material/Button';

export const Button = styled(MuiButton)(({ theme: { shape, palette, spacing } }) => ({
    padding: spacing(0.75, 1.5),
    borderRadius: shape.borderRadius - 2,
    fontWeight: 300,
    transition: 'all 250ms ease',
    textTransform: 'none',
    '& .MuiButton-endIcon': {
        marginLeft: 0,
    },
    '&:hover': {
        backgroundColor: palette.primary.dark,
        color: palette.mode === 'dark' ? 'white' : 'black',
    },
}));
