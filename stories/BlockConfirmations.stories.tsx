import type { Meta, StoryObj } from '@storybook/react';
import { BlockConfirmations } from '@hashport/widget';

const meta = {
    title: 'Block Confirmations',
    component: BlockConfirmations,
    tags: ['autodocs'],
} satisfies Meta<typeof BlockConfirmations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BlockConfirmationsDemo: Story = {};
