import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DisconnectedAccountsFallback, Container } from '@hashport/widget';

const meta = {
    title: 'Disconnected Accounts Fallback',
    component: DisconnectedAccountsFallback,
    tags: ['autodocs'],
} satisfies Meta<typeof DisconnectedAccountsFallback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DisconnectedAccountsFallbackDemo: Story = {
    decorators: [story => <Container>{story()}</Container>],
};
