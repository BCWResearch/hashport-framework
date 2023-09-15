import { useProcessingTransaction } from '@hashport/react-client';
import Stack from '@mui/material/Stack';
import { PersistedTxCheck } from './PersistedTxCheck';
import { AmountInput } from 'components/Inputs/AmountInput';
import { ReceivedAmount } from 'components/Inputs/ReceivedAmount';
import { ConfirmationSlider } from './ConfirmationSlider';
import { BlockConfirmations } from 'components/TransactionState/BlockConfirmations';
import { HashportProviders } from './HashportProviders';
import { ComponentProps, useContext, useEffect } from 'react';
import { Dialog, DialogContext } from 'contexts/dialogContext';

type WidgetDialogProps = {
    widgetProps: ComponentProps<typeof HashportProviders>;
    open: boolean;
    handleClose: () => void;
};

const DialogCloseBlocker = () => {
    const setCloseStatus = useContext(DialogContext);
    const { status } = useProcessingTransaction();
    const canClose = status === 'idle';

    useEffect(() => {
        setCloseStatus(canClose);
    }, [canClose, setCloseStatus]);
    return <></>;
};

const WidgetDialogContent = () => {
    return (
        <Stack spacing={2}>
            <PersistedTxCheck>
                <div>
                    <AmountInput />
                    <ReceivedAmount />
                </div>
                <ConfirmationSlider />
                <BlockConfirmations />
            </PersistedTxCheck>
        </Stack>
    );
};

const WidgetDialog = ({ open, handleClose, widgetProps }: WidgetDialogProps) => {
    return (
        <Dialog open={open} handleClose={handleClose}>
            <HashportProviders {...widgetProps}>
                <DialogCloseBlocker />
                <WidgetDialogContent />
            </HashportProviders>
        </Dialog>
    );
};

export default WidgetDialog;
