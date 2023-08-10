import { AssetInfo, useBridgeParamsDispatch, useTokenList } from '@hashport/react-client';
import { VariableSizeList, type ListChildComponentProps } from 'react-window';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import ListItemButton from '@mui/material/ListItemButton';
import { styled } from '@mui/material/styles';
import { useSelectionFilters } from 'hooks/selectionFilters';

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

export const SelectSourceTokenList = ({ onSelect }: { onSelect?: () => void } = {}) => {
    const { setSourceAsset } = useBridgeParamsDispatch();
    const {
        data: tokens,
        isError,
        isLoading,
    } = useTokenList({
        onSelect(token) {
            setSourceAsset(token);
            onSelect?.();
        },
    });
    const { filters, searchString } = useSelectionFilters();

    const ITEM_SIZE = 56;
    const LIST_HEIGHT = Math.max(window.innerHeight - 350, 250);

    if (isLoading) {
        return <p>Loading</p>;
    } else if (isError) {
        return <p>Error</p>;
    }

    const fungibleTokens = Array.from(tokens.fungible.values()).filter(
        ({ id, symbol, name, ...rest }) => {
            const isSearchMatch =
                !searchString ||
                `${id}${symbol}${name}`.toLowerCase().includes(searchString.toLowerCase());
            // TODO: handle filters match
            const isFiltersMatch = false;
            return isSearchMatch || isFiltersMatch;
        },
    );

    return fungibleTokens.length > 0 ? (
        <VariableSizeList
            // ref={scrollRef}
            className="selection-list"
            itemCount={fungibleTokens.length}
            itemSize={() => ITEM_SIZE}
            height={LIST_HEIGHT}
            itemData={fungibleTokens}
            itemKey={(index, data) => data[index].id}
            overscanCount={20}
            width="100%"
        >
            {TokenRow}
        </VariableSizeList>
    ) : (
        // TODO: better styling
        <p>No results</p>
    );
};
