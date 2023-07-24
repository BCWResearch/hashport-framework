import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const hashportQueryClient = new QueryClient();

export const HashportQueryClient = ({ children }: { children: React.ReactNode }) => {
    return <QueryClientProvider client={hashportQueryClient}>{children}</QueryClientProvider>;
};
