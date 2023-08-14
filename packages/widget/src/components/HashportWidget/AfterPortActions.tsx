import { useBridgeParamsDispatch } from '@hashport/react-client';
import { HashportTransactionData } from '@hashport/sdk';
import Typography from '@mui/material/Typography';
import { ViewConfirmationTransactionButton } from 'components/TransactionState/TransactionExplorerLinkAndCopy';
import { Button } from 'components/styled/Button';
import { Collapse } from 'components/styled/Collapse';
import { Row } from 'components/styled/Row';
import { useInProgressHashportId } from 'hooks/inProgressHashportId';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const AfterPortActions = ({
    confirmationData,
}: {
    confirmationData: HashportTransactionData['state'] | undefined;
}) => {
    const setInProgressId = useInProgressHashportId()[1];
    const { resetBridgeParams } = useBridgeParamsDispatch();

    const handleFinish = () => {
        setInProgressId('');
        resetBridgeParams();
    };

    return (
        <Collapse in={Boolean(confirmationData)}>
            <Row my={2}>
                <CheckCircleIcon color="primary" />
                <Typography flexGrow={1} textAlign="center" color="white" variant="body1">
                    Complete!
                </Typography>
            </Row>
            <Row spacing={2}>
                <ViewConfirmationTransactionButton
                    confirmationId={confirmationData?.confirmationTransactionHashOrId}
                />
                <Button fullWidth onClick={handleFinish}>
                    FINISH
                </Button>
            </Row>
        </Collapse>
    );
};
