import { HashConnect, HashConnectTypes, MessageTypes } from 'hashconnect';
import { HashConnectConnectionState } from 'hashconnect/dist/esm/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

const APP_CONFIG = {
    name: `hashport`,
    description: `A public utility that facilitates the movement of digital assets between networks in a quick, secure, and cost-effective way`,
    icon: `https://www.hashport.network/wp-content/uploads/2021/06/hashport-glyph-light.svg`,
};

type UseHashConnectProps = {
    debug?: boolean;
    mode?: Parameters<HashConnect['init']>[1];
};

export const useHashConnect = ({ debug = false, mode = 'mainnet' }: UseHashConnectProps = {}) => {
    const hashConnect = useMemo(() => new HashConnect(debug), [debug]);
    const [pairingData, setPairingData] = useState<HashConnectTypes.SavedPairingData>();
    const [status, setStatus] = useState<HashConnectConnectionState>();

    const handlePairingEvent = (data: MessageTypes.ApprovePairing) => {
        setPairingData(data.pairingData);
    };

    const handleStatusChange = (data: HashConnectConnectionState) => {
        setStatus(data);
        if (data === 'Disconnected') setPairingData(undefined);
    };

    const initialize = useCallback(async () => {
        try {
            hashConnect.pairingEvent.on(handlePairingEvent);
            hashConnect.connectionStatusChangeEvent.on(handleStatusChange);
            const initData = await hashConnect.init(APP_CONFIG, mode);
            if (initData.savedPairings.length) setPairingData(initData.savedPairings[0]);
        } catch (error) {
            debug && console.log(error);
        }
    }, [hashConnect, mode, debug]);

    useEffect(() => {
        initialize();
        return () => {
            hashConnect.connectionStatusChangeEvent.off(handleStatusChange);
            hashConnect.pairingEvent.off(handlePairingEvent);
        };
    }, [initialize, hashConnect.pairingEvent, hashConnect.connectionStatusChangeEvent]);

    return { pairingData, hashConnect, status, initialize };
};
