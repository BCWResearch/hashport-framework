import type { Meta, StoryObj } from '@storybook/react';
import { BlockConfirmations } from '../packages/widget/src/components/HashportWidget/BlockConfirmations';

const meta = {
    title: 'Block Confirmations',
    component: BlockConfirmations,
    tags: ['autodocs'],
} satisfies Meta<typeof BlockConfirmations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BlockConfirmationsDemo: Story = {};
