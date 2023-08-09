import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const Container = styled(Box)(({ theme: { breakpoints, palette, spacing, shape } }) => ({
    maxWidth: `calc(${breakpoints.values.sm}px - ${spacing(2)})`,
    outline: `1px solid ${palette.border.main}`,
    borderRadius: shape.borderRadius,
    '-webkit-backdrop-filter': 'blur(5px)',
    backdropFilter: 'blur(5px)',
    backgroundColor: palette.primary.dark,
    padding: spacing(1),
    [breakpoints.up(`sm`)]: {
        padding: spacing(2),
    },
}));
