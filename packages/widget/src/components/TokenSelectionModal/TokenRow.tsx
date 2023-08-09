import { AssetInfo } from '@hashport/react-client';
import { type ListChildComponentProps } from 'react-window';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import ListItemButton from '@mui/material/ListItemButton';
import { styled } from '@mui/material/styles';

const TokenRowButton = styled(ListItemButton)(({ theme: { palette, spacing } }) => ({
    gap: spacing(2),
    '&:hover': {
        backgroundColor: palette.primary.dark,
    },
    '& .MuiAvatar-root': {
        width: '32px',
        height: '32px',
    },
}));

export const TokenRow = ({ data, index }: ListChildComponentProps<AssetInfo[]>) => {
    const token = data[index];

    return (
        <TokenRowButton key={token.id} onClick={() => token.handleSelect()}>
            <Avatar alt={token.symbol} src={token.icon} />
            <ListItemText primary={token.symbol} />
        </TokenRowButton>
    );
};
