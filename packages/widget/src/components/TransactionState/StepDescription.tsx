import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Collapse } from 'components/styled/Collapse';
import { Row } from 'components/styled/Row';

export const StepDescription = ({ description }: { description: string | undefined }) => {
    return (
        <Collapse in={!!description}>
            <Row alignItems="center">
                <CircularProgress size={20} thickness={6} />
                <Typography flexGrow={1} textAlign="center" color="white" variant="body1">
                    {description ?? ''}
                </Typography>
            </Row>
        </Collapse>
    );
};
