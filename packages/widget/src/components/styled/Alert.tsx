import { styled } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';

export const Alert = styled(MuiAlert)(({ theme: { palette, spacing }, variant }) => ({
    borderRadius: spacing(1),
    ...(variant === 'outlined'
        ? {
              borderColor: palette.primary.light,
              backgroundColor: palette.primary.dark,
              color: palette.primary.light,
          }
        : {}),
}));
