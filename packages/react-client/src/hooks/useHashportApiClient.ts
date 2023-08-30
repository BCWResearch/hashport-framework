import { useContext } from 'react';
import { HashportApiContext } from '../contexts/hashportApi';

export const useHashportApiClient = () => {
    const client = useContext(HashportApiContext);
    if (!client) throw 'Hashport Api Client must be used within context';
    return client;
};
