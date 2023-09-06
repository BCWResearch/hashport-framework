import type { Meta, StoryObj } from '@storybook/react';
import { HashportWidgetLoaderButton } from '../packages/widget/src/components/HashportWidget/HashportWidgetLoaderButton';

const meta = {
    title: 'Hashport Widget Loader Button',
    component: HashportWidgetLoaderButton,
    tags: ['autodocs'],
} satisfies Meta<typeof HashportWidgetLoaderButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        widgetProps: { mode: 'testnet' },
    },
};