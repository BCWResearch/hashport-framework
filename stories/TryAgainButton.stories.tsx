import type { Meta, StoryObj } from '@storybook/react';
import { TryAgainButton } from '../packages/widget/src/components/HashportWidget/TryAgainButton';

const meta = {
    title: 'Try Again Button',
    component: TryAgainButton,
    tags: ['autodocs'],
} satisfies Meta<typeof TryAgainButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TryAgainButtonDemo: Story = {};
