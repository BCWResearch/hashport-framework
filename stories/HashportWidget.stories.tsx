import type { Meta, StoryObj } from '@storybook/react';
import HashportWidget from '../packages/widget/src/components/HashportWidget/HashportWidget';

const meta = {
    title: 'Hashport Widget',
    component: HashportWidget,
    tags: ['autodocs'],
} satisfies Meta<typeof HashportWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TestnetWidget: Story = {
    args: {
        mode: 'testnet',
    },
};
export const MainnetWidget: Story = {
    args: {
        mode: 'mainnet',
    },
};
