import { styled } from '@mui/material/styles';
import MuiButton from '@mui/material/Button';

export const Button = styled(MuiButton)(({ theme: { shape, palette, spacing } }) => ({
    padding: spacing(0.75, 1.5),
    borderRadius: shape.borderRadius - 2,
    backgroundColor: palette.primary.light,
    color: 'black',
    fontWeight: 300,
    transition: 'all 250ms ease',
    '& .MuiButton-endIcon': {
        marginLeft: 0,
    },
    '&:hover': {
        backgroundColor: palette.primary.dark,
        color: 'white',
    },
}));
