import { useProcessingTransaction, useProcessingTransactionDispatch } from '@hashport/react-client';
import Typography from '@mui/material/Typography';
import { ViewConfirmationTransactionButton } from 'components/TransactionState/TransactionExplorerLinkAndCopy';
import { Button } from 'components/styled/Button';
import { Collapse } from 'components/styled/Collapse';
import { Row } from 'components/styled/Row';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const AfterPortActions = () => {
    const { confirmCompletion } = useProcessingTransactionDispatch();
    const { confirmation } = useProcessingTransaction();

    return (
        <Collapse in={Boolean(confirmation)}>
            <Row my={2}>
                <CheckCircleIcon color="primary" />
                <Typography flexGrow={1} textAlign="center" color="white" variant="body1">
                    Complete!
                </Typography>
            </Row>
            <Row spacing={2}>
                <ViewConfirmationTransactionButton
                    confirmationId={confirmation?.confirmationTransactionHashOrId}
                />
                <Button fullWidth onClick={confirmCompletion}>
                    FINISH
                </Button>
            </Row>
        </Collapse>
    );
};
