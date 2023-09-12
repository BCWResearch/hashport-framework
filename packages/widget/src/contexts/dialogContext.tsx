import Box from '@mui/material/Box';
import MuiDialog from '@mui/material/Dialog';
import { createContext, useState } from 'react';

type DialogProps = {
    open: boolean;
    handleClose: () => void;
    children: React.ReactNode;
};

export const DialogContext = createContext<(status: boolean) => void>(() => null);

export const Dialog = ({ open, handleClose, children }: DialogProps) => {
    const [canClose, setCanClose] = useState(true);

    const handleCloseRequest = () => {
        if (canClose) handleClose();
    };

    return (
        <MuiDialog keepMounted open={open} PaperComponent={Box} onClose={handleCloseRequest}>
            <DialogContext.Provider value={setCanClose}>{children}</DialogContext.Provider>
        </MuiDialog>
    );
};
