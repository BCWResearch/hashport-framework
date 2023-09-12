import type { Meta, StoryObj } from '@storybook/react';
import { LazyHashportWidget } from '@hashport/widget';

const meta = {
    title: 'Lazy Hashport Widget',
    component: LazyHashportWidget,
    tags: ['autodocs'],
} satisfies Meta<typeof LazyHashportWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        widgetProps: { mode: 'testnet' },
    },
};
