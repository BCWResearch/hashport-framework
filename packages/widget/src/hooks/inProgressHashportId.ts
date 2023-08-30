import { InProgressHashportId } from 'contexts/inProgressHashportId';
import { useContext } from 'react';

export const useInProgressHashportId = () => {
    const inProgressHashportState = useContext(InProgressHashportId);
    if (!inProgressHashportState) throw 'Must use within InProgressHashportId Provider';
    return inProgressHashportState;
};
