import MuiCollapse from '@mui/material/Collapse';
import { styled } from '@mui/material/styles';

export const Collapse = styled(MuiCollapse)(({ in: inProp, theme: { spacing } }) => ({
    transition: 'margin-top 250ms ease, height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:not(:first-of-type)': {
        marginTop: spacing(inProp ? 1 : 0),
    },
}));
