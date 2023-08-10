import {
    AssetInfo,
    useBridgeParams,
    useBridgeParamsDispatch,
    useTokenList,
} from '@hashport/react-client';
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

const TokenRow = ({ data, index, style }: ListChildComponentProps<AssetInfo[]>) => {
    const token = data[index];

    return (
        <TokenRowButton key={token.id} onClick={() => token.handleSelect()} style={style}>
            <Avatar alt={token.symbol} src={token.icon} />
            <ListItemText primary={token.symbol} />
        </TokenRowButton>
    );
};

const TokenList = ({ tokens }: { tokens: AssetInfo[] }) => {
    const ITEM_SIZE = 56;
    const LIST_HEIGHT = Math.max(window.innerHeight - 350, 250);
    return (
        <VariableSizeList
            // ref={scrollRef}
            className="selection-list"
            itemCount={tokens.length}
            itemSize={() => ITEM_SIZE}
            height={LIST_HEIGHT}
            itemData={tokens}
            itemKey={(index, data) => {
                const { chainId, id } = data[index];
                return `${id}-${chainId}`;
            }}
            overscanCount={20}
            width="100%"
        >
            {TokenRow}
        </VariableSizeList>
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

    if (isLoading) {
        return <p>Loading</p>;
    } else if (isError) {
        return <p>Error</p>;
    }

    // TODO: sort tokens
    const fungibleTokens = Array.from(tokens.fungible.values()).filter(
        ({ id, symbol, name, ...rest }) => {
            const isSearchMatch =
                !searchString ||
                `${id}-${symbol}-${name}`.toLowerCase().includes(searchString.toLowerCase());
            // TODO: handle filters match
            const isFiltersMatch = false;
            return isSearchMatch || isFiltersMatch;
        },
    );

    return fungibleTokens.length > 0 ? (
        <TokenList tokens={fungibleTokens} />
    ) : (
        // TODO: better styling
        <p>No results</p>
    );
};

export const SelectTargetTokenList = ({ onSelect }: { onSelect?: () => void } = {}) => {
    const { setTargetAsset } = useBridgeParamsDispatch();
    const {
        data: tokens,
        isError,
        isLoading,
    } = useTokenList({
        onSelect(token) {
            setTargetAsset(token);
            onSelect?.();
        },
    });
    const { filters, searchString } = useSelectionFilters();
    const { sourceAssetId, sourceNetworkId } = useBridgeParams();

    const source = { id: sourceAssetId, chain: sourceNetworkId };
    const sourceId = source.id && source.chain ? (`${source.id}-${+source.chain}` as const) : null;
    const sourceAsset = sourceId && tokens?.fungible.get(sourceId);
    const bridgeableAssets = sourceAsset ? sourceAsset?.bridgeableAssets : null;

    if (isLoading) {
        return <p>Loading</p>;
    } else if (isError) {
        return <p>Error</p>;
    }

    // TODO: sort tokens
    const targetTokens = (bridgeableAssets ?? [])
        .map(({ assetId }) => tokens.fungible.get(assetId))
        // TODO: remove double filter
        .filter((token): token is AssetInfo => !!token)
        .filter(({ id, symbol, name, ...rest }) => {
            const isSearchMatch =
                !searchString ||
                `${id}-${symbol}-${name}`.toLowerCase().includes(searchString.toLowerCase());
            // TODO: handle filters match
            const isFiltersMatch = false;
            return isSearchMatch || isFiltersMatch;
        });

    return targetTokens.length > 0 ? (
        <TokenList tokens={targetTokens} />
    ) : (
        // TODO: better styling
        <p>No results</p>
    );
};
