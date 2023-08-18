import { getStepDescription, useHashportTransactionQueue } from '@hashport/react-client';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Collapse } from 'components/styled/Collapse';
import { Row } from 'components/styled/Row';
import { useInProgressHashportId } from 'hooks/inProgressHashportId';
import { useRef } from 'react';

export const StepDescription = () => {
    const [inProgressId] = useInProgressHashportId();
    const transactionQueue = useHashportTransactionQueue();
    const descriptionRef = useRef('');
    const currentStep = transactionQueue.get(inProgressId)?.steps[0];
    const description = currentStep && getStepDescription(currentStep);
    if (description) descriptionRef.current = description;

    return (
        <Collapse in={!!inProgressId && !!description}>
            <Row alignItems="center">
                <CircularProgress size={20} thickness={6} />
                <Typography flexGrow={1} textAlign="center" color="white" variant="body1">
                    {descriptionRef.current}
                </Typography>
            </Row>
        </Collapse>
    );
};
