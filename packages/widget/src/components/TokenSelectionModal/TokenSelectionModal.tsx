import { useBridgeParamsDispatch, useTokenList } from '@hashport/react-client';
import { VariableSizeList } from 'react-window';
import { type DialogProps } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { TokenRow } from './TokenRow';
import { styled, darken } from '@mui/material/styles';
import MuiDialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';

const Dialog = styled(MuiDialog)(({ theme: { palette, shape, spacing } }) => ({
    '& .MuiDialog-container .MuiDialog-paper': {
        outline: `1px solid ${palette.border.main}`,
        background: palette.grey[900],
    },
    '& .MuiDialogTitle-root': {
        padding: spacing(2, 2, 1, 2),
    },
    '& .MuiDialogContent-root': {
        margin: spacing(0, 1, 1, 1),
        padding: 0,
        backgroundColor: darken(palette.grey[900], 0.4),
        borderRadius: shape.borderRadius,
    },
    '& .token-list::-webkit-scrollbar': {
        width: spacing(1),
    },
    '& .token-list::-webkit-scrollbar-thumb': {
        background: palette.primary.dark,
        borderRadius: 10,
    },
}));

export const TokenSelectionModal = ({ open, onClose, ...props }: DialogProps) => {
    const dispatch = useBridgeParamsDispatch();
    const { data: tokens } = useTokenList({
        onSelect(token) {
            console.log('id: ', token.id);
            // dispatch.setSourceAsset(token);
            // onClose?.({}, 'backdropClick');
        },
    });
    const ITEM_SIZE = 56;
    const LIST_HEIGHT = Math.max(window.innerHeight - 350, 250);

    if (!tokens) {
        // TODO: Add style
        return <p>Loading</p>;
    }

    const fungibleTokens = Array.from(tokens.fungible.values());

    return (
        <Dialog {...props} onClose={onClose} fullWidth maxWidth="xs" open={open}>
            <DialogTitle>
                <Typography variant="h5">Select a Token</Typography>
            </DialogTitle>
            <DialogContent>
                <VariableSizeList
                    // ref={scrollRef}
                    className="token-list"
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
            </DialogContent>
        </Dialog>
    );
};
