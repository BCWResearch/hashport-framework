import { createContext, useState } from 'react';

export const InProgressHashportId = createContext<
    [string, React.Dispatch<React.SetStateAction<string>>] | null
>(null);

export const InProgressHashportIdProvider = ({ children }: { children: React.ReactNode }) => {
    const hashportIdState = useState('');
    return (
        <InProgressHashportId.Provider value={hashportIdState}>
            {children}
        </InProgressHashportId.Provider>
    );
};
