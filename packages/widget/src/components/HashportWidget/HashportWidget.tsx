import { AmountInput } from './AmountInput';
import { ThemeProvider } from 'theme';
import { Container } from 'components/styled/Container';
import { ReceivedAmount } from './ReceivedAmount';
import { ConfirmationSlider } from './ConfirmationSlider';
import { InProgressHashportIdProvider } from 'contexts/inProgressHashportId';
import Stack from '@mui/material/Stack';

const WidgetContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <Container>
            <InProgressHashportIdProvider>
                <Stack spacing={2}>{children}</Stack>
            </InProgressHashportIdProvider>
        </Container>
    );
};

export const HashportWidget = () => {
    return (
        <ThemeProvider>
            <WidgetContainer>
                <div>
                    <AmountInput />
                    <ReceivedAmount />
                </div>
                <ConfirmationSlider />
            </WidgetContainer>
        </ThemeProvider>
    );
};
