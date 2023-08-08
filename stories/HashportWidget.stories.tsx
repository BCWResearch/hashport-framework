import type { Meta, StoryObj } from '@storybook/react';
import { HashportWidget } from '../packages/widget/src/components/HashportWidget';
import { HashConnect, HashConnectTypes, MessageTypes } from 'hashconnect';
import React, { useEffect, useState } from 'react';
import { createHashPackSigner } from '@hashport/sdk/lib/adapters/hashpack';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { HashportClientAndRainbowKitProvider } from '@hashport/react-client';

const meta = {
    title: 'Hashport Widget',
    component: HashportWidget,
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: { control: 'color' },
    },
} satisfies Meta<typeof HashportWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

const APP_CONFIG = {
    name: `hashport`,
    description: `A public utility that facilitates the movement of digital assets between networks in a quick, secure, and cost-effective way`,
    icon: `https://www.hashport.network/wp-content/uploads/2021/06/hashport-glyph-light.svg`,
};

const hashconnect = new HashConnect(true);

const HashportContextWithHashpack = ({ children }: { children: React.ReactNode }) => {
    const [pairingData, setPairingData] = useState<HashConnectTypes.SavedPairingData>();
    const [foundExtension, setFoundExtension] = useState(false);

    const handleFoundExtension = data => {
        console.log('Found extension: ', data);
        setFoundExtension(true);
    };

    const handlePairingEvent = (data: MessageTypes.ApprovePairing) => {
        console.log('Pairing event: ', data);
        setPairingData(data.pairingData);
    };

    const initialize = async () => {
        try {
            console.log('========= initializing =========');
            hashconnect.foundExtensionEvent.on(handleFoundExtension);
            hashconnect.pairingEvent.on(handlePairingEvent);
            const initData = await hashconnect.init(APP_CONFIG, 'testnet');
            if (initData.savedPairings.length) setPairingData(initData.savedPairings[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const connect = async () => {
        if (foundExtension) {
            hashconnect.connectToLocalWallet();
        } else {
            console.log('no extension! trying to connect manually...');
            const result = await hashconnect.connect(hashconnect.hcData.pairingString);
            console.log(result);
        }
    };

    useEffect(() => {
        initialize();
        return () => {
            console.log('========= removing handlers =========');
            hashconnect.foundExtensionEvent.off(handleFoundExtension);
            hashconnect.pairingEvent.off(handlePairingEvent);
        };
    }, []);

    return (
        <>
            <button onClick={connect}>Connect HashConnect</button>
            <button onClick={() => hashconnect.clearConnectionsAndData()}>Clear HashConnect</button>
            <HashportClientAndRainbowKitProvider
                mode="testnet"
                hederaSigner={pairingData && createHashPackSigner(hashconnect, pairingData)}
            >
                <ConnectButton />
                {children}
            </HashportClientAndRainbowKitProvider>
        </>
    );
};

export const Widget: Story = {
    decorators: [
        story => {
            return <HashportContextWithHashpack>{story()}</HashportContextWithHashpack>;
        },
    ],
};
