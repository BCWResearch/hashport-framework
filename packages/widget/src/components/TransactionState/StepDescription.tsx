import { getStepDescription, useHashportTransactionQueue } from '@hashport/react-client';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Collapse } from 'components/styled/Collapse';
import { Row } from 'components/styled/Row';
import { useInProgressHashportId } from 'hooks/inProgressHashportId';

export const StepDescription = () => {
    const [inProgressId] = useInProgressHashportId();
    const transactionQueue = useHashportTransactionQueue();
    const currentStep = transactionQueue.get(inProgressId)?.steps[0];
    const description = currentStep ? getStepDescription(currentStep) : 'Please wait...';

    return (
        <Collapse in={!!inProgressId}>
            <Row alignItems="center">
                <CircularProgress size={20} thickness={6} />
                <Typography flexGrow={1} textAlign="center" color="white" variant="body1">
                    {description}
                </Typography>
            </Row>
        </Collapse>
    );
};
