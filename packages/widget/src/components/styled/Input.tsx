import InputBase from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { transparentize } from 'theme/utils';

export const Input = styled(InputBase)(({ theme: { palette, shape, spacing, typography } }) => ({
    borderRadius: shape.borderRadius,
    backgroundColor: transparentize(palette.grey[800], 0.4),
    padding: spacing(1.5),
    width: '100%',
    ...typography.h5,
    fontWeight: 600,
    outline: '1px solid transparent',
    transition: 'outline 250ms ease',
    '&:hover, &:focus': {
        outline: `1px solid ${palette.border.light}`,
    },
}));
