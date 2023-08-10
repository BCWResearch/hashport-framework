import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';

export const Input = styled(InputBase)(({ theme: { palette, shape, spacing, typography } }) => ({
    borderRadius: shape.borderRadius,
    backgroundColor: alpha(palette.grey[800], 0.4),
    padding: spacing(1.5),
    width: '100%',
    ...typography.h5,
    fontWeight: 600,
    outline: '1px solid transparent',
    transition: 'outline 250ms ease',
    '&:hover, &:focus, &:focus-within': {
        outline: `1px solid ${palette.border.light}`,
    },
    '&.MuiInputBase-adornedEnd .MuiButtonBase-root': {
        flexShrink: 0,
    },
}));
