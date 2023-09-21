import { useBridgeParamsDispatch } from '@hashport/react-client';
import { ChangeEventHandler } from 'react';

export const RecipientInput = () => {
    const { setRecipient } = useBridgeParamsDispatch();

    const handleRecipient: ChangeEventHandler<HTMLInputElement> = e => {
        setRecipient(e.target.value);
    };

    return <input placeholder="recipient" onChange={handleRecipient} />;
};
