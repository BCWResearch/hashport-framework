import type { Meta, StoryObj } from '@storybook/react';
import { Tab } from '../packages/ui/Tab';
import { useTheme } from '@mui/material';
import React from 'react';
// Use this template file to build stories for editing hashport components
// const theme = useTheme();
const meta = {
    title: 'Hashport UI/Component/Tabs',
    component: Tab,
    tags: [ 'autodocs' ],
    argTypes: {
        color: { control: 'color', presetColors: [ 'red', 'green' ], description: "This controls the color of the active states font and background." },
        active: { control: 'boolean', description: "This is to control state of tab of weather its selected it or not." },
        label: { control: 'text', description: "This is to insert text to." },
        sx: { control: 'object', description: "Style to override the default style." },
    },
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultTab: Story = {
    args: {
        label: 'Your Input...',
    },
};

export const ActiveTab: Story = {
    args: {
        ...DefaultTab.args,
        active: true,
    },
};

export const CustomTab: Story = {
    args: {
        ...DefaultTab.args,
        active: true,
        sx: ({
            lineHeight: 2,
            fontSize: 100,
            transition: `transform 10s ease, fontSize 1s ease, opacity 1s ease, color 1s ease`,
            transform: `scale(0.8)`,
            [ `&:hover` ]: {
                opacity: 1,
                color: "green"
            }
        })
    }
};


