import { HashportContext } from 'contexts/hashportContext';
import { useContext } from 'react';

export const useHashportClient = () => {
    const hashportClient = useContext(HashportContext);
    if (!HashportContext) throw 'useHashportClient must be used within HashportContext';
    return hashportClient;
};
