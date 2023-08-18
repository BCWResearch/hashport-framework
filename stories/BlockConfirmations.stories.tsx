import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BlockConfirmations } from '../packages/widget/src/components/HashportWidget/BlockConfirmations';
import { HashportClientProviderWithRainbowKit, useHashConnect } from '@hashport/react-client';
import { createHashPackSigner } from '@hashport/sdk';
import { InProgressHashportIdProvider } from '../packages/widget/src/contexts/inProgressHashportId';

const meta = {
    title: 'Block Confirmations',
    component: BlockConfirmations,
    tags: ['autodocs'],
} satisfies Meta<typeof BlockConfirmations>;

export default meta;
type Story = StoryObj<typeof meta>;

const Providers = ({ children }: { children: React.ReactNode }) => {
    const { hashConnect, pairingData } = useHashConnect();
    return (
        <div style={{ padding: '2em', backgroundColor: 'darkgrey' }}>
            <HashportClientProviderWithRainbowKit
                mode="testnet"
                hederaSigner={hashConnect && createHashPackSigner(hashConnect, pairingData)}
            >
                <InProgressHashportIdProvider>{children}</InProgressHashportIdProvider>
            </HashportClientProviderWithRainbowKit>
        </div>
    );
};

export const BlockConfirmationsDemo: Story = {
    decorators: [story => <Providers>{story()}</Providers>],
};
