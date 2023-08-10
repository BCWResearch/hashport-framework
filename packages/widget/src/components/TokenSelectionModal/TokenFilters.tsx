import { useSelectionFilterDispatch } from 'hooks/selectionFilters';
import MuiInput from '@mui/material/InputBase';
import { darken, styled } from '@mui/material/styles';
import { useEffect } from 'react';

const Input = styled(MuiInput)(({ theme: { palette, spacing, typography } }) => ({
    borderRadius: spacing(1.5),
    backgroundColor: darken(palette.grey[900], 0.5),
    padding: spacing(1, 1.5),
    width: '100%',
    ...typography.body1,
    outline: '1px solid rgba(255, 255, 255, 0.6)',
    transition: 'outline 250ms ease',
    '&:hover, &:focus, &:focus-within': {
        outline: `1px solid ${palette.border.light}`,
    },
}));

export const TokenFilters = () => {
    const filterDispatch = useSelectionFilterDispatch();

    useEffect(() => () => filterDispatch.updateSearchString(''), [filterDispatch]);

    return (
        <Input
            autoFocus
            placeholder="Search for token"
            onChange={e => filterDispatch.updateSearchString(e.target.value)}
        />
    );
};
