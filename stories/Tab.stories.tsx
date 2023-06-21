import type { Meta, StoryObj } from '@storybook/react';
import { Tab } from '../packages/ui/Tab';
// import { Tabs, useTheme } from '@mui/material';
import { Tabs } from "../packages/ui/Tabs"
import React, { useState } from 'react';
import ArrowDropDownCircleRoundedIcon from '@mui/icons-material/ArrowDropDownCircleRounded';
// Use this template file to build stories for editing hashport components
// const theme = useTheme();
const meta = {
    title: 'Hashport UI/Component/Tab',
    component: Tab,
    tags: [ 'autodocs' ],
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultTab: Story = {
    args: {
        label: 'Your Input...',
    },
};

export const IconTab: Story = {
    args: {
        ...DefaultTab.args,
        icon: <ArrowDropDownCircleRoundedIcon />
    },
};



