import { getStepDescription, useProcessingTransaction } from '@hashport/react-client';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Collapse } from 'components/styled/Collapse';
import { Row } from 'components/styled/Row';
import { useRef } from 'react';

export const StepDescription = () => {
    const { currentTransaction, status } = useProcessingTransaction();
    const descriptionRef = useRef('');
    const currentStep = currentTransaction?.steps[0];
    const isAssociating = currentTransaction?.state.tokenAssociationStatus === 'ASSOCIATING';
    const description = currentStep && getStepDescription(currentStep, isAssociating);
    if (description) descriptionRef.current = description;

    return (
        <Collapse in={status === 'processing' && !!description}>
            <Row alignItems="center">
                <CircularProgress size={20} thickness={6} />
                <Typography flexGrow={1} textAlign="center" color="white" variant="body1">
                    {descriptionRef.current}
                </Typography>
            </Row>
        </Collapse>
    );
};
