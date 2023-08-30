import {
    AssetInfo,
    useBridgeParams,
    useBridgeParamsDispatch,
    useTokenList,
} from '@hashport/react-client';
import { VariableSizeList, type ListChildComponentProps } from 'react-window';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { styled } from '@mui/material/styles';
import { useSelectionFilters } from 'hooks/selectionFilters';
import { TokenIcon } from './TokenIcon';
import { AssetInfoWithBalance, useTokensWithBalances } from '@hashport/react-client';
import Typography from '@mui/material/Typography';
import { formatUnits } from 'viem';

const TokenRowButton = styled(ListItemButton)(({ theme: { palette, spacing } }) => ({
    gap: spacing(2),
    '&:hover': {
        backgroundColor: palette.primary.dark,
    },
    '& .MuiAvatar-root': {
        width: '32px',
        height: '32px',
    },
    '& .MuiListItemText-root': {
        display: 'flex',
        justifyContent: 'space-between',
    },
}));

const TokenRow = ({ data, index, style }: ListChildComponentProps<AssetInfoWithBalance[]>) => {
    const token = data[index];
    const { balance, decimals = 0, id, chainId, symbol } = token;
    const { format } = new Intl.NumberFormat(`en-US`, {
        maximumFractionDigits: 3,
        useGrouping: true,
    });
    const displayBalance =
        balance === undefined ? balance : format(parseFloat(formatUnits(balance, decimals)));

    return (
        <TokenRowButton key={`${id}-${chainId}`} onClick={() => token.handleSelect()} style={style}>
            <TokenIcon token={token} />
            <ListItemText primary={symbol} secondary={displayBalance} />
        </TokenRowButton>
    );
};

const TokenList = ({ tokens }: { tokens: AssetInfoWithBalance[] }) => {
    const ITEM_SIZE = 56;
    const LIST_HEIGHT = Math.max(window.innerHeight - 350, 250);
    return (
        <VariableSizeList
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
    const { tokens, isError, isLoading } = useTokensWithBalances({
        onSelect(token) {
            setSourceAsset(token);
            onSelect?.();
        },
    });
    const { searchString } = useSelectionFilters();

    if (isLoading || isError) {
        return (
            <Typography mt={1} align="center" variant="body1">
                {isLoading ? 'Loading assets...' : 'Unable to load assets'}
            </Typography>
        );
    }

    const fungibleTokens = tokens
        .filter((token): token is AssetInfo & { balance: undefined | bigint } => {
            if (!token) return false;
            const { id, symbol, name } = token;
            const matchString = `${id}${symbol}${name}`.toLowerCase();
            const isSearchMatch = !searchString || matchString.includes(searchString);
            return isSearchMatch;
        })
        .sort((a, b) => {
            if (a.balance === undefined && b.balance === undefined) return 0;
            else if (a.balance === undefined) return 1;
            else if (b.balance === undefined) return -1;
            else return a.balance > b.balance ? -1 : a.balance < b.balance ? 1 : 0;
        });

    return fungibleTokens.length > 0 ? (
        <TokenList tokens={fungibleTokens} />
    ) : (
        <Typography mt={1} align="center" variant="body1">
            No results
        </Typography>
    );
};

export const SelectTargetTokenList = ({ onSelect }: { onSelect?: () => void } = {}) => {
    const { setTargetAsset } = useBridgeParamsDispatch();
    const { data: allTokens } = useTokenList();
    const { tokens, isError, isLoading } = useTokensWithBalances({
        onSelect(token) {
            setTargetAsset(token);
            onSelect?.();
        },
    });
    const { searchString } = useSelectionFilters();
    const { sourceAssetId, sourceNetworkId } = useBridgeParams();

    const source = { id: sourceAssetId, chain: sourceNetworkId };
    const sourceId = source.id && source.chain ? (`${source.id}-${+source.chain}` as const) : null;
    const sourceAsset = sourceId && allTokens?.fungible.get(sourceId);
    const bridgeableAssets = sourceAsset ? sourceAsset?.bridgeableAssets : null;

    if (isLoading || isError) {
        return (
            <Typography mt={1} align="center" variant="body1">
                {isLoading ? 'Loading assets...' : 'Unable to load assets'}
            </Typography>
        );
    }

    const fungibleTokens = tokens.filter((token): token is AssetInfoWithBalance => !!token);
    const targetTokens = (bridgeableAssets ?? [])
        .map(({ assetId }) =>
            fungibleTokens.find(({ id, chainId }) => assetId === `${id}-${chainId}`),
        )
        .filter((token): token is AssetInfoWithBalance => {
            if (!token) return false;
            const { id, symbol, name } = token;
            const matchString = `${id}${symbol}${name}`.toLowerCase();
            const isSearchMatch = !searchString || matchString.includes(searchString);
            return isSearchMatch;
        });

    return targetTokens.length > 0 ? (
        <TokenList tokens={targetTokens} />
    ) : (
        <Typography mt={1} align="center" variant="body1">
            No results
        </Typography>
    );
};
