import { type DialogProps } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { styled, darken } from '@mui/material/styles';
import MuiDialog from '@mui/material/Dialog';

const Dialog = styled(MuiDialog)(({ theme: { palette, shape, spacing } }) => ({
    '& .MuiDialog-container .MuiDialog-paper': {
        outline: `1px solid ${palette.border.main}`,
        background: palette.grey[900],
    },
    '& .MuiDialogTitle-root': {
        padding: spacing(1.5),
    },
    '& .MuiDialogContent-root': {
        margin: spacing(0, 1.5, 1.5, 1.5),
        padding: 0,
        backgroundColor: darken(palette.grey[900], 0.4),
        borderRadius: shape.borderRadius,
        minHeight: '200px',
    },
    '& .selection-list::-webkit-scrollbar': {
        width: spacing(1),
    },
    '& .selection-list::-webkit-scrollbar-thumb': {
        background: palette.primary.dark,
        borderRadius: 10,
    },
}));

export const Modal = ({
    header,
    children,
    ...props
}: { header?: React.ReactNode } & DialogProps) => {
    return (
        <Dialog {...props} fullWidth maxWidth="xs">
            {header && <DialogTitle>{header}</DialogTitle>}
            <DialogContent>{children}</DialogContent>
        </Dialog>
    );
};
